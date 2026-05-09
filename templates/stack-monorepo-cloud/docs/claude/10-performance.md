# 10 — Performance

Tier-2-Doc. Lädt bei Performance-Issues / neuen Routen / DB-Queries.

## Standards
- **Core Web Vitals** (Google) — LCP, FID/INP, CLS
- **Lighthouse Performance Score ≥ 90**
- **Bundle-Size-Budget** pro Route

## Performance-Budgets (pro Route)

```yaml
# docs/planning/performance-budget-template.md
routes:
  /:
    js_bundle_kb: 150
    css_bundle_kb: 30
    lcp_ms: 2500
    cls: 0.1
    inp_ms: 200
    db_queries: 3
  /dashboard:
    js_bundle_kb: 250
    lcp_ms: 3000
    db_queries: 8
  /api/tasks:
    response_ms_p95: 200
    db_queries: 2
```

CI bricht bei Verstoss.

## Frontend-Performance

### Initial Load
- **Code-Splitting** pro Route (Vite default)
- **Tree-Shaking** — nur importieren was genutzt wird
- **Modern Bundle Format** — ES2022, kein Legacy-Polyfills für moderne Browser
- **Compression:** Brotli > Gzip
- **HTTP/2 / HTTP/3** auf nginx/Vercel

### Asset-Optimization
- **Bilder:** WebP/AVIF, `<picture>` mit Fallback, `loading="lazy"`
- **Fonts:** woff2, `font-display: swap`, Subset für genutzte Glyphs
- **Icons:** SVG inline für critical, sprite für rest

### Runtime
- **Virtualisierung** für lange Listen (`@tanstack/virtual`)
- **Debouncing/Throttling** für Search/Resize-Handler
- **Memoization** (`createMemo` Solid / `useMemo` React) sparsam — oft Doc-Linting-Kosten höher
- **Web Workers** für CPU-intensive Tasks

## Backend-Performance

### DB-Query-Budget
- N+1-Verbot — eager-load via JOIN oder DataLoader
- `EXPLAIN ANALYZE` für Queries > 100ms
- Indexes: nach Query-Pattern, nicht prophylaktisch
- JSONB-Queries: GIN-Index für `@>` / `?` operators

### API-Caching
- **HTTP-Caching:** `Cache-Control` Header bei statischen Endpoints
- **stale-while-revalidate** für Daten mit Toleranz
- **CDN-Layer** für static Assets (Cloudflare/Bunny)
- **Edge-Caching** für globale Read-heavy APIs

### Connection-Pooling
- Supabase Cloud: Pooler (Supavisor) Pflicht > Direct
- VPS: PgBouncer (transaction-pooling)

## Caching-Layers

| Layer | Tool | TTL | Use-Case |
|---|---|---|---|
| **Browser** | HTTP-Cache | je nach Asset | Static Files |
| **Service-Worker** | Workbox | 30d | PWA-Offline |
| **CDN** | Cloudflare | je nach Asset | Globale Edge |
| **API-Cache** | Redis (optional) | 60s | Hot Reads |
| **DB-Cache** | Postgres-Buffer | dynamisch | Query-Plans |

## Lighthouse-CI

`.github/workflows/feature-verify.yml` läuft Lighthouse gegen Staging:
- Performance ≥ 90
- Accessibility ≥ 95
- Best-Practices ≥ 90
- SEO ≥ 90

Verstoss → PR-Comment mit Empfehlungen.

## Real-User-Monitoring

- **Core Web Vitals** in Production messen via `web-vitals` Lib
- An Sentry als Performance-Events
- Dashboard: P50/P75/P95 für LCP/INP/CLS

## Anti-Patterns

- ❌ Synchroner XHR
- ❌ Blockierende JavaScript im `<head>`
- ❌ Layout-Thrashing (Read-Write-Read im Render-Loop)
- ❌ Animationen via `top`/`left` (statt `transform`)
- ❌ N+1-Queries (z.B. Loop mit individueller `.fetchUser()`)
- ❌ Riesige JSON-Payloads (>500kB) ohne Pagination
- ❌ Polling > 5s für Live-Updates (statt Realtime/WebSocket)

## Detail-Lookup

`references/postgres-best-practices.md` — Index-Strategien, Query-Optimization
`docs/planning/performance-budget-template.md` — pro-Route Budget-Schema
