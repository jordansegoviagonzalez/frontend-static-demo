import { sessionService } from "./sessionService.js";
import { promptPolicy } from "./promptPolicy.js";
import { hfClient } from "../infra/hfClient.js";
import { createMessage } from "./models.js";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * Service orchestrating the chat flow: user input -> state update -> AI call -> state update.
 */
export const chatService = {
  /**
   * Ensures a valid session exists. If sessionId is provided and valid, returns it.
   * Otherwise creates a new one.
   * @param {string|null} sessionId 
   * @returns {import("./sessionService.js").Session}
   */
  ensureSession(sessionId) {
    if (sessionId) {
      const existing = sessionService.getSessionById(sessionId);
      if (existing) return existing;
    }
    return sessionService.createSession({ title: "New chat" });
  },

  /**
   * Sends a user message to the AI and gets a response.
   * Updates the session with both user and AI messages.
   * @param {Object} params
   * @param {string} [params.sessionId]
   * @param {string} params.userText
   * @returns {Promise<{session: import("./sessionService.js").Session, reply: import("./sessionService.js").Message}>}
   */
  async sendMessage({ sessionId, userText, userMessageId }) {
    let session = this.ensureSession(sessionId);
    const userMsg = createMessage({
      id: userMessageId || generateId(),
      role: "user",
      text: userText,
      createdAt: nowIso()
    });

    session.messages.push(userMsg);

    const prompt = promptPolicy.buildPrompt({
      previousMessages: session.messages,
      userText
    });

    const aiText = await hfClient.generateText(prompt);

    const aiMsg = createMessage({
      id: generateId(),
      role: "assistant",
      text: aiText,
      createdAt: nowIso()
    });

    session.messages.push(aiMsg);
    session.updatedAt = nowIso();
    session = sessionService.saveSession(session);

    // -- Auto-Titling (Background Task) --
    // If this is the first exchange, generate a smart title
    if (session.messages.length <= 2 && session.title === "New chat") {
      this.generateTitle(session.id, userText).catch(err => {
        console.warn("Failed to auto-title session:", err);
      });
    }

    return { session, reply: aiMsg };
  },

  /**
   * Generates a short title based on the user's first message.
   * @param {string} sessionId
   * @param {string} userText
   */
  async generateTitle(sessionId, userText) {
    // Keep it cheap and fast: ask for a very short summary
    const prompt = `
<start_of_turn>user
Generate a short, concise title (maximum 5 words) for this chat message. Do not use quotes.
Message: "${userText}"<end_of_turn>
<start_of_turn>model
`;
    
    let title = await hfClient.generateText(prompt);
    
    // Cleanup: Remove quotes or extra whitespace if the model adds them
    title = title.replace(/["']/g, "").trim();
    
    if (title) {
      sessionService.renameSession(sessionId, title);
    }
  }
};
