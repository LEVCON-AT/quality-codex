# Production-Readiness-Review (PRR)

Letzte Pflicht-Wave **vor** v1.0-Tag und öffentlichem Launch. Alles muss grün sein.

## Tech-Readiness

### Code-Quality
- [ ] Codex-Manifesto-Compliance: alle Tier-1-Regeln erfüllt
- [ ] `pnpm test` ≥ 80% Coverage auf kritischen Pfaden (Auth, Permissions, DB-Ops)
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 errors
- [ ] `scripts/check-doublets.sh` 0 Findings (oder dokumentierte Allowlist)
- [ ] Dead-Code-Sweep: ts-prune 0 unused exports
- [ ] Performance-Budget eingehalten (alle Routes)

### Security
- [ ] **Pentest-Suite grün:** alle 7 spec.ts-Files
- [ ] **DAST-Scan:** ZAP-Baseline 0 High, alle Medium triaged
- [ ] **SAST-Scan:** semgrep 0 critical
- [ ] **SCA-Scan:** `pnpm audit --audit-level=high` 0 findings
- [ ] **Secret-Scan:** gitleaks/trufflehog 0 leaks
- [ ] **Headers:** securityheaders.com Grade A+
- [ ] **TLS:** testssl.sh Grade A+
- [ ] **CSP** ohne `unsafe-inline` (außer dokumentierter Ausnahmen)
- [ ] **MFA-Pflicht** für admin/owner-Rollen aktiviert
- [ ] **Rate-Limits** auf allen sensitiven Endpoints (Login, PW-Reset, Signup)

### Backup + DR
- [ ] **Backup-Verify:** letzte 4 Wochen 100% green
- [ ] **DR-Drill** mind. 1× durchgeführt (innerhalb 6 Monaten)
- [ ] **RTO** <2h dokumentiert
- [ ] **RPO** <24h dokumentiert (oder PITR <1min)
- [ ] **Restore-Skripte** funktionieren auf 2. Server

### Performance
- [ ] **Lighthouse Performance** ≥ 90 auf 3 Schlüssel-Routen
- [ ] **Lighthouse Accessibility** ≥ 95
- [ ] **Lighthouse Best-Practices** ≥ 90
- [ ] **Bundle-Size** unter Budget
- [ ] **DB-Query-Profile:** keine Query > 1s in Logs

### Accessibility
- [ ] **axe-core** 0 violations auf allen Routes
- [ ] **Keyboard-Navigation** end-to-end (Tab durch alle interaktiven Elemente)
- [ ] **Screen-Reader-Test** stichprobenartig (NVDA + VoiceOver)
- [ ] **Color-Contrast** 4.5:1 für Text geprüft
- [ ] **prefers-reduced-motion** respektiert

### Observability
- [ ] **Sentry** empfängt Test-Error, Alert-Channel funktioniert
- [ ] **Sentry-Releases** mit Source-Maps verlinkt
- [ ] **Uptime-Monitor** empfängt Heartbeats von allen Endpoints
- [ ] **Status-Page** erreichbar, Initial-Incident-History leer
- [ ] **Audit-Log-Dashboard** in Grafana funktioniert
- [ ] **Log-Retention** dokumentiert (30d Staging / 90d Prod)

### Documentation
- [ ] **Wiki vollständig:** Getting-Started, Features (alle), Admin, FAQ, Troubleshooting
- [ ] **`pnpm docs:check`** 0 Findings (keine `@docs`-Toten-Links, keine verwaisten Pages)
- [ ] **Screenshots aktuell** (alle <30 Tage)
- [ ] **Search funktioniert** end-to-end
- [ ] **Mobile-Layout** des Wikis getestet
- [ ] **Alle Wave-Items** haben Testprotokoll

## Legal/Compliance

