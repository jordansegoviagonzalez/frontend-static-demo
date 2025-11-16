import { storage } from "../infra/storage.js";
import { createSession } from "./models.js";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso() {
  return new Date().toISOString();
}

export const sessionService = {
  getAllSessions() {
    const sessions = storage.loadSessions();
    return sessions.sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
  },

  getSessionById(id) {
    const sessions = storage.loadSessions();
    return sessions.find(s => s.id === id) || null;
  },

  createSession({ title } = {}) {
    const id = generateId();
    const timestamp = nowIso();
    const session = createSession({
      id,
      title: title || "New chat",
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: []
    });

    const sessions = storage.loadSessions();
    sessions.push(session);
    storage.saveSessions(sessions);
    return session;
  },

  saveSession(session) {
    const sessions = storage.loadSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx === -1) {
      sessions.push(session);
    } else {
      sessions[idx] = session;
    }
    storage.saveSessions(sessions);
    return session;
  },

  renameSession(id, newTitle) {
    const sessions = storage.loadSessions();
    const idx = sessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    sessions[idx].title = newTitle;
    sessions[idx].updatedAt = nowIso();
    storage.saveSessions(sessions);
    return sessions[idx];
  },

  deleteSession(id) {
    const sessions = storage.loadSessions().filter(s => s.id !== id);
    storage.saveSessions(sessions);
  }
};
