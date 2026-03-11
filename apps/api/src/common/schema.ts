import { query } from "./db";

export async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS orgs (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      org_id UUID,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      parsed_text TEXT,
      skills_extracted JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS org_id UUID;
    ALTER TABLE resumes ADD COLUMN IF NOT EXISTS parsed_text TEXT;
    ALTER TABLE resumes ADD COLUMN IF NOT EXISTS skills_extracted JSONB;

    CREATE TABLE IF NOT EXISTS skills (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS user_skills (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      skill_id UUID NOT NULL,
      confidence NUMERIC(5,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (org_id, user_id, skill_id)
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL UNIQUE,
      headline TEXT,
      summary TEXT,
      location TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS job_postings (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      source_id TEXT NOT NULL,
      external_id TEXT,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      description TEXT,
      url TEXT,
      skills JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS skills JSONB;

    CREATE TABLE IF NOT EXISTS job_matches (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      job_id UUID NOT NULL,
      score NUMERIC(5,2) NOT NULL,
      reasons JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (org_id, user_id, job_id)
    );

    CREATE TABLE IF NOT EXISTS application_intents (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      job_id UUID NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      automation_status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE application_intents ADD COLUMN IF NOT EXISTS automation_status TEXT;

    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      job_id UUID NOT NULL,
      source_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      automation_status TEXT NOT NULL DEFAULT 'queued',
      screenshot_url TEXT,
      logs JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE applications ADD COLUMN IF NOT EXISTS automation_status TEXT;
    ALTER TABLE applications ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
    ALTER TABLE applications ADD COLUMN IF NOT EXISTS logs JSONB;

    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL UNIQUE,
      auto_apply_enabled BOOLEAN NOT NULL DEFAULT false,
      daily_limit INTEGER NOT NULL DEFAULT 10,
      preferred_platforms JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS connectors (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      platform TEXT NOT NULL,
      username TEXT,
      password_encrypted TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
