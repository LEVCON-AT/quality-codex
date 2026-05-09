# Incident Response Checklist

Quick-Reference während Incident — siehe `runbooks/incident-response.md` für Detail-Workflow.

## Acknowledge (sofort)
- [ ] Sentry/Monitor-Alert bestätigen
- [ ] Status-Page auf "investigating"
- [ ] Incident-Channel öffnen

## Triage (5min)
- [ ] Severity einordnen (SEV-1/2/3/4)
- [ ] Bereich identifizieren (Frontend/Backend/DB/External)
- [ ] Initial-Hypothese

## Diagnose
- [ ] Logs der letzten 1h sichten
- [ ] Container-Status prüfen
- [ ] Letzten Deploy-Diff prüfen
- [ ] DB-Connection-Test
- [ ] External-Provider-Status (Supabase, Vercel, …)

## Mitigate
- [ ] Rollback wenn klar
- [ ] Feature-Flag deaktivieren
- [ ] Rate-Limit verschärfen bei DoS
- [ ] Service-Restart bei Memory-/Connection-Leak
- [ ] DB-Restore bei Daten-Korruption

## Communicate
- [ ] Status-Page-Update
- [ ] User-Notification (SEV-1/2)
- [ ] Stakeholder-Update stündlich

## Resolve
- [ ] Hotfix-Branch
- [ ] Pre-Release-Checkliste (verkürzt)
- [ ] Deploy
- [ ] Smoketest

## Post-Incident
- [ ] Post-Mortem innerhalb 48h (`docs/incidents/YYYY-MM-DD-<slug>.md`)
- [ ] Action-Items in BACKLOG
- [ ] Audit-Log-Eintrag (`action: 'ops.incident'`)

## Data-Breach (DSGVO)
- [ ] DPO informiert (innerhalb 1h)
- [ ] Forensik (innerhalb 24h)
- [ ] Aufsichtsbehörde-Meldung (innerhalb 72h)
- [ ] User-Notification bei hohem Risiko
