# Security-Review-Methodik

Lokale Substanz aus `security-review`-Skill.

## ASVS-Sweep (Application Security Verification Standard L2)

Pflicht-Pass bei jedem Auth/Permission/API-Change. Siehe https://github.com/OWASP/ASVS.

### Top-Bereiche (für Codex relevant)

| Section | Fokus |
|---|---|
| **V2** Authentication | PW-Policy, MFA, Session, Brute-Force-Protection |
| **V3** Session-Management | Token-Lifetime, Logout, Rotation |
| **V4** Access-Control | RBAC, RLS, IDOR-Schutz |
| **V5** Input-Validation | Zod, Sanitization, CSRF, SSRF |
| **V7** Cryptography | argon2id, AES-GCM, kein eigener Algo |
| **V8** Error-Handling | keine Stack-Traces zum Client, structured Logs |
| **V10** Malicious-Code | Supply-Chain (`pnpm audit`), Secret-Scan |
| **V13** Web-Services | OpenAPI, Rate-Limit, Auth-Pflicht |

## STRIDE-Walk-Through

Pro neuem Endpoint / Service / Data-Flow:

### Spoofing
- Wer behauptet, wer zu sein? → Auth-Pflicht?
- Identity-Validation korrekt? (JWT-Signature, Cert)

### Tampering
- Wer kann Daten in transit verändern? → TLS, CSRF-Token
- Wer kann gespeicherte Daten verändern? → RBAC, RLS, Audit-Log
- Input-Validation lückenlos? → Zod an allen Grenzen

### Repudiation
- Können Aktionen abgestritten werden? → Audit-Log Pflicht für privilegierte Actions
- Logs manipulierbar? → write-once / append-only

### Info-Disclosure
- Werden sensitive Daten geleakt? → keine Stack-Traces, generic 500
- RLS aktiv? → ja, FORCE ROW LEVEL SECURITY
- Logs filtern Secrets? → regex-check

### DoS
- Rate-Limiting? → ja, per-IP + per-User
- Body-Size-Limit? → Fastify/Express config
- Query-Timeout? → DB + HTTP
- Resource-Exhaustion möglich? → Pagination, max-array-size

### Elevation-of-Privilege
- IDOR möglich? → ID-Manipulation testen, Permission-Check exakt
- Permission-Check nach Auth? → ja, vor jedem state-change
- "Service-Role"-Bypass? → niemals client-side

## Pentest-Pflicht-Tests

Pre-Release: alle 7 Suites grün.

### XSS-Injection (`tests/security/xss-injection.spec.ts`)
Payloads gegen alle Inputs:
- `<script>alert(1)</script>`
- `<img src=x onerror=alert(1)>`
- `javascript:alert(1)` als Link-href
- `"><svg onload=alert(1)>`

Erwartung: alle escaped, keine Execution.

### SQL-Injection (`tests/security/sqli-injection.spec.ts`)
Payloads:
- `' OR 1=1--`
- `'; DROP TABLE users--`
- `1 UNION SELECT * FROM users`

Erwartung: parameterized Queries fangen alles, keine DB-Manipulation.

### IDOR (`tests/security/idor.spec.ts`)
- User-A erstellt Resource X
- User-B versucht GET/PATCH/DELETE auf X
- Erwartung: 403/404, kein Zugriff

### CSRF (`tests/security/csrf.spec.ts`)
- State-changing Request ohne Origin-Header
- Mit gefälschtem Origin
- Mit fehlenden CSRF-Token
- Erwartung: 403

### Path-Traversal (`tests/security/path-traversal.spec.ts`)
- `../../etc/passwd` als File-Path
- `..\..\..\Windows\System32`
- URL-encoded: `%2e%2e%2f%2e%2e%2f`
- Erwartung: 400/403, kein File-Read

### Auth-Bypass (`tests/security/auth-bypass.spec.ts`)
- JWT mit `alg: none`
- Expired JWT
- JWT manipuliert (`role: admin`)
- Empty `Authorization` Header
- Erwartung: 401, kein Zugriff

### Rate-Limit (`tests/security/rate-limit.spec.ts`)
- 100 Login-Versuche in 1min
- 1000 API-Calls in 1min
- Erwartung: ab Schwellwert 429-Responses

## DAST (ZAP-Baseline)

Nightly gegen Staging:
```yaml
# .github/workflows/dast-scan.yml
- uses: zaproxy/action-baseline@v0.10.0
  with:
    target: 'https://staging.${{ env.DOMAIN }}'
    rules_file_name: '.zap/rules.tsv'
```

Findings in CI-Output, alle High/Medium müssen triaged sein vor Prod-Deploy.

## Security-Headers-Verify

```bash
curl -I https://staging.<domain>
```

Erwartete Headers:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; ...`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

`securityheaders.com`-API → Grade A+ Pflicht.

## TLS-Verify

```bash
testssl.sh https://staging.<domain>
```

Erwartung: Grade A+, TLS 1.3 only, kein Weak-Cipher.

## Common Findings & Fixes

| Finding | Fix |
|---|---|
| Stack-Trace in Error-Response | Generic 500, Details nur ins Log |
| Cookie ohne HttpOnly+Secure+SameSite | Flags setzen |
| CORS zu permissiv (`*`) | Explizite Origin-Liste |
| `eval()` / `new Function()` | Refactor — niemals nötig |
| `dangerouslySetInnerHTML` ohne Sanitizer | DOMPurify oder strikte Allowlist |
| File-Upload ohne MIME-Check | Whitelist + magic-bytes-check |
| Redirect ohne Allowlist | URL-Validation gegen erlaubte Domains |

## Severity-Schwellen

| CVSS | Triage |
|---|---|
| **9.0–10.0 Critical** | Sofort, Hotfix-Branch |
| **7.0–8.9 High** | Innerhalb 7 Tage |
| **4.0–6.9 Medium** | Nächster Sprint |
| **0.1–3.9 Low** | Backlog Tech-Debt |
