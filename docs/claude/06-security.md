# 06 — Security

Tier-2-Doc — Pflicht-Read bei Auth/Permission/API-Code.

## Standards

- **OWASP ASVS Level 2** — Pflicht-Referenz
- **OWASP Top 10 (2021)** — Web-Vulnerabilities
- **OWASP API Security Top 10** — bei API/Backend
- **CWE Top 25** — Code-Weaknesses
- **STRIDE** — Threat-Modeling-Methodik
- **Mozilla Observatory / securityheaders.com** — Headers Grade A+

## Setup-Härtung (im Template fertig)

### VPS-Variante
- SSH: Key-only, port-change, fail2ban, ufw (`infra/scripts/ssh-hardening.sh`)
- nginx: TLS 1.3 only, HSTS, CSP, X-Frame-Options DENY, X-Content-Type nosniff (`infra/nginx/security-headers.conf`)
- Docker: read_only, no-new-privileges, cap_drop ALL, rootless wo möglich
- Postgres: `password_encryption=scram-sha-256`, RLS FORCE, app-user ohne SUPERUSER
- Backups: `age`-verschlüsselt vor Upload, Schlüssel separat (1Password/Bitwarden)
- Verify: `infra/scripts/verify-security-baseline.sh` muss A+ liefern

### Cloud-Variante
- Supabase Cloud: RLS FORCE, JWT-Rotation, IP-Allowlist
- Vercel: CSP via `vercel.json`, gleiche Header

## Architektur-Security (Secure-by-Design)

### STRIDE bei jedem neuen Endpoint
| Kategorie | Frage |
|---|---|
| **Spoofing** | Auth-Pflicht? Session-Validation? |
| **Tampering** | Input-Validation (Zod)? CSRF-Token bei state-change? |
| **Repudiation** | Audit-Log für Privilege-Action? |
| **Info-Disclosure** | RLS aktiv? Stack-Trace zum Client unterbunden? |
| **DoS** | Rate-Limit? Body-Size-Limit? Query-Timeout? |
| **Elevation** | Permission-Check exakt? IDOR durch ID-Manipulation möglich? |

### Defense-in-Depth (3 Schichten)
1. **Frontend:** `<RequireRole>`-Wrapper, Hidden-UI für unauthorized
2. **Backend:** `requireRole`-Middleware in Fastify
3. **Database:** RLS-Policies auf Tabellen-Ebene

Niemals nur eine Schicht.

### Crypto
- **Passwörter:** argon2id (nicht bcrypt mehr)
- **Symmetric:** AES-GCM
- **Asymmetric:** Ed25519 (signing), X25519 (key-exchange)
- **Hashing:** SHA-256 für Integritäts-Checks
- **NIEMALS:** eigene Algos, MD5/SHA1 für Security

### Auth-Patterns
- MFA-ready Schema (TOTP via `pg_otp` oder Auth-Provider)
- Session-Rotation bei Privilege-Change
- JWT-Refresh + Access-Token-Trennung
- Password-Reset-Token: 15min TTL, Single-Use, Rate-Limited
- Rate-Limit auf Login (5/min/IP), PW-Reset (3/h/email)

### Input-Validation
- Zod-Schemas an JEDER API-Grenze (HTTP, WebSocket, MCP)
- Output-Encoding strikt (kein `dangerouslySetInnerHTML` ohne Allowlist)
- File-Upload: MIME-Check + Size-Limit + Path-Traversal-Schutz

### CSRF
- SameSite=Strict für Auth-Cookies
- CSRF-Token bei state-changing Requests (state-Cookie + Body-Hidden-Field)

## Codereview-Security (manuelle Pflichtpunkte)

`checklists/security-pentest-review.md`:
- Input von User → Sanitization?
- SQL → parameterized? bei Supabase: nur `.eq()/.in()/.match()`-Builder
- File-Upload → MIME-Whitelist, Size-Limit, RLS auf Storage-Bucket
- Auth-Bypass-Suche: jede Route ohne `requireRole` → bewusst public?
- IDOR: jede Query mit User-ID aus URL → mit `auth.uid()` verglichen?
- Logs: regex-Check auf `password|token|secret|email`
- Error-Messages → keine Stack-Traces zum Client
- Open-Redirect: alle Redirect-Targets gegen Allowlist
- SSRF: alle `fetch()` mit User-Input → URL-Allowlist + Block-private-IPs

## CI-Gates

- **SAST:** `semgrep --config=p/owasp-top-ten` + `p/typescript`
- **SCA:** `pnpm audit --audit-level=high` + Snyk + Dependabot
- **Secret-Scan:** gitleaks + trufflehog (pre-push + CI)
- **License-Check:** verbietet GPL/AGPL in Production-Deps
- **SBOM:** CycloneDX generiert pro Build, Artifact in Release
- **DAST:** ZAP-Baseline-Scan nightly gegen Staging
- **Headers:** securityheaders.com-API-Call → Grade < A → Build rot
- **TLS:** testssl.sh-Check → Grade < A → Build rot
- **Custom Biome-Rules:** verbietet `dangerouslySetInnerHTML` ohne Allowlist, `eval`, `new Function`, `child_process.exec` mit String-Input

## Pentest-Suite

`tests/security/`:
- `xss-injection.spec.ts` — payload-Liste gegen alle Inputs
- `sqli-injection.spec.ts` — `' OR 1=1--` etc.
- `idor.spec.ts` — User-A-Resource → User-B versucht Zugriff
- `csrf.spec.ts` — state-changing ohne Origin/SameSite
- `path-traversal.spec.ts` — `../../etc/passwd`
- `auth-bypass.spec.ts` — JWT-Manipulation, expired, none-algo
- `rate-limit.spec.ts` — Brute-Force-Resistenz

Pre-Release: alle 7 Suites grün Pflicht.

## Secrets-Handling

- **NIEMALS** in Git
- VPS: `.env` auf Server (chmod 600)
- Cloud: GitHub Secrets / Vercel Env / Supabase Vault
- CI: `${{ secrets.X }}` — niemals echo'd
- Lokal: `.env.local` (gitignored)
- Rotation: 90 Tage (`infra/scripts/rotate-secrets.sh`)

## Detail-Lookup

`references/security-review-method.md` — ASVS-Sweep, Threat-Walk-Through-Methode
