CREATE TABLE IF NOT EXISTS work_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  primary_person_id TEXT,
  title TEXT NOT NULL,
  work_item_type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
