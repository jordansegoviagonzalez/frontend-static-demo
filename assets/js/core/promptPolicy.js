// Simple prompt policy for Astro Lite.
// In a real system, you might include more context and safety rules here.

const SYSTEM_PROMPT = `
You are Astro AI, a powerful, open frontier large language model focused on general reasoning, science, and advanced research. 
Answer with clarity, accuracy, and transparency. Always strive to provide answers that directly help the user achieve their goal or find what they are looking for. 
Be engaging, supportive, and adapt your responses to maximize user satisfaction.
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
