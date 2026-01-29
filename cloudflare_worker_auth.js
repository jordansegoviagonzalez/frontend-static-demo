
/**
 * Cloudflare Worker for Authentication
 * Handles:
 * - Email/Password Login
 * - Registration
 * - Social Login Redirects (Google, Apple, Microsoft)
 * - JWT Token Generation
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/" && request.method === "POST") {
        return await handleChat(request, env);
      }
      if (path === "/api/auth/login" && request.method === "POST") {
        return await handleLogin(request, env);
      }
      if (path === "/api/auth/register" && request.method === "POST") {
        return await handleRegister(request, env);
      }
      if (path.startsWith("/api/auth/social/")) {
        const provider = path.split("/").pop();
        return handleSocialLogin(provider, env);
      }
      if (path === "/api/auth/forgot-password" && request.method === "POST") {
        return new Response(JSON.stringify({ message: "Reset link sent" }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }

      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
  }
};

async function handleLogin(request, env) {
  const { email, password } = await request.json();

  // In a real app, validate against env.USERS_KV or database
  // Here we mock a successful login for demonstration if password is provided
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  // Mock user retrieval
  const user = {
    id: "user_" + Math.random().toString(36).slice(2),
    email,
    name: email.split("@")[0]
  };

  // Generate JWT (mock)
  const token = btoa(JSON.stringify({ sub: user.id, exp: Date.now() + 3600000 }));

  return new Response(JSON.stringify({ user, token }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
  });
}

async function handleRegister(request, env) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  // Mock creation
  const user = {
    id: "user_" + Math.random().toString(36).slice(2),
    email,
    name: name || email.split("@")[0]
  };

  return new Response(JSON.stringify({ user }), {
    status: 201,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
  });
}

function handleSocialLogin(provider, env) {
  const redirectMap = {
    google: "https://accounts.google.com/o/oauth2/v2/auth",
    apple: "https://appleid.apple.com/auth/authorize",
    microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
  };

  const target = redirectMap[provider];
  if (!target) {
    return new Response("Provider not supported", { status: 400, headers: CORS_HEADERS });
  }

  // In a real app, we would construct the full URL with client_id, redirect_uri, scopes, etc.
  // const location = `${target}?client_id=${env[provider.toUpperCase() + "_CLIENT_ID"]}&...`;
  
  // For now, we return a JSON redirect instruction or 302
  return Response.redirect(target, 302);
}

async function handleChat(request, env) {
  try {
    const { prompt, messages } = await request.json();
    
    if (!prompt && (!messages || !Array.isArray(messages))) {
      return new Response(JSON.stringify({ error: "Prompt or messages array is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }

    const API_KEY = env.OAI_API_TOKEN; // Secret env var
    const MODEL = "Qwen/Qwen2.5-72B-Instruct"; // Enforcing high-quality model

    const systemMsg = {
      role: "system",
      content: "You are AstroAI, an intelligent assistant created by Jordan Segovia. You are not Qwen, Alibaba, or Hugging Face. You are a helpful, harmless, and honest AI assistant."
    };

    let finalMessages;
    if (messages) {
      // Client sent history. Prepend system message.
      finalMessages = [systemMsg, ...messages];
    } else {
      // Legacy fallback (single turn)
      finalMessages = [
        systemMsg,
        { role: "user", content: prompt }
      ];
    }

    const payload = {
      model: MODEL,
      messages: finalMessages,
      stream: true,
      max_tokens: 2048
    };

    const upstreamResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text();
      return new Response(JSON.stringify({ error: "Upstream error", details: errText }), {
        status: upstreamResponse.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }

    // Forward the stream directly with SSE headers
    return new Response(upstreamResponse.body, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
}