### DACH/EU
- [ ] **Impressum** verlinkt (Pflicht in DACH)
- [ ] **Privacy-Policy** DSGVO-konform, von Anwalt geprüft (oder GenAI + Self-Review)
- [ ] **Terms-of-Service** verlinkt
- [ ] **Cookie-Consent-Banner** aktiv, kein Pre-Tick
- [ ] **DSGVO-Subject-Request-Workflow** getestet (Art. 15, 17, 20)
- [ ] **Sub-Prozessoren-Liste** in Privacy-Policy aktuell
- [ ] **DPAs** mit allen Sub-Prozessoren (Supabase, Sentry, Postmark, …)
- [ ] **Data-Retention-Cron** läuft + getestet
- [ ] **DKIM/SPF/DMARC** für Mail-Domain (`mail-tester.com` ≥ 9/10)

### Internationaler Markt (wenn relevant)
- [ ] **CCPA** (California) — wenn US-Markt
- [ ] **PIPEDA** (Canada) — wenn CA-Markt
- [ ] **LGPD** (Brazil) — wenn BR-Markt
- [ ] **Cookie-Consent für unterschiedliche Jurisdiktionen** (US: opt-out, EU: opt-in)

## Operational

- [ ] **Incident-Response-Runbook** getestet (mind. 1 Trockenlauf)
- [ ] **On-Call-Erreichbarkeit** dokumentiert (Solo: Mail-Push aktiv 24/7?)
- [ ] **Cost-Monitoring** aktiv (Cloud-Billing-Alerts oder VPS-Resource-Alerts)
- [ ] **Skalierungs-Pfad** dokumentiert (was tun bei 10×, 100× Last)
- [ ] **Off-Boarding-Checkliste** vorbereitet (was bei Hardware-Verlust)
- [ ] **Notfall-Kontakte** in 1Password (Backup-Person, Provider-Support)
- [ ] **DPO/Datenschutzbeauftragter** ernannt (ab 250 Employees Pflicht; Solo: optional aber sinnvoll)

## User-Readiness

- [ ] **Onboarding-Flow** end-to-end mit echter Test-Person durchgegangen
- [ ] **Empty-States** ansprechend gestaltet
- [ ] **Error-Messages** user-friendly (keine Stack-Traces)
- [ ] **Support-Channel** etabliert (E-Mail + FAQ + ggf. Discord)
- [ ] **Analytics privacy-first** (Plausible/Umami) konfiguriert — nicht Google Analytics
- [ ] **Feedback-Mechanik** in App eingebaut (Sentry-User-Feedback oder Custom)
- [ ] **Help-Center / FAQ** verlinkt
- [ ] **Newsletter-Signup** (optional) funktioniert + Double-Opt-In

## Marketing-Readiness

- [ ] **Landing-Page** finalisiert
- [ ] **Hero-Copy** klar (Was, Für wen, Warum)
- [ ] **Pricing** transparent (wenn paid)
- [ ] **Social-Media-Preview** (Open-Graph, Twitter-Cards)
- [ ] **SEO-Meta-Tags** auf allen Public-Pages
- [ ] **Sitemap.xml** generiert
- [ ] **robots.txt** konfiguriert

## Final-Check

Wenn ALLES grün:
```bash
git tag v1.0.0
git push origin v1.0.0
```

→ Release-Workflow läuft, Status-Page-Update auf "Production", Launch-Communication.

## Wenn etwas rot

- **Critical-Block** (Security, Data-Loss-Risk): Launch verschieben
- **High-Block** (Major-Feature broken): Launch verschieben
- **Medium-Block** (UX-Issue): Launch erlaubt mit explizitem User-OK + sofortiger Backlog-Item
- **Low-Block**: Launch erlaubt, im Post-Launch-Sprint nachziehen

## Post-Launch (erste 7 Tage)

- [ ] Sentry-Errors täglich gesichtet
- [ ] User-Feedback täglich gesichtet
- [ ] Performance-Trends überwacht
- [ ] Daily-Standup mit sich selbst (Solo) oder Team
