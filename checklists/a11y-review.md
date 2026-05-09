# Accessibility Review (WCAG 2.2 AA)

## Automatisiert
- [ ] axe-core via Playwright: 0 violations
- [ ] Lighthouse Accessibility: ≥ 95
- [ ] eslint-plugin-jsx-a11y / equivalent für Solid: grün

## Manuell — Tastatur
- [ ] Tab-Order logisch (von oben-links nach unten-rechts in Lese-Reihenfolge)
- [ ] Sichtbarer Focus-Ring auf allen interaktiven Elementen
- [ ] Skip-to-Main-Link für Screen-Reader
- [ ] ESC schließt Modals/Drawers
- [ ] Enter aktiviert Buttons/Links, Space toggled Checkboxen
- [ ] Trap-Focus in Modals

## Manuell — Screen-Reader
- [ ] Alle Images haben `alt`-Text (oder `alt=""` für dekorativ)
- [ ] Form-Inputs haben `<label>` (kein Placeholder-as-Label)
- [ ] Landmarks: `<main>`, `<nav>`, `<header>`, `<footer>`
- [ ] Heading-Hierarchie korrekt (eine H1 pro Page, keine Sprünge)
- [ ] aria-live für dynamische Inhalte (Toast, Search-Results)
- [ ] aria-expanded auf Accordions / Disclosure
- [ ] aria-current für aktive Nav-Items

## Color / Contrast
- [ ] Text-Contrast ≥ 4.5:1 für normalen Text
- [ ] Large-Text-Contrast ≥ 3:1 (≥18pt oder 14pt-bold)
- [ ] UI-Component-Contrast ≥ 3:1 (Borders, Icons)
- [ ] Information nicht nur über Farbe (auch Icon/Text)
- [ ] Dark-Mode geprüft

## Motion / Animation
- [ ] prefers-reduced-motion respektiert
- [ ] Keine Auto-Play-Videos > 5s
- [ ] Pausierbare Animationen (Carousel)
- [ ] Kein Flashing > 3 Hz (Photosensitive-Risk)

## Touch / Mobile
- [ ] Touch-Targets ≥ 44×44 CSS-Pixel
- [ ] Genug Abstand zwischen interaktiven Elementen
- [ ] Hover-only-Interaktionen haben Touch-Fallback
- [ ] Pinch-Zoom nicht deaktiviert (`viewport` ohne `user-scalable=no`)

## Forms
- [ ] Required-Marker (* Label oder `aria-required`)
- [ ] Error-Messages mit `aria-describedby` verbunden
- [ ] Error-Summary oben bei Submit-Fail (keyboard-friendly)
- [ ] Autocomplete-Attribute korrekt (`new-password`, `email`, `name`)
- [ ] Disable-Submit-during-loading (verhindert Double-Submit)

## Content
- [ ] Lesbare Sprache (Flesch-Kincaid + reine Lesbarkeit)
- [ ] Abkürzungen erklärt
- [ ] PDFs accessible-tagged (oder HTML-Alternative)
- [ ] Tables mit `<th>`-Headers + `<caption>` wenn datengetrieben

## Test-Tools
- axe DevTools (Browser-Extension)
- WAVE (https://wave.webaim.org)
- Lighthouse Accessibility-Report
- NVDA (Windows Screen-Reader, free)
- VoiceOver (macOS/iOS, built-in)
- TalkBack (Android, built-in)

## Severity-Schwelle für Merge

- **Block** (Critical): Tab-Order broken, Forms unbedienbar, Color-Contrast unter Minimum
- **Should-Fix** (High): aria-live fehlt, Focus-Trap broken
- **Nice-to-Have** (Low): Subtle-Improvements

## WCAG 2.2 vs 2.1

WCAG 2.2 (Stand 2026) hat zusätzliche Success-Criteria:
- 2.4.11 Focus Not Obscured (Min) — sichtbarer Focus nicht von Sticky-Headers verdeckt
- 2.4.12 Focus Not Obscured (Enhanced) — komplett unverdeckt
- 2.5.7 Dragging Movements — Drag-only Interactions haben Fallback
- 2.5.8 Target Size (Min) — 24×24 CSS-Pixel (oder 44×44 mit Spacing)
- 3.2.6 Consistent Help — Help-Mechanismen konsistent positioniert
- 3.3.7 Redundant Entry — Daten nicht doppelt eingeben
- 3.3.8 Accessible Authentication (Min) — keine Cognitive-Function-Tests (Captcha-Alternative)
- 3.3.9 Accessible Authentication (Enhanced) — strenger
