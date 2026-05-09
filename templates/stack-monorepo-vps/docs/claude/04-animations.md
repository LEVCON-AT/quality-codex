# 04 — Animations (Tier-2)

Lädt bei UI-Änderungen oder neuen Komponenten.

## Token-System

```css
:root {
  /* Duration */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-md: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 700ms;

  /* Easing */
  --easing-linear: linear;
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-md: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}
```

## 20 Standard-Patterns

| Pattern | Verwendung | Tokens |
|---|---|---|
| **fade-in** | Modal/Toast erscheint | `opacity 0→1, --duration-md, --easing-out` |
| **fade-out** | Toast verschwindet | `opacity 1→0, --duration-fast, --easing-in` |
| **slide-up** | Sheet/Bottom-Modal | `translateY 100%→0, --duration-md, --easing-out` |
| **slide-down** | Header reveal | analog |
| **slide-left/right** | Drawer | analog |
| **scale-in** | Tooltip, Popover | `scale 0.95→1 + opacity, --duration-fast, --easing-spring` |
| **expand** | Accordion öffnet | `height 0→auto, --duration-md, --easing-out` |
| **collapse** | Accordion schließt | analog reverse |
| **rotate** | Chevron-Icon | `rotate 0deg→90deg, --duration-fast, --easing-out` |
| **pulse** | Loading-Skeleton | `opacity 0.4↔0.8, infinite, --easing-in-out` |
| **shake** | Form-Validation-Error | `translateX ±4px, 3 cycles, --duration-fast` |
| **bounce** | Submit-Success | `scale 1→1.05→1, --easing-bounce` |
| **flash** | New-Item-Highlight | `bg-color flash, --duration-slow` |
| **stagger** | List-Items erscheinen | `delay = index × 50ms, fade+slide-up` |
| **morph** | Button → Spinner | `width-/border-radius-transition` |
| **focus-ring** | Element bekommt Focus | `outline 0→2px, --duration-instant` |
| **drag** | User zieht Card | `cursor:grabbing, scale 0.98, opacity 0.9` |
| **drop** | Card snap-back oder accept | `--easing-spring` |
| **page-transition** | Route-Wechsel | `fade-in + slide-up 8px, --duration-md` |
| **skeleton-load** | Daten werden geladen | `gradient-shimmer, infinite linear` |

## Anti-Patterns

- ❌ `display: none` als Animation-State (nicht animierbar)
- ❌ `visibility: hidden` ohne opacity-transition
- ❌ Animationen ohne `prefers-reduced-motion`-Branch
- ❌ Inline-`transition: ...` in Components (statt Token)
- ❌ JavaScript-driven Animation wo CSS reicht (Performance)
- ❌ `transition: all` (zu breit; explizite Properties listen)

## Helper-Pattern

```typescript
// packages/client-web/src/lib/animations.ts
export type AnimationName = 'fade-in' | 'slide-up' | ... ;

export function animate(
  element: HTMLElement,
  name: AnimationName,
  opts?: { duration?: string; delay?: number }
): Promise<void> { ... }
```

Components nutzen den Helper, nicht raw CSS-transitions.

## Reduced-Motion-First

Bei `prefers-reduced-motion: reduce`:
- Durations → 0ms (over Token)
- Verzicht auf `bounce`, `shake`, `pulse`
- `flash` → statisches Highlight 200ms
- Kein automatisches Stagger

## Performance

- GPU-beschleunigt: `transform`, `opacity` (nicht `top`/`left`/`width`/`height`)
- `will-change: transform` nur kurzfristig vor Animation, danach entfernen
- Ziel: 60fps auch auf Low-End-Mobile (Lighthouse-Performance ≥ 90)
