CREATE TABLE IF NOT EXISTS activity_records (
  id TEXT PRIMARY KEY,
  work_item_id TEXT,
  person_id TEXT,
  activity_type TEXT NOT NULL,
  details TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
