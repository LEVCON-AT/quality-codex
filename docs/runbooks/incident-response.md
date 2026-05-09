# Runbook: Incident Response

## Severity-Levels

| Level | Beispiele | Response-Time | Eskalation |
|---|---|---|---|
| **SEV-1 Critical** | Site komplett down, Data-Breach, Daten-Verlust | <15min | sofort User + Backup-Person |
| **SEV-2 High** | Major-Feature down (Auth, Tasks), Performance-Crash | <1h | User benachrichtigen |
| **SEV-3 Medium** | Single-Feature broken, Performance-Degradation | <4h | Issue erstellen |
| **SEV-4 Low** | Cosmetic-Bug, Minor-Performance, Doku | nächster Sprint | Backlog-Eintrag |

## Detection

Incidents werden erkannt über:
- **Sentry-Alert** (Error-Spike)
- **Uptime-Monitor** (Healthcheck-Fail)
- **User-Report** (Mail an `support@<domain>`)
- **CI-DAST-Scan** (neue Vulnerability)
- **Audit-Log-Anomaly** (z.B. 100 failed Logins in 1min)

## Response-Workflow

### 1. Acknowledge (sofort)
- Sentry/Monitor-Alert bestätigen
- Status-Page auf "investigating" setzen
- Incident-Channel öffnen (eigener Slack/Discord-Kanal pro Incident)

### 2. Triage (in 5min)
- Severity einordnen
- Bereich identifizieren (Frontend / Backend / DB / External)
- Initial-Hypothese formulieren

### 3. Diagnose (zeitkritisch)
```bash
# Logs der letzten 1h
ssh root@<vps> "journalctl -u <slug>-bridge --since '1 hour ago' | tail -200"

# Container-Status
docker ps -a
docker stats --no-stream

# DB-Connection
psql ... -c "SELECT count(*) FROM pg_stat_activity"

# Letzter Deploy
git log --oneline -5

# Sentry-Issues
gh issue list --label sentry --state open
```

### 4. Mitigate (Stabilisieren > Lösung)

Reihenfolge:
1. **Rollback** wenn klar dass letzter Deploy Ursache (siehe `rollback.md`)
2. **Feature-Flag** deaktivieren wenn vorhanden
3. **Rate-Limit** verschärfen wenn DoS-Pattern
4. **Service-Neustart** wenn Memory/Connection-Leak
5. **DB-Restore** wenn Daten-Korruption

### 5. Resolve

Ursache nachhaltig fixen — Hotfix-Branch wenn Production-relevant.

### 6. Communicate

- **Status-Page-Update** bei jedem Schritt
- **User-Notification** bei SEV-1/2 (E-Mail an alle aktiven User)
- **Stakeholder-Update** stündlich bei laufendem Incident

### 7. Post-Mortem (innerhalb 48h)

Template `docs/incidents/YYYY-MM-DD-<slug>.md`:
```markdown
# Incident: <Titel>

**Severity:** SEV-1
**Datum:** YYYY-MM-DD HH:MM
**Dauer:** XXmin
**Affected Users:** ~XX

## Was ist passiert?

<chronologisch>

## Root-Cause

<technisch genau>

## Resolution

<was den Fix gebracht hat>

## Detection

<wie wurde es entdeckt + wann ideal hätten wir es früher gefunden>

## Action Items

| ID | Beschreibung | Owner | Due |
|---|---|---|---|
| AI-1 | Test für diesen Fall ergänzen | <user> | Wave N+1 |
| AI-2 | Monitoring-Alert für Pattern X | <user> | sofort |

## Was lief gut

- ...

## Was lernen wir

- ...
```

## Data-Breach-Response (DSGVO Art. 33/34)

Wenn personenbezogene Daten betroffen:

1. **Innerhalb 1h:** Triage, Severity, Datenschutz-Beauftragten informieren
2. **Innerhalb 24h:** Forensische Analyse — was, wieviel, wer
3. **Innerhalb 72h:** Meldung an Aufsichtsbehörde (in AT: dsb.gv.at)
4. **Bei hohem Risiko:** Direkt-Notification an betroffene User
5. **Dokumentation** im Incident-Register

Template: `legal/data-breach-notification.md`

## Notfall-Kontakte

`docs/runbooks/contacts.md` (gitignored, in 1Password) listet:
- DPO / Datenschutzbeauftragter
- Backup-Person für Solo-Dev
- Hosting-Provider Support
- Domain-Provider Support
- Stakeholder / Investor (wenn relevant)

## Anti-Patterns

- ❌ Stille Reparaturen ohne Communication
- ❌ Wochen-späte Post-Mortems
- ❌ "Fix in next deploy" bei SEV-1
- ❌ Stack-Trace in User-Communication
- ❌ Voreilige Schuldzuweisungen vor Root-Cause
