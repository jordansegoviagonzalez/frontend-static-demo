export function validateEmail(email) {
  if (!email) return "Email is required.";
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(trimmed)) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateDisplayName(name) {
  if (!name) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
}
