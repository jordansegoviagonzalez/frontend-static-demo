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

export const chatService = {
  ensureSession(sessionId) {
    if (sessionId) {
      const existing = sessionService.getSessionById(sessionId);
      if (existing) return existing;
    }
    return sessionService.createSession({ title: "New chat" });
  },

  async sendMessage({ sessionId, userText }) {
    let session = this.ensureSession(sessionId);
    const userMsg = createMessage({
      id: generateId(),
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

    return { session, reply: aiMsg };
  }
};
