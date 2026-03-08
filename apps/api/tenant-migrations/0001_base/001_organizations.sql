CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  classification TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
