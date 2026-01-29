// Simple prompt policy for Astro Lite.
// In a real system, you might include more context and safety rules here.

export const promptPolicy = {
  buildPrompt({ previousMessages, userText }) {
    // Map internal message format to API format { role, content }
    // Filter out any system/limit messages if they exist locally
    const history = (previousMessages || [])
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({
        role: m.role,
        content: m.text
      }));

    // Add current user message
    return [
      ...history,
      { role: "user", content: userText }
    ];
  }
};
