# Testprotokoll — Wave 1 / Item 3: Healthcheck-Endpoint live

**Datum:** 2026-05-09
**Modus:** A (autonom)
**User-Story:** Als Operator möchte ich `/healthz` aufrufen können, damit Uptime-Monitor + Load-Balancer den Service-Status erkennen.
**Tester:** Claude (Playwright + axe-core)
**Branch / Commit:** `feat/wave-1-item-3-healthz` / abc123f

> Beispiel-Protokoll als Referenz. Echtes Wave-Item-Protokoll überschreibt diese Datei (oder neue Datei `wave-N-item-X.md`).

## Soll
- [x] GET `/healthz` liefert 200 OK
- [x] Response-Body ist `{ "ok": true, "version": "0.1.0", "uptime_s": <number> }`
- [x] Response-Time < 100ms p95
- [x] Endpoint ist public (keine Auth nötig)
- [x] Logging: `/healthz`-Calls werden nicht in `audit_events` geloggt (zu viel Noise)

## Ist (Auto-Capture, Modus A)

```
GET https://__STAGING_DOMAIN__/healthz
< HTTP/1.1 200 OK
< Content-Type: application/json
< Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
{ "ok": true, "version": "0.1.0", "uptime_s": 1247 }
```

- ✅ Status: 200
- ✅ Body: korrekt
- ✅ Response-Time: 23ms (p95: 41ms aus 100 Calls) — innerhalb Budget
- ✅ Public-Access: ohne `Authorization`-Header funktioniert
- ✅ Keine `audit_events`-Einträge nach 50 `/healthz`-Calls
- ✅ Security-Headers: HSTS, X-Frame-Options, X-Content-Type-Options vorhanden
- ✅ a11y: N/A (Backend-Endpoint, kein UI)
- ✅ Performance: p95 = 41ms ✓ (Budget: <100ms)

## Findings

| ID | Severity | Beschreibung | Status |
|---|---|---|---|
| (keine) |

## Anhänge

- `screenshots/01-healthz-curl.png` (curl-Output)
- `lighthouse-report.html` (n.v. — Backend-Endpoint)
- `network-log.har` (100 Calls für p95-Messung)

## Sign-off

- ✅ Claude verifiziert (2026-05-09 14:32)
- ☐ User reviewt
