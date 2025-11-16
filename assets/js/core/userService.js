import { storage } from "../infra/storage.js";
import { createUser } from "./models.js";
import { validateEmail, validatePassword, validateDisplayName } from "./validators.js";

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

export const userService = {
  register({ name, email, password }) {
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

  login({ email, password }) {
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
