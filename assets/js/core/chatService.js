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
   * @param {function(string): void} [params.onUpdate] - Callback for streaming updates (receives full text so far or delta, depending on impl. Here we assume delta or we manage full text locally).
   * @returns {Promise<{session: import("./sessionService.js").Session, reply: import("./sessionService.js").Message}>}
   */
  async sendMessage({ sessionId, userText, userMessageId, onUpdate }) {
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

    // Create AI placeholder immediately
    const aiMsg = createMessage({
      id: generateId(),
      role: "assistant",
      text: "", // Start empty
      createdAt: nowIso()
    });
    session.messages.push(aiMsg);

    // Stream handler
    const handleChunk = (delta) => {
      aiMsg.text += delta;
      if (onUpdate) onUpdate(aiMsg.text); // Pass full accumulated text to UI
    };

    const aiText = await hfClient.generateText(prompt, handleChunk);
    
    // Ensure final text is set (handling any race conditions or non-stream fallbacks)
    aiMsg.text = aiText;

    session.updatedAt = nowIso();
    
    session = sessionService.saveSession(session);

    return { session, reply: aiMsg };
  }
};
