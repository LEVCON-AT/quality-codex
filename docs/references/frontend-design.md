# Frontend-Design — Distinctive UI Patterns

Lokale Substanz des `frontend-design`-Skills. Wird via Tier-2-Trigger geladen bei UI-Änderungen.

## Ziel: Anti-AI-Aesthetic

Generische "AI-built"-UIs erkennt man an:
- Symmetrische 50/50-Splits
- Identische Card-Sizes in Grid
- Bordered-Boxes überall
- Generic Stock-Icons
- "Welcome to your Dashboard"-copy
- Bunt-Akzent ohne Bezug
- Animationen die nichts erzählen

Distinctive UI vermeidet diese Muster.

## Layout-Prinzipien

### Hierarchy via Size + Contrast
Wichtig größer + dunkler. Borders sparsam — sie zerschneiden den Lesefluss.

### Asymmetrische Layouts
- Golden-Ratio (1:1.618) statt 50/50
- Sidebar 25% / Content 75% statt 33/67
- Content-Width-Limit (max-w-prose, ~65ch) für Lesbarkeit

### Whitespace
- Lieber `--space-12` zu viel als `--space-2` zu wenig
- Sektionen getrennt durch Vertical-Space, nicht durch Horizontal-Rules
- Atemräume um Headings (oben mehr als unten)

### Off-Grid Details
- Leichte Verschiebungen (z.B. Avatar 4px aus Card-Rand) zeigen "Hand"
- Nicht alles auf 8px-Grid; ausgewählte Elemente brechen aus
- Sub-pixel-Adjustments für optical alignment (z.B. Letter spacing)

## Typography

### Skala
Modular-Scale (1.25 oder 1.333):
- xs: 0.75rem
- sm: 0.875rem
- base: 1rem
- md: 1.125rem
- lg: 1.25rem
- xl: 1.5rem
- 2xl: 2rem
- 3xl: 2.5rem (Hero-Heading)

### Font-Stack
- **Sans-Serif:** Inter, Geist, Manrope (variable fonts bevorzugen)
- **Serif (sparsam):** Lora, Source Serif (für Editorial-Touch)
- **Mono:** JetBrains Mono, Geist Mono (Code, Numbers)
- Keine Google-Fonts ohne Self-Hosting (DSGVO)

### Lesbarkeit
- `line-height: 1.5` für Body
- `line-height: 1.2` für Headings
- `letter-spacing: -0.01em` für Headings (tighter)
- Max-Width 65ch für lange Texte

## Color-Theory

### Grundregel
- 60% neutral (Background)
- 30% primary
- 10% accent

### Akzent-Farbe sparsam
Eine bold Accent-Color pro View. Nicht 5 verschiedene "wichtige" Farben.

### Semantic-Tokens
Statt `--color-blue-500` lieber `--color-primary` — bei Theme-Switch nur Token ändern.

### Dark-Mode
- Pure-Black vermeiden (#000) — `--color-bg-1: #0a0a0a` ist freundlicher
- Reduzierte Sättigung in Dark-Mode (Farben strahlen sonst zu stark)
- Schatten weg, Borders feiner

## Empty-States

Schlecht:
```
[ ]
No tasks yet.
```

Gut:
```
[Illustration]
Bereit für deinen ersten Task?
Tasks helfen dir, den Überblick zu behalten — egal ob privat oder beruflich.

[+ Ersten Task erstellen]
```

Components:
- Illustration (custom, kein Stock)
- 1-Satz-Beschreibung
- Single primärer CTA
- Optionaler "Mehr erfahren"-Link

## Loading-States

- **Skeleton-Pulse** statt Spinner für Content-Bereiche
- **Inline-Spinner** nur für Action-Buttons (Submit-loading)
- **Optimistic-Updates** wo möglich (kein Loading sichtbar)
- **Indeterminate-Progressbar** vermeiden — lieber Skeleton

## Error-States

- **User-friendly** ("Wir konnten deine Tasks nicht laden — versuch's gleich nochmal")
- **Retry-Button** prominent
- **Hilfreiche Details** (was ist schief gegangen, was kann User tun)
- **Niemals** Stack-Trace
- **Support-Link** wenn nichts hilft

## Personality in Micro-Copy

Generic:
- "Welcome back"
- "Your dashboard"
- "Add new item"

Mit Personality:
- "Tag <name>!"
- "Womit fangen wir heute an?"
- "+ Neuer Task" (knapper, aktiver)

Kein Cringe ("✨ Magical AI ✨"), aber auch nicht steril.

## Iconography

- **Lucide** (default) — modern, balanced, MIT
- **Heroicons** als Alternative
- Konsistente Stroke-Width (1.5 oder 2px)
- Kein Mix aus filled+outline ohne Konzept
- Icon-Größen: `--icon-sm: 16px`, `--icon-md: 20px`, `--icon-lg: 24px`
- Touch-Target ≥ 44×44 (Padding um Icon)

## Subtle Motion

Animations erzählen Geschichten — sie sollten:
- **Räumlichkeit erklären** (was kommt von wo)
- **Feedback geben** (Click bestätigt durch leichte Skalierung)
- **Continuity wahren** (Element bleibt visuell nachvollziehbar)
- **NICHT dekorativ sein** (keine spinning emojis)

## Component-Patterns

### Modal
- Focus-Trap
- ESC schließt
- Backdrop-Click schließt (außer Form mit unsaved changes)
- `prefers-reduced-motion`-aware (kein Slide ohne Motion)
- Größen-Varianten: sm/md/lg/full

### Toast
- aria-live="polite" (assertive für critical errors)
- Auto-Dismiss 5s (10s für Errors)
- Stacking max 3
- Position konfigurierbar (default: bottom-right)
- Action-Toast mit Undo-Button

### Form
- Label oben (kein Floating-Label — schlechter Tab-Order)
- Required-Marker (*)
- Error-Message direkt unter Field
- aria-invalid + aria-describedby
- Submit deaktiviert während Loading
- Error-Summary oben bei Submit-Fail (Screen-Reader-friendly)

### Table
- Sortable-Headers
- Sticky-Header bei >10 Rows
- Empty-State integriert
- Mobile: Card-Layout statt scroll-overflow

## Anti-Patterns (Liste)

- ❌ Multiple H1 pro Page
- ❌ "Click here" als Link-Text (schlecht für Screen-Reader)
- ❌ Placeholder als Label
- ❌ Disabled-Button ohne Erklärung warum
- ❌ Modal ohne Focus-Trap
- ❌ Hover-Only-Interaktionen (kein Touch-Fallback)
- ❌ Accordion ohne aria-expanded
- ❌ Carousel ohne Pause-Button
- ❌ Fixed-Heights mit overflow-cut
- ❌ Custom-Scrollbar die nicht keyboard-accessibel ist

## Quellen

- Refactoring UI (Adam Wathan, Steve Schoger)
- Inclusive Components (Heydon Pickering)
- HIG (Apple Human Interface Guidelines)
- Material Design 3 (für Component-Inspiration, nicht 1:1)
- Frontend-Design-Skill (Anthropic)
