-- Initial Schema — Idempotent (kann 2× hintereinander ausgeführt werden)
-- DoD: alle Tabellen mit RLS, alle Multi-Tenant-Tabellen mit tenant_id

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- Tenants
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  plan        text NOT NULL DEFAULT 'free',
  status      text NOT NULL DEFAULT 'active',
  created_at  timestamptz DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX IF NOT EXISTS tenants_slug_idx ON tenants(slug) WHERE deleted_at IS NULL;

-- ============================================================
-- Workspace Members (User-Tenant-Membership + Role)
-- ============================================================
CREATE TABLE IF NOT EXISTS workspace_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL,
  role         text NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer', 'guest')),
  invited_by   uuid,
  invited_at   timestamptz DEFAULT now(),
  joined_at    timestamptz,
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS workspace_members_user_idx ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS workspace_members_tenant_idx ON workspace_members(tenant_id);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspace_members_select_own ON workspace_members;
CREATE POLICY workspace_members_select_own ON workspace_members
  FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (
    SELECT tenant_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- ============================================================
-- Audit Events
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid REFERENCES tenants(id) ON DELETE SET NULL,
  actor_id     uuid,
  actor_role   text,
  action       text NOT NULL,
  target_type  text,
  target_id    uuid,
  meta         jsonb,
  ip           inet,
  user_agent   text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_events_tenant_created_idx
  ON audit_events(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_actor_idx
  ON audit_events(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_action_idx
  ON audit_events(action);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_events_view_admin ON audit_events;
CREATE POLICY audit_events_view_admin ON audit_events
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- GDPR Requests
-- ============================================================
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid,
  email         text NOT NULL,
  request_type  text NOT NULL CHECK (request_type IN ('access', 'erasure', 'portability', 'objection')),
  status        text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'verified', 'in_progress', 'fulfilled', 'rejected')),
  received_at   timestamptz DEFAULT now(),
  fulfilled_at  timestamptz,
  notes         text
);

CREATE INDEX IF NOT EXISTS gdpr_requests_user_idx ON gdpr_requests(user_id);
CREATE INDEX IF NOT EXISTS gdpr_requests_status_idx ON gdpr_requests(status);

ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper Functions
-- ============================================================

-- Cached membership-check (verbessert RLS-Performance)
CREATE OR REPLACE FUNCTION user_has_role_in_tenant(p_tenant_id uuid, p_roles text[])
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE tenant_id = p_tenant_id
      AND user_id = auth.uid()
      AND role = ANY(p_roles)
  );
$$;

-- ============================================================
-- Initial Default-Tenant (für Single-Tenant-Setups)
-- ============================================================
INSERT INTO tenants (slug, name)
VALUES ('default', 'Default Workspace')
ON CONFLICT (slug) DO NOTHING;
