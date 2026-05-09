# Admin: Backup & Restore

## Automatisch

Tägliche Backups laufen automatisch um 03:00 UTC und werden verschlüsselt nach __BACKUP_PROVIDER__ hochgeladen.

## Manuell

```bash
ssh root@__VPS__
cd /opt/__SLUG__
./infra/scripts/backup-postgres.sh manual
```

## Wöchentliche Verifikation

GitHub-Workflow `backup-verify.yml` läuft sonntags 03:00 UTC und prüft, ob das letzte Backup wieder einspielbar ist.

## Restore

1. Service stoppen
2. Aktuelles Backup als pre-restore-Snapshot
3. `./infra/scripts/restore-postgres.sh <backup-file> --confirm`
4. Service starten
5. Smoketest

Detail: `docs/runbooks/db-restore.md`.

## Disaster Recovery

RTO < 2h, RPO < 24h.
DR-Drill alle 6 Monate Pflicht — siehe `docs/runbooks/db-restore.md`.
