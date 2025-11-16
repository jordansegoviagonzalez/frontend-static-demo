// Simple prompt policy for Astro Lite.
// In a real system, you might include more context and safety rules here.

const SYSTEM_PROMPT = `
You are Astro, a friendly AI assistant inside a small browser app called Astro Lite.
Your job is to help the user understand concepts clearly and step-by-step, using concise explanations.
Avoid pretending to give financial, legal, or medical advice. If a question touches those areas,
respond with educational, high-level guidance only and remind the user to consult a professional
for real decisions.
`.trim();

export const promptPolicy = {
  buildPrompt({ previousMessages, userText }) {
    const historyText = (previousMessages || [])
      .slice(-6)
      .map(msg => {
        const label = msg.role === "user" ? "User" : "Astro";
        return `${label}: ${msg.text}`;
      })
      .join("\n");

    const parts = [
      SYSTEM_PROMPT,
      "",
      historyText,
      historyText ? "" : null,
      `User: ${userText}`,
      "Astro:"
    ].filter(Boolean);

    return parts.join("\n");
  }
};
