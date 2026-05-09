# HyperUI Component Index

30+ kuratierte HyperUI-Patterns mit Token-Mapping und Verwendungs-Hinweis.

[HyperUI](https://www.hyperui.dev) ist Tailwind-basiert, free, MIT.

## Application UI

| Pattern | HyperUI-Link | Verwendung | Hinweis |
|---|---|---|---|
| **Sidebar** | `/components/application-ui-sidenav` | App-Navigation | Mobile: Drawer-Variante |
| **Top-Nav** | `/components/application-ui-header` | Header mit User-Menu | Sticky, blur-backdrop |
| **Tabs** | `/components/application-ui-tabs` | Sub-Navigation | aria-selected korrekt setzen |
| **Modal** | `/components/application-ui-modal` | Dialoge, Forms | Focus-Trap manuell ergänzen |
| **Drawer** | `/components/application-ui-drawer` | Mobile Nav, Filter-Panel | `inert` für Hintergrund |
| **Stat-Card** | `/components/application-ui-stat` | Dashboard-KPIs | Trend-Indicator + Tooltip |
| **Empty-State** | `/components/application-ui-empty-state` | Leere Listen | Illustration + CTA |
| **Loading-Skeleton** | (custom) | Content-Loading | Pulse-Animation via Token |

## Forms

| Pattern | HyperUI-Link | Verwendung | Hinweis |
|---|---|---|---|
| **Input** | `/components/application-ui-input` | Text-Input | Label oben, aria-describedby |
| **Textarea** | `/components/application-ui-textarea` | Mehrzeiliger Input | Auto-resize optional |
| **Select** | `/components/application-ui-select` | Dropdown | bei >5 Optionen → Combobox |
| **Combobox** | `/components/application-ui-combobox` | Searchable Select | Headless-UI-Pattern |
| **Checkbox** | `/components/application-ui-checkbox` | Toggle | Indeterminate-State |
| **Radio** | `/components/application-ui-radio` | Single-Choice | Group-fieldset |
| **Toggle** | `/components/application-ui-toggle` | Boolean-Setting | aria-pressed |
| **File-Upload** | `/components/application-ui-fileupload` | Datei-Auswahl | Drag-and-Drop, MIME-Validation |

## Buttons

| Pattern | HyperUI-Link | Verwendung |
|---|---|---|
| **Primary-Button** | `/components/application-ui-buttons` | CTA |
| **Secondary-Button** | s.o. | Sekundäre Aktion |
| **Ghost-Button** | s.o. | Tertiäre Aktion |
| **Icon-Button** | s.o. | Toolbar |
| **Button-Group** | s.o. | Verwandte Aktionen |
| **Split-Button** | s.o. | Default-Aktion + Dropdown |

## Cards

| Pattern | HyperUI-Link | Verwendung |
|---|---|---|
| **Stat-Card** | `/components/application-ui-stat` | Dashboard |
| **Profile-Card** | `/components/marketing-ui-team` | User-Profil |
| **Feature-Card** | `/components/marketing-ui-features` | Marketing-Features |
| **Article-Card** | `/components/marketing-ui-blog` | Blog-Liste |

## Lists / Tables

| Pattern | HyperUI-Link | Verwendung |
|---|---|---|
| **Data-Table** | `/components/application-ui-table` | Tabellen-Daten |
| **List** | `/components/application-ui-list` | Vertikale Liste |
| **List-Item-with-Action** | s.o. | Liste mit Buttons rechts |
| **Description-List** | `/components/application-ui-descriptions` | Key-Value-Anzeige |

## Feedback

| Pattern | HyperUI-Link | Verwendung |
|---|---|---|
| **Toast** | `/components/application-ui-notification` | Temporäre Notification |
| **Banner** | `/components/marketing-ui-banner` | Persistent Notice |
| **Alert** | `/components/application-ui-alert` | Inline-Warnung |
| **Progress-Bar** | `/components/application-ui-progress` | Fortschritt |
| **Spinner** | (custom) | Loading-State |

## Marketing (für Landing-Page)

| Pattern | HyperUI-Link | Verwendung |
|---|---|---|
| **Hero** | `/components/marketing-ui-hero` | Landing-Page-Top |
| **Pricing** | `/components/marketing-ui-pricing` | Preistabelle |
| **Testimonial** | `/components/marketing-ui-testimonials` | Social-Proof |
| **CTA-Section** | `/components/marketing-ui-cta` | Conversion-Block |
| **FAQ** | `/components/marketing-ui-faq` | Häufige Fragen (Accordion) |

## Token-Mapping (Tailwind → CSS-Custom-Properties)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      spacing: {
        // direct mapping über CSS, nicht Tailwind-Spacing
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      }
    }
  }
};
```

## Wann HyperUI, wann eigene Component

**HyperUI nutzen** wenn:
- Standard-Pattern ausreicht
- Custom-Logic minimal
- Konsistenz mit Design-System

**Eigene Component** wenn:
- Domain-spezifische Logik (z.B. Atom-Manifestation-Renderer)
- Stark abweichendes Verhalten von Standard-Pattern
- Performance-kritisch (z.B. virtualisierte Liste mit Drag-Drop)

## Anti-Patterns

- ❌ HyperUI-Snippet kopieren ohne Token-Mapping
- ❌ Mehrere UI-Bibliotheken (HyperUI + Material) gleichzeitig
- ❌ HyperUI-Customization durch Inline-Tailwind ohne Tokens
- ❌ Aria-Attribute aus HyperUI-Snippet entfernen "weil verwirrend"
