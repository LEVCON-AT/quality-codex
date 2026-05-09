# Subject-Request-Runbook (DSGVO Art. 15-22)

→ siehe `docs/runbooks/gdpr-subject-request.md` für vollständigen Workflow.

## Quick-Reference

1. Anfrage geht an `privacy@__DOMAIN__`
2. Identitäts-Verifikation (Token-Mail)
3. Eintrag in `gdpr_requests`-Tabelle
4. Bearbeitung innerhalb 30 Tage
5. Audit-Log-Eintrag bei Erfüllung
6. Bestätigungs-Mail

## Skripte

- `infra/scripts/gdpr-export.sh --user-id <uuid>` (Art. 15, 20)
- `infra/scripts/gdpr-delete-user.sh --user-id <uuid>` (Art. 17)

## Eskalation

Wenn nicht erfüllbar: schriftliche Begründung + Hinweis auf Aufsichtsbehörde (in AT: dsb.gv.at).
