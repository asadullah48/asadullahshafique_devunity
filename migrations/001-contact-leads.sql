-- Additive migration; contains no lead data. Apply manually to the intended Postgres database.
BEGIN;
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  read BOOLEAN DEFAULT false,
  responded BOOLEAN DEFAULT false
);
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS company VARCHAR(200);
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS enquiry_type VARCHAR(30)
  CHECK (enquiry_type IN ('job', 'freelance project', 'other'));
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS alert_status VARCHAR(20) NOT NULL DEFAULT 'pending';
CREATE TABLE IF NOT EXISTS contact_rate_limits (
  visitor_hash CHAR(64) PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL
);
COMMIT;
