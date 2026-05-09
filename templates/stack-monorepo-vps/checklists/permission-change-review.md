# Permission Change Review

Bei jeder Änderung an Rollen, Permissions oder Auth-Logic.

## Permission-Matrix
- [ ] `packages/shared/src/permissions.ts` aktualisiert
- [ ] Neue Action in `PERMISSIONS` eingetragen
- [ ] Default ist konservativ (least-privilege — `viewer` nicht hinzugefügt ohne Begründung)

## Defense-in-Depth (3 Schichten)
- [ ] **Frontend:** `<RequireRole>`-Wrapper oder Hook für UI-Hide
- [ ] **Backend:** `requireRole`-Middleware in Fastify
- [ ] **Database:** RLS-Policy auf Tabelle

Niemals nur eine Schicht.

## RLS-Policy
- [ ] `ALTER TABLE x ENABLE ROW LEVEL SECURITY`
- [ ] `ALTER TABLE x FORCE ROW LEVEL SECURITY`
- [ ] Policy für SELECT/INSERT/UPDATE/DELETE
- [ ] Policy nutzt `auth.uid()` und/oder Tenant-ID
- [ ] Wenn complex: Helper-Function via `SECURITY DEFINER`

## Audit-Log
- [ ] Action geloggt: `audit_events.action = '<resource>.<verb>'`
- [ ] `actor_id`, `actor_role`, `tenant_id`, `target_*` gefüllt
- [ ] IP + User-Agent aufgezeichnet

## Migration
- [ ] Neue Spalte mit Default für bestehende Rows
- [ ] Migration idempotent
- [ ] Backwards-compatible (alter Code läuft noch)

## Tests
- [ ] **Authorization-Test:** Rolle X kann Action Y? (positiv-Test)
- [ ] **Bypass-Test:** Rolle X kann Action Y NICHT? (negativ-Test)
- [ ] **IDOR-Test:** User-A → User-B-Resource → 403/404
- [ ] **Tenant-Isolation:** Tenant-A → Tenant-B → 403/404

## Doku
- [ ] `docs/claude/08-roles-permissions.md` Permission-Matrix-Tabelle aktualisiert
- [ ] `docs-user/admin/user-management.md` aktualisiert wenn User-facing
- [ ] Migration-Notes in CHANGELOG bei Breaking-Change

## Rollout-Plan
- [ ] Bei Permission-Verschärfung: existierende User informiert (Mail)
- [ ] Bei Permission-Lockerung: Audit-Trail prüfen ob historische Aktionen jetzt nachgeholt werden müssen
- [ ] Phased-Rollout wenn risk-relevant (1% → 50% → 100%)

## Anti-Patterns
- ❌ "Magic Admin"-Bool im User-Record (alles über Rollen)
- ❌ Permission-Check nur im Frontend
- ❌ Service-Role-Key client-side
- ❌ Permission-Bypass via Special-User (`if user_id === 'admin@...'`)
- ❌ Hardcoded Rollen-Listen verstreut im Code (alles über `PERMISSIONS`-Konstante)
