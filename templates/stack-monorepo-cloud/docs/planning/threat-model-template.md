# Threat Model — STRIDE

**Component / Feature:** <Name>
**Datum:** YYYY-MM-DD
**Methodik:** STRIDE per [Microsoft SDL](https://www.microsoft.com/en-us/securityengineering/sdl)

## Data-Flow-Diagram (textuell)

```
User Browser
   │ HTTPS, JWT-Cookie
   ▼
Vercel Edge / nginx
   │ HTTP, Auth-Header
   ▼
Backend (Fastify)
   │ Postgres-Connection-Pool
   ▼
Supabase Postgres
   ↑
   │ Read-only-Backup
   ▼
Backblaze B2 (encrypted)
```

## Trust-Boundaries

| Boundary | Was passiert hier |
|---|---|
| **Browser ↔ CDN/Edge** | TLS, kein direkter Code-Run |
| **CDN ↔ Backend** | Auth-JWT-Validation |
| **Backend ↔ DB** | RLS + Service-Role-Key (nicht in Frontend) |
| **Backend ↔ Backup-Storage** | age-encrypted, Schlüssel separat |

## STRIDE Walk-Through

### Spoofing — Identitätsfälschung
| Threat | Mitigation | Status |
|---|---|---|
| Angreifer impersoniert User via gestohlenem JWT | JWT-Rotation, Session-Invalidation bei Password-Change, Short-Lifetime (15min Access-Token), Refresh-Token mit DB-Tracking | ✅ |
| Phishing-Login | Rate-Limit auf Login, Anomaly-Detection (neue Geo), MFA-Optional | 🟡 MFA pending |
| API-Key-Leak | Server-side Proxy für Anthropic, nie im Frontend | ✅ |

### Tampering — Daten-Manipulation
| Threat | Mitigation | Status |
|---|---|---|
| Man-in-the-Middle | TLS 1.3, HSTS preload | ✅ |
| Form-Tampering | CSRF-Token + SameSite=Strict | ✅ |
| Direct-DB-Manipulation | RLS FORCE, app-user ohne SUPERUSER | ✅ |
| Supply-Chain (kompromittiertes Package) | `pnpm audit`, lockfile-frozen, SBOM | ✅ |

### Repudiation — Abstreitbarkeit
| Threat | Mitigation | Status |
|---|---|---|
| User streitet Aktion ab | Audit-Log mit IP+UA+Timestamp | ✅ |
| Admin streitet Privilege-Change ab | Audit-Log immutable, Aufsichts-Kontrolle | ✅ |

### Info-Disclosure — Daten-Leak
| Threat | Mitigation | Status |
|---|---|---|
| Stack-Trace zum Client | Generic 500, Details ins Log | ✅ |
| RLS-Bypass | RLS FORCE, regelmäßige Pen-Tests | ✅ |
| Logs leaken Secrets | regex-Filter + structured-logging mit redact | ✅ |
| Backup-Datei kompromittiert | age-Verschlüsselung, Schlüssel separat | ✅ |
| Side-Channel (Timing) | constant-time-compare für Token | 🟡 review |

### Denial-of-Service
| Threat | Mitigation | Status |
|---|---|---|
| Brute-Force-Login | Rate-Limit 5/min/IP, Account-Lockout nach 10 fails | ✅ |
| API-Spam | Rate-Limit per User+IP, Body-Size-Limit | ✅ |
| Slow-Loris | nginx limits, Connection-Timeout | ✅ |
| Resource-Exhaustion (große Queries) | Query-Timeout, Pagination Pflicht | ✅ |
| Distributed-DoS | Cloudflare-Layer (optional) | 🔴 not yet |

### Elevation-of-Privilege
| Threat | Mitigation | Status |
|---|---|---|
| IDOR (ID-Manipulation) | RLS + Permission-Check + IDOR-Tests | ✅ |
| Vertical-Privilege (viewer → admin) | Permission-Matrix exakt, RBAC-Middleware | ✅ |
| Horizontal-Privilege (User-A liest User-B) | RLS auf user_id | ✅ |
| Tool-Use-Bypass (MCP Tool ohne Auth) | MCP-Tool-Auth-Context Pflicht | ✅ |

## Findings & Action-Items

| ID | Severity | Description | Owner | Due |
|---|---|---|---|---|
| T001 | High | MFA-Optional → MFA-Pflicht für admin/owner | <user> | Wave 4 |
| T002 | Medium | Cloudflare-Layer für DDoS-Schutz | <user> | Pre-1.0 |
| T003 | Low | constant-time-compare in Token-Verify | <user> | Backlog |

## Wann re-modellieren

- Neuer External-Service / Sub-Prozessor
- Neuer User-Input-Path
- Major-Architektur-Change
- Nach Pen-Test
- Quartalsweise (Routine)
