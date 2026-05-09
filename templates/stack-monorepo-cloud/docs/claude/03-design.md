# 03 — Design System (Tier-2)

Lädt bei UI-Änderungen (`*.tsx`, `*.css`). Komplette Frontend-Design-Substanz lokal — kein `/frontend-design`-Skill-Aufruf nötig.

## Default-Komponentenbibliothek: HyperUI

[HyperUI](https://www.hyperui.dev) ist die Default-Basis. Tailwind-basierte Patterns, free, MIT.

- **Setup:** `packages/client-web/src/components/ui/` mit kuratierten HyperUI-Patterns
- **Token-Mapping:** HyperUI-Defaults → Codex-Token-System (`--color-*`, `--space-*`, `--radius-*`) via Tailwind-Theme-Config
- **NICHT mischen** mit Material/AntD/Chakra
- **Component-Index:** `references/hyperui-component-index.md` listet 30+ Patterns mit "wann nutzen"

## Token-System (Pflicht)

```css
:root {
  /* Spacing — rem-basiert */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Typography */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;

  /* Colors — semantic */
  --color-primary: #3b82f6;
  --color-secondary: #14b8a6;
  --color-accent: #f59e0b;
  --color-text-1: #111827;  /* primary text */
  --color-text-2: #4b5563;  /* secondary text */
  --color-text-3: #9ca3af;  /* tertiary text */
  --color-bg-1: #ffffff;
  --color-bg-2: #f9fafb;
  --color-border: #e5e7eb;
  --color-error: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Z-index */
  --z-base: 0;
  --z-dropdown: 100;
  --z-modal: 1000;
  --z-toast: 2000;
  --z-notification: 3000;

  /* Icon sizes */
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text-1: #f9fafb;
    --color-text-2: #d1d5db;
    --color-text-3: #6b7280;
    --color-bg-1: #111827;
    --color-bg-2: #1f2937;
    --color-border: #374151;
  }
}
```

## rem-Pflicht

- Spacing/Typography in `rem` (skaliert mit User-Browser-Zoom)
- `px` nur für: Border (`1px solid`), Outline, Shadow-offset, Icon-anchor

## Inline-Style-Verbot

Keine dynamischen Inline-Styles **außer** CSS Custom Properties:
```tsx
// ❌ verboten:
<div style={{ color: '#3b82f6', padding: '8px' }}>

// ✓ erlaubt (CSS Custom Property für dynamischen Wert):
<div style={{ '--user-color': userColor }}>
```

## Distinctive UI — Anti-AI-Aesthetic

Inspirationen für nicht-generische UI (komplettes Wissen aus `frontend-design`-Skill):

- **Hierarchy via size+contrast**, nicht via Borders. Borders sparsam einsetzen.
- **Generous whitespace** — lieber zu viel `--space-8` als zu wenig
- **Asymmetric Layouts** — golden ratio statt 50/50-Splits
- **Off-grid Details** — leichte Verschiebungen, die "echte" Hand zeigen
- **Personality in micro-copy** — keine generic "Welcome back!"-Phrasen
- **One bold accent** pro View, nicht 5 verschiedene
- **Typography als Held** — gut gewählter Font-Stack > Icon-Spam
- **Subtle motion** — nicht Spinning-Loader, lieber Skelton-Pulse + sanfte Transitions

Mehr Detail: `references/frontend-design.md`.

## Component-Standards

| Component | Pattern |
|---|---|
| **Button** | HyperUI Button, 3 Varianten: primary/secondary/ghost; Loading-State integriert |
| **Input** | Label oben, aria-describedby für Error, FocusRing via `:focus-visible` |
| **Modal** | Focus-Trap, ESC zum Schließen, Backdrop-Click optional, Reduced-Motion-aware |
| **Toast** | aria-live="polite", auto-dismiss 5s, Stacking max 3 |
| **Card** | konsistentes Padding `--space-6`, `--radius-md`, optional `--shadow-sm` |
| **Empty-State** | Illustration + 1 Satz + CTA-Button (kein Wall-of-Text) |
| **Loading** | Skeleton-Pulse > Spinner; nie blockend |
| **Error-State** | User-friendly Message, kein Stack-Trace; Retry-Button |
| **Form** | Label-Pflicht, aria-required, Error-Summary bei Submit, Disable-Submit-during-loading |
| **Table** | Sortable-Header, Sticky-Header bei >10 Rows, Empty-State integriert |

## WCAG 2.2 AA — Minimum

- **Contrast:** 4.5:1 für Text, 3:1 für Large-Text + UI-Components
- **Tab-Order** logisch + sichtbarer Focus-Ring
- **Labels** für alle Form-Inputs (kein Placeholder-as-Label)
- **aria-live** für dynamische Inhalte
- **prefers-reduced-motion** respektieren
- **Touch-Targets** ≥ 44×44 CSS-Pixel
- **No-color-alone** — Information nicht nur über Farbe

axe-core in Playwright-Tests Pflicht — 0 violations bei Merge.

## Mobile-Safe

- **Focus-Traps** in Modals (kein Escape per Outside-Tab)
- **Modals** scrollbar im Inhalt, nicht der Body
- **Touch-Gestures** mit Fallback (Long-Press → Context-Menu-Button)
- **Bottom-Nav** statt Top-Nav auf <768px

## Anti-Patterns

- ❌ `display: none` für Animationen (nicht animierbar) → opacity/transform
- ❌ Hardcoded breakpoints in `px` → Custom Properties
- ❌ z-index magic numbers > `--z-notification` ohne Doc
- ❌ Multiple UI-Libraries (Material+HyperUI gleichzeitig)
- ❌ Inline-Tailwind ohne Token-Bezug (`p-[13px]` o.ä.)
