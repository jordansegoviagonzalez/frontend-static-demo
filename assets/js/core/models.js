export function createUser({ id, name, email, passwordHash, createdAt }) {
  return {
    id,
    name,
    email,
    passwordHash,
    createdAt
  };
}

export function createSession({ id, title, createdAt, updatedAt, messages }) {
  return {
    id,
    title,
    createdAt,
    updatedAt,
    messages: messages || []
  };
}

export function createMessage({ id, role, text, createdAt }) {
  return {
    id,
    role, // "user" | "assistant"
    text,
    createdAt
  };
}
