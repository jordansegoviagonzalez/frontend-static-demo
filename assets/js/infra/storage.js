const KEY_USERS = "astro.users";
const KEY_CURRENT_USER = "astro.currentUser";
const KEY_SESSIONS = "astro.sessions";

function safeParse(json, fallback) {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export const storage = {
  // Users
  loadUsers() {
    const raw = window.localStorage.getItem(KEY_USERS);
    return safeParse(raw, []);
  },

  saveUsers(users) {
    window.localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },

  getCurrentUser() {
    const raw = window.localStorage.getItem(KEY_CURRENT_USER);
    return safeParse(raw, null);
  },

  setCurrentUser(user) {
    if (!user) {
      window.localStorage.removeItem(KEY_CURRENT_USER);
      return;
    }
    window.localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user));
  },

  // Sessions
  loadSessions() {
    const raw = window.localStorage.getItem(KEY_SESSIONS);
    return safeParse(raw, []);
  },

  saveSessions(sessions) {
    window.localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
  },

  clearAll() {
    window.localStorage.removeItem(KEY_USERS);
    window.localStorage.removeItem(KEY_CURRENT_USER);
    window.localStorage.removeItem(KEY_SESSIONS);
  }
};
