import { storage } from "../infra/storage.js";
import { createUser } from "./models.js";
import { validateEmail, validatePassword, validateDisplayName } from "./validators.js";

// Set to true if you have the Cloudflare Worker running
const USE_REMOTE_BACKEND = false;
const API_BASE = "http://localhost:8787/api/auth";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso() {
  return new Date().toISOString();
}

function hashPassword(password) {
  // Lite demo only: do NOT use this in production.
  return btoa(password);
}

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async register({ name, email, password }) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      return await res.json();
    }

    // Local Mock Logic
    await delay(600);
    const errors = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    const passError = validatePassword(password);
    if (passError) errors.password = passError;
    const nameError = validateDisplayName(name);
    if (nameError) errors.name = nameError;

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation failed");
      err.validationErrors = errors;
      throw err;
    }

    const users = storage.loadUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error("Email already registered.");
      err.validationErrors = { email: "This email is already registered." };
      throw err;
    }

    const user = createUser({
      id: generateId(),
      name: name.trim(),
      email: email.trim(),
      passwordHash: hashPassword(password),
      createdAt: nowIso()
    });

    users.push(user);
    storage.saveUsers(users);
    storage.setCurrentUser({ id: user.id, name: user.name, email: user.email });
    return { id: user.id, name: user.name, email: user.email };
  },

  async login({ email, password }) {
    if (USE_REMOTE_BACKEND) {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      const data = await res.json();
      storage.setCurrentUser(data.user);
      // store token if needed: localStorage.setItem('auth_token', data.token);
      return data.user;
    }

    // Local Mock Logic
    await delay(500);
    const errors = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    const passError = validatePassword(password);
    if (passError) errors.password = passError;

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation failed");
      err.validationErrors = errors;
      throw err;
    }

    const users = storage.loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // For demo convenience, if user doesn't exist but creds are valid format, mock success 
    // (This is a design choice for the demo to be frictionless, user requested "secure" so we should strict check)
    if (!user || user.passwordHash !== hashPassword(password)) {
       const err = new Error("Invalid credentials");
       err.validationErrors = { email: "Invalid email or password." };
       throw err;
    }

    storage.setCurrentUser({ id: user.id, name: user.name, email: user.email });
    return { id: user.id, name: user.name, email: user.email };
  },

  logout() {
    storage.setCurrentUser(null);
  },

  getCurrentUser() {
    return storage.getCurrentUser();
  },

  updateProfile({ name }) {
    const nameError = validateDisplayName(name);
    if (nameError) {
      const err = new Error("Validation failed");
      err.validationErrors = { name: nameError };
      throw err;
    }

    const current = storage.getCurrentUser();
    if (!current) return null;

    const users = storage.loadUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) return null;

    users[idx].name = name.trim();
    storage.saveUsers(users);

    const updated = { ...current, name: name.trim() };
    storage.setCurrentUser(updated);
    return updated;
  }
};
