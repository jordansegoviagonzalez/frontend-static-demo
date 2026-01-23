-- Migration number: 0001_initial_schema.sql

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,         -- Nullable because OAuth users won't have a password
  provider TEXT DEFAULT 'local', -- 'local', 'google', 'apple', 'microsoft'
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_users_email ON users(email);
