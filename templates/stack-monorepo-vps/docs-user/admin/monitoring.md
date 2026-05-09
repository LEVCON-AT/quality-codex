# Admin: Monitoring

## Healthcheck {#healthcheck}

`/healthz` liefert JSON mit Service-Status:
```json
{ "ok": true, "version": "1.0.0", "uptime_s": 12345 }
```

Uptime-Monitor pings das alle 60s.

## Sentry

Error-Tracking auf https://sentry.io/__ORG__/__SLUG__ (oder self-hosted Sentry).

Alerts bei:
- New error
- Error-Rate-Spike
- Performance-Degradation

## Status-Page

Public unter status.__DOMAIN__ — User können sich subscriben.

## Logs

VPS:
```bash
journalctl -u __SLUG__-bridge -f
docker logs -f __SLUG__-supabase-db
tail -f /var/log/nginx/access.log
```

Cloud: Vercel Dashboard + Supabase Dashboard.

## Performance-Dashboard

Grafana auf grafana.__DOMAIN__ (intern). Panels:
- Response-Time P95
- Error-Rate
- DB-Connections
- Memory/CPU

## Audit-Log

Settings → Audit-Log (sichtbar für owner+admin).
