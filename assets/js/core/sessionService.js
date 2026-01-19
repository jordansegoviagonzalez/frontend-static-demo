import { storage } from "../infra/storage.js";
import { createSession } from "./models.js";

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {"user"|"assistant"} role
 * @property {string} text
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} title
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Message[]} messages
 */

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * Service for managing chat sessions/history.
 */
export const sessionService = {
  /**
   * Retrieves all sessions sorted by most recently updated.
   * @returns {Session[]} List of sessions.
   */
  getAllSessions() {
    const sessions = storage.loadSessions();
    return sessions.sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
  },

  /**
   * Finds a session by its unique ID.
   * @param {string} id 
   * @returns {Session|null} The session object or null if not found.
   */
  getSessionById(id) {
    const sessions = storage.loadSessions();
    return sessions.find(s => s.id === id) || null;
  },

  /**
   * Creates a new chat session.
   * @param {Object} [options] 
   * @param {string} [options.title] Optional title for the session.
   * @returns {Session} The newly created session.
   */
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

    // We do NOT save to storage yet. 
    // The session is only persisted when the first message is sent via saveSession().
    return session;
  },

  /**
   * Updates an existing session (or creates it if missing).
   * @param {Session} session 
   * @returns {Session} The saved session.
   */
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

  /**
   * Renames a session.
   * @param {string} id 
   * @param {string} newTitle 
   * @returns {Session|null} The updated session or null if not found.
   */
  renameSession(id, newTitle) {
    const sessions = storage.loadSessions();
    const idx = sessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    sessions[idx].title = newTitle;
    sessions[idx].updatedAt = nowIso();
    storage.saveSessions(sessions);
    return sessions[idx];
  },

  /**
   * Deletes a session by ID.
   * @param {string} id 
   */
  deleteSession(id) {
    const sessions = storage.loadSessions().filter(s => s.id !== id);
    storage.saveSessions(sessions);
  }
};
