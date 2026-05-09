# Doc Update Review

Bei jedem User-facing Feature-Item — Pflicht-Begleiter im DoD.

## User-Doku (`docs-user/`)
- [ ] Feature-Page existiert (oder Section in bestehender Page)
- [ ] User-Perspektive ("Klicke auf X, um Y zu tun")
- [ ] Step-by-step bei Workflows
- [ ] Screenshots aktuell (oder neu erstellt — <30 Tage Zielmarke)
- [ ] FAQ-Eintrag bei häufigen Fragen
- [ ] Troubleshooting-Eintrag bei häufigen Problemen
- [ ] Kein Code-Detail (das gehört in JSDoc oder `docs/claude/`)

## `@docs`-Tags
- [ ] Neue exportierte User-facing Funktion hat `@docs <pfad>#<anchor>`
- [ ] Pfad existiert
- [ ] Anchor existiert in Doku-Page
- [ ] Internal-Helper haben `@docs internal`

## Doc-Link-Check
- [ ] `pnpm docs:check` 0 Findings
- [ ] Keine verwaisten Doku-Pages (jede Page hat ≥1 `@docs`-Quelle)
- [ ] Keine toten `@docs`-Verweise

## Cross-References
- [ ] Wenn Feature andere Features berührt: Cross-Links
- [ ] Verwandte Doku-Pages verlinkt am Ende ("Siehe auch")
- [ ] Glossar-Begriffe mit Tooltip oder Inline-Erklärung

## Sprachen
- [ ] Default-Locale-Doku aktualisiert
- [ ] Aktive Locales aktualisiert (oder explizit "Translation pending — siehe Issue X")

## Wiki-Build
- [ ] `pnpm --filter docs-wiki build` grün lokal
- [ ] Auto-Deploy zu `docs-staging.<domain>` grün
- [ ] Search-Index aktualisiert (VitePress macht das automatisch)
- [ ] Sidebar zeigt neue Page korrekt

## Marketing
- [ ] Falls neuer Public-Marketing-Punkt: Landing-Page aktualisiert
- [ ] Open-Graph-Preview-Image für Social-Media
- [ ] CHANGELOG-Eintrag user-friendly formuliert (nicht Tech-Detail)

## Versions
- [ ] Bei Breaking-Change: Migration-Hinweis in Doku
- [ ] Bei Deprecation: Deprecation-Banner mit Auslaufdatum

## Anti-Patterns
- ❌ "TODO: Doku schreiben" als Item
- ❌ Stale Screenshots (alte UI)
- ❌ Doku, die "wir haben" beschreibt statt "du kannst"
- ❌ Code-Snippets ohne Kontext (User soll nicht copy-pasten müssen für Standard-Aufgabe)
- ❌ Wall-of-Text statt Step-by-step
