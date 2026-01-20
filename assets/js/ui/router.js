let rootEl = null;

function normalizeHash(hash) {
  if (!hash) return "#home";
  if (hash === "#") return "#home";
  return hash;
}

export function updateNavFromHash() {
  const hash = normalizeHash(window.location.hash);
  const buttons = document.querySelectorAll(".astro-nav-link");
  buttons.forEach(btn => {
    const target = btn.getAttribute("data-nav-target");
    if (target === hash) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });
}

async function renderRoute() {
  if (!rootEl) return;
  const hash = normalizeHash(window.location.hash);
  const [path, maybeId] = hash.slice(1).split("/"); // remove '#'

  // 1. Exit Animation
  const currentScreen = rootEl.firstElementChild;
  if (currentScreen) {
    currentScreen.classList.remove("astro-fade-in");
    currentScreen.classList.add("astro-fade-out");
    // Wait for animation (250ms matches CSS)
    await new Promise(resolve => setTimeout(resolve, 240));
  }

  // 2. Prepare Render Function
  let renderer = null;
  
  switch (path) {
    case "home": {
      const module = await import("./screens/homeScreen.js");
      renderer = () => module.renderHomeScreen(rootEl);
      break;
    }
    case "login": {
      const module = await import("./screens/loginScreen.js");
      renderer = () => module.renderLoginScreen(rootEl);
      break;
    }
    case "register": {
      const module = await import("./screens/registerScreen.js");
      renderer = () => module.renderRegisterScreen(rootEl);
      break;
    }
    case "chat": {
      const module = await import("./screens/chatScreen.js");
      renderer = () => module.renderChatScreen(rootEl, { sessionId: maybeId || null });
      break;
    }
    case "history": {
      const module = await import("./screens/historyScreen.js");
      renderer = () => module.renderHistoryScreen(rootEl);
      break;
    }
    case "profile": {
      const module = await import("./screens/profileScreen.js");
      renderer = () => module.renderProfileScreen(rootEl);
      break;
    }
    default: {
      const module = await import("./screens/homeScreen.js");
      renderer = () => module.renderHomeScreen(rootEl);
      break;
    }
  }

  // 3. Swap Content
  rootEl.innerHTML = "";
  if (renderer) renderer();

  // 4. Enter Animation
  if (rootEl.firstElementChild) {
    rootEl.firstElementChild.classList.add("astro-fade-in");
  }

  updateNavFromHash();
}

export function initRouter(root) {
  rootEl = root;
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
