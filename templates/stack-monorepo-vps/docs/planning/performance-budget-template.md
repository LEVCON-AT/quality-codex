# Performance Budget

**Projekt:** <Slug>
**Stand:** YYYY-MM-DD

## Per-Route-Budget

| Route | JS-Bundle (kB gzip) | CSS-Bundle (kB) | LCP (ms) | INP (ms) | CLS | DB-Queries (max) | API-Response P95 (ms) |
|---|---|---|---|---|---|---|---|
| `/` (Landing) | 100 | 20 | 1500 | 100 | 0.05 | 0 | — |
| `/login` | 80 | 15 | 1200 | 100 | 0.05 | 0 | — |
| `/dashboard` | 250 | 40 | 2500 | 200 | 0.10 | 8 | 200 |
| `/settings` | 200 | 30 | 2000 | 200 | 0.10 | 5 | 200 |
| `/api/tasks` (list) | — | — | — | — | — | 2 | 100 |
| `/api/tasks/:id` (detail) | — | — | — | — | — | 1 | 50 |
| `/api/auth/login` | — | — | — | — | — | 2 | 200 |

## Globale Limits

| Metrik | Limit |
|---|---|
| **Time-to-First-Byte (TTFB)** | <200ms |
| **First-Contentful-Paint (FCP)** | <1.5s |
| **Total-Blocking-Time (TBT)** | <300ms |
| **Lighthouse Performance Score** | ≥90 |
| **Lighthouse Accessibility** | ≥95 |
| **Lighthouse Best-Practices** | ≥90 |
| **Lighthouse SEO** | ≥90 |
| **Total JS (gzip) Initial Load** | <250kB |
| **Total CSS (gzip)** | <50kB |
| **Number of HTTP-Requests Initial** | <30 |
| **Image-Total-Size Initial** | <500kB |

## Backend-Limits

| Metrik | Limit |
|---|---|
| **DB-Connection-Pool** | 20 (App) / 100 (Pooler) |
| **DB-Query-Timeout** | 5s |
| **HTTP-Body-Size** | 1MB (außer File-Upload-Routes) |
| **Rate-Limit pro User** | 100 req/min |
| **Rate-Limit pro IP (anon)** | 30 req/min |
| **Slow-Query-Log-Threshold** | 1s |

## Mobile-spezifisch (wenn aktiv)

| Metrik | Limit |
|---|---|
| **App-Bundle-Size (Android AAB)** | <30MB |
| **App-Bundle-Size (iOS IPA)** | <50MB |
| **Cold-Start-Time** | <2s |
| **Frame-Rate (60fps)** | mind. 95% Frames im Budget |
| **Memory-Footprint** | <150MB normal |

## Verification

- **Pre-Merge:** Lighthouse-CI in PR-Workflow (gegen Staging)
- **Bundle-Size:** `bundlesize` package — Build rot bei Verstoss
- **Real-User-Monitoring:** Sentry Performance + `web-vitals` lib in Production
- **Synthetic-Monitoring:** UptimeRobot mit Performance-Trace alle 5min

## Bei Verstoss

1. **Critical** (>20% über Budget) → Build rot, kein Merge
2. **Warning** (>10% über Budget) → PR-Comment mit Warnung
3. **Trend-Detection** → 3 Builds in Folge mit Increase → Tech-Debt-Wave-Item

## Optimierungs-Reihenfolge

1. **Code-Splitting** pro Route
2. **Tree-Shaking** Audit
3. **Image-Optimization** (WebP/AVIF, lazy)
4. **Font-Subset** für genutzte Glyphs
5. **Library-Audit** — gibt's leichtere Alternative?
6. **Critical-CSS** inline
7. **Service-Worker** für Caching
8. **DB-Index-Tuning** für N+1
9. **API-Response-Caching** mit stale-while-revalidate
