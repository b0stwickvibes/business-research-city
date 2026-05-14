# Design Tokens: Control Center

**Source of truth (implementation):** `control-center/src/index.css` (`:root`) + `control-center/tailwind.config.js` (`theme.extend`).

This document is the **human-readable contract** for the design flow. Tokens use **HSL components** (no `hsl()` wrapper in variables) matching shadcn conventions.

## Semantic colors (`:root`)

| Token                                | Role                                           |
| ------------------------------------ | ---------------------------------------------- |
| `--background`                       | App canvas (cool gray wash)                    |
| `--foreground`                       | Primary text                                   |
| `--muted` / `--muted-foreground`     | Secondary surfaces / helper text               |
| `--card` / `--card-foreground`       | Elevated panels                                |
| `--border` / `--input`               | Strokes and inputs                             |
| `--primary` / `--primary-foreground` | High-emphasis actions (inverted in this theme) |
| `--secondary` / `--accent`           | Subtle fills                                   |
| `--ring`                             | Focus rings                                    |
| `--destructive`                      | Dangerous actions (minimal use)                |

## Radius

- `--radius`: **0.75rem** — maps to `rounded-lg` and derived `md`/`sm` in Tailwind.

## Shadows

- `shadow-dashboard`: `0 1px 2px rgb(15 23 42 / 0.06)` — card/table lift.

## Typography

- **Family**: `ui-sans-serif, system-ui, Segoe UI, Inter, DM Sans, sans-serif`.
- **Scale**: Tailwind defaults + component-level `text-xs` … `text-3xl` for hierarchy (see brief).

## Deal status (Badge)

Implemented in `components/ui/badge.tsx` via CVA `status` variant:

| Token key         | Visual intent                               |
| ----------------- | ------------------------------------------- |
| `diligence`       | Sky — active follow-up                      |
| `rejected-policy` | Rose — failed condo/podium/typology gates   |
| `appendix`        | Amber — reference-only or wrong typology    |
| `reference`       | Muted — informational / below shortlist bar |

## Future (out of scope for v1)

- `.dark` class mirror of `:root` for dark mode.
- Optional CSS `@theme` if migrating to Tailwind v4.
