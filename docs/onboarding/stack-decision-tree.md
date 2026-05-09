# Stack Decision Tree

Hilft beim `/onboard-project`-Discovery: welcher Stack für welches Projekt.

## Frage 1: Was baust du?

### Web-App
→ Frontend-Workspace + ggf. Backend
→ Weiter mit Frage 2

### CLI-Tool
→ Single-Workspace, kein Codex-Template (Codex zielt auf Web/Mobile)
→ Eigenes pnpm-Setup, aber Manifesto-Docs nutzen

### Mobile-App
→ Frontend = client-mobile + Backend
→ Weiter mit Frage 2

### Headless-API
→ Backend-only-Workspace
→ Weiter mit Frage 2

## Frage 2: Wer ist die Zielgruppe?

### Solo (nur ich)
→ VPS-Variante OK (volle Kontrolle, niedrige Kosten)
→ Single-Tenant
→ Auth optional (oder Magic-Link)

### Familie / Freunde
→ VPS- oder Cloud-Variante
→ Single-Tenant
→ Auth Pflicht (Supabase)

### Team / Firma
→ VPS oder Cloud, je nach Compliance-Anforderung
→ Multi-Tenant evtl.
→ RBAC mit owner/admin/editor/viewer

### Public (SaaS)
→ Cloud-Variante (besser skalierbar)
→ Multi-Tenant Pflicht
→ Stripe-Integration vorbereiten
→ Marketing-Landing-Page

## Frage 3: Wie sensitive sind die Daten?

### Public (z.B. Blog, Galerie)
→ Cloud-Variante OK
→ Backup täglich reicht

### Personenbezogen (E-Mails, Profile)
→ DSGVO-Compliance Pflicht
→ Backup-Verschlüsselung Pflicht
→ DPAs mit Sub-Prozessoren

### Hoch-sensitiv (Gesundheit, Finanz, Kinderdaten)
→ VPS bevorzugt (mehr Kontrolle über Sub-Prozessoren)
→ Encryption-at-Rest für PII (pgcrypto)
→ Detail-Audit-Log
→ Externer Datenschutz-Audit empfehlenswert

## Frage 4: Compliance / Markt?

### DACH/EU
→ DSGVO + Impressum + Cookie-Consent Pflicht
→ EU-basiertes Hosting (Hetzner FSN/NBG, Supabase EU-Region)

### USA
→ CCPA (California)
→ Cookie-Consent als opt-out
→ US-basiertes Hosting OK

### Global
→ Multi-Region-Setup nötig (CDN + Multi-Region-DB) — vermutlich nicht v1.0

## Frage 5: Mobile?

### Web-only (Progressive Web App reicht)
→ `client-web` mit PWA-Plugin
→ Kein client-mobile

### Native-App nötig (App-Store-Distribution)
→ `client-mobile` (Expo) aktivieren
→ EAS Build + Submit
→ Push-Notifications (Expo Push Service)

### Beides
→ Code-Sharing über `packages/shared/`
→ Gleiches Backend bedient Web + Mobile

## Frage 6: AI-Integration?

### Keine
→ Nur App, kein Bridge-Workspace nötig

### Nur LLM-Calls aus Frontend (z.B. Streaming-Output)
→ Bridge-Workspace mit Anthropic-Proxy (Backend-Side, kein API-Key im Frontend)
→ Kein MCP nötig

### Tool-Use / Claude-Desktop-Integration
→ MCP-Tools im `bridge`-Workspace
→ MCP-stdio + HTTP/SSE Endpoints
→ Tool-Definition mit Zod

## Frage 7: Wieviel Ops-Skills hast du?

### "Klick-Geübt" (Solo, kein Linux-Experte)
→ Cloud-Variante (Supabase + Vercel) — managed
→ Niedrigste Operational-Burden

### "Komfortabel mit SSH"
→ VPS-Variante OK
→ Mehr Kontrolle, niedrigere Kosten ab gewisser Größe

### "Linux-Profi mit Audit-Bedarf"
→ VPS-Variante mit Self-hosted-Sentry + Plausible
→ Volle Kontrolle, alles in eigener Hand

## Decision-Matrix

| Profil | Stack |
|---|---|
| **Solo + Web + privat** | client-web only + VPS + Single-Tenant + Magic-Link-Auth |
| **Solo + SaaS-Idee** | client-web + bridge + Cloud + Single-Tenant initial → Multi später |
| **Team + interne App** | Full-Stack-Monorepo + VPS + Multi-Tenant + RBAC |
| **Public-SaaS** | Full-Stack-Monorepo + Cloud + Multi-Tenant + Stripe |
| **Mobile-First** | client-mobile + bridge + Cloud + Push-Notifications |
| **Daten-sensitiv** | VPS + age-Backups + pgcrypto + EU-Region + externer Audit |
| **AI-zentrale App** | client-web + bridge mit MCP-Tools + Anthropic-Proxy |

## Ausweg

Codex ist Default — **nicht Pflicht**. Wenn deine Anforderungen außerhalb des Codex sind (z.B. Gaming-Engine, IoT-Firmware, ML-Training-Pipeline), eigene Lösung wählen. Codex-Manifesto-Docs (`docs/claude/`) bleiben trotzdem nutzbar als Quality-Standard.
