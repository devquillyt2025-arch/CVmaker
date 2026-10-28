-- FolioX cloud storage. Safe to re-run: every statement is IF NOT EXISTS.
-- Apply with `npm run db:setup`.

-- One row per resume. There are no accounts: `owner_id` is the random id kept
-- in the browser's `fx_owner` cookie, so only that browser can read or write it.
-- `content` holds everything the builder persists: the resume data plus the
-- template, section order, hidden sections and design settings.
CREATE TABLE IF NOT EXISTS resumes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid        NOT NULL,
  content    jsonb       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resumes_owner_updated_idx ON resumes (owner_id, updated_at DESC);

-- Optional name shown on the dashboard ("Backend — Stripe"). NULL means the
-- dashboard derives one from the resume's name and job title.
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS title text;
