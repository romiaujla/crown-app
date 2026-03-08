CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  email TEXT,
  role_label TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
