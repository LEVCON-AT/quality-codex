# Pre-Release Checklist

Vor jedem Tag/Prod-Deploy.

## Tech
- [ ] Pre-Merge-PR-Checkliste vollständig grün
- [ ] Pentest-Suite grün (alle 7 spec.ts-Files)
- [ ] DAST-Scan letzter Run grün
- [ ] Security-Baseline-Verify (testssl + headers) A+
- [ ] Backup vor Deploy verifiziert (letzte 24h)
- [ ] Migration-2-Pass-Test grün
- [ ] Rollback-Skript getestet im letzten Quartal

## Doku
- [ ] User-Doku aktualisiert für alle Wave-Items
- [ ] Wiki-Build grün
- [ ] CHANGELOG.md auto-generiert + reviewed
- [ ] Breaking-Changes (falls Major) im CHANGELOG hervorgehoben

## Compliance
- [ ] Privacy-Policy aktuell (bei neuen Sub-Prozessoren)
- [ ] Cookie-Consent-Konfig aktuell (bei neuen Tracking-Tools)
- [ ] PII-Inventar aktuell (bei neuen Datenfeldern)

## Communication
- [ ] Status-Page-Update geplant (falls Maintenance-Window)
- [ ] User-Notification vorbereitet (bei Breaking-Changes)
- [ ] Marketing-Update koordiniert (bei Feature-Release)

## Approval
- [ ] User klickt "Run Workflow" für Prod-Deploy
- [ ] Zeitfenster gewählt (nicht Freitag-Nachmittag)
- [ ] Backup-Person erreichbar während Deploy

## Post-Deploy-Plan
- [ ] Monitoring-Window 30min nach Deploy
- [ ] Sentry-Watch
- [ ] Status-Page-Update auf "operational"
- [ ] Tag setzen wenn alles grün
- [ ] Release-Notes in GitHub veröffentlichen
