# Operations Mandate für Claude

Definiert, was Claude am produktiven System tun darf — und was nicht.

## Kontext

Bei VPS-Variante hat Claude SSH-Zugang zum Server (Key in `~/.ssh/<slug>_deploy`). Bei Cloud-Variante: API-Tokens für Vercel + Supabase. Mit Macht kommt Verantwortung — dieses Mandat ist verbindlich.

## Was Claude DARF (ohne extra Rückfrage)

- **Logs lesen**
  - `journalctl -u <service> --since "1 hour ago"`
  - Docker-Logs: `docker logs <container> --tail 200`
  - nginx access/error: `tail /var/log/nginx/{access,error}.log`
- **Healthcheck-Verifikation**
  - `curl -sf https://<staging>/healthz | jq`
  - Container-Status: `docker ps`, `docker stats`
  - DB-Migration-Status: `SELECT * FROM schema_migrations ORDER BY version DESC LIMIT 5`
- **Read-only-DB-Queries** über `read-only`-DB-User
- **Backup-Restore-Drills** in ephemeren Containern (nicht prod-DB)
- **Smoketest nach Deploy** ausführen (`infra/scripts/smoketest.sh`)
- **Deploy-Ergebnis pollen** und User über Status informieren
- **Log-Diagnose** bei Fehlschlag (was war im Log, welcher Commit-Diff)

## Was Claude NICHT DARF (ohne explizites User-OK)

- **Prod-DB schreiben/löschen** — keine `INSERT`/`UPDATE`/`DELETE`/`ALTER` direkt
- **Secrets rotieren** auf Prod (nur Vorschlag; User triggert)
- **`git push --force`** auf `main` oder geschützte Branches
- **Prod-Container stoppen** — nur über `infra/scripts/rollback.sh` mit User-OK
- **DB-Schema ändern** außerhalb von Migrations-Workflow
- **Backup löschen** (auch alte) — nur über GFS-Rotation
- **destruktive Linux-Commands:** `rm -rf`, `dd`, `chmod 777` rekursiv, `chown` auf System-Verzeichnissen
- **`sudo`-Befehle** außer für dokumentierte Wartungs-Skripte
- **Externe Calls** mit Prod-Daten (z.B. `curl` mit DB-Dump als Body)

## Auto-Nachbessern nach Deploy

Wenn Smoketest nach Deploy rot:

1. **Diagnose** (Claude darf):
   - Logs der letzten 5min lesen
   - Letzten Commit-Diff prüfen
   - Migration-Status prüfen
   - Container-Status prüfen
2. **Vorschlag** an User:
   - "Build x ist red, weil <Diagnose>. Ich schlage vor: <Fix>. Soll ich Rollback (`infra/scripts/rollback.sh`) ausführen oder Fix in Hotfix-Branch implementieren?"
3. **Nach User-OK** ausführen:
   - Rollback: `infra/scripts/rollback.sh` mit Argument vorherige-Tag-Version
   - Hotfix: Branch erstellen, Fix implementieren, normaler Deploy-Pfad

## Authentication

- **SSH-Key** in `~/.ssh/<slug>_deploy` (rsa 4096 oder ed25519)
- **Key-Passphrase** im 1Password/Bitwarden — Claude fragt User wenn nötig
- **Server akzeptiert** nur Key-Auth, nicht Password
- **Key-Rotation** alle 6 Monate (`infra/scripts/ssh-deploy-rotate.sh`)

## Logging

Jede SSH-Session loggt sich in `audit_events`-Tabelle:
- `action: 'ops.ssh_session'`
- `actor: 'claude'`
- `meta: { commands_run: [...], duration_s: X }`

Der User kann jederzeit sehen, was Claude wann gemacht hat.

## Notfall-Override

Bei kritischen Outages (Site komplett down, Daten gefährdet):
- User kann via `Allow Operations Override`-Statement explizit erweiterte Rechte erlauben
- Befristet auf konkrete Aufgabe ("Restore Backup von X")
- Nach Aufgaben-Abschluss zurück auf Standard-Mandat
- Audit-Log dokumentiert Override (wann, warum, durch wen)

## Cloud-Variante (Vercel + Supabase Cloud)

Analoge Regeln:
- **DARF:** Logs lesen, Deployment-Status pollen, Database-Read-Queries, Edge-Function-Logs
- **DARF NICHT:** Prod-Env-Variables ändern, Database-Writes, Branch-Protection ändern, Project-Delete

## Pflicht-Self-Check

Vor jeder destructive-aussehenden Operation fragt Claude sich selbst:
- Ist das in meiner DARF-Liste?
- Wenn nein: ist explizites User-OK eingeholt?
- Wenn ja: ist die Operation reversibel?
- Wenn nein: gibt es einen Backup-Stand?

Bei Unsicherheit → User fragen.

## Updates

Dieses Mandat wird vom User pro Projekt im Onboarding bestätigt und ist Teil der `00-codex-decisions.md`. Änderungen erfordern explizites User-Update.
