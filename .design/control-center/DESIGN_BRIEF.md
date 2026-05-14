# Design Brief: Control Center (business-research-city)

## Problem

Expansion operators juggle **filesystem research artifacts** (anchors, scrapes, playbooks, inventory JSON) for multiple metros. Raw markdown and JSON are authoritative but **slow to scan** when comparing pins, brokers, rent signals, and distance to anchor venues. The friction is **cognitive load and context-switching**, not “missing data.”

## Solution

A **single control center app** with two modes:

1. **Deal pins** — read-only roll-up of curated per-city inventory (distances, imagery, brokers, flags, contribution scratchpad) with **explicit deal status** (diligence vs policy rejection vs appendix) so playbook gates stay visible in the UI.
2. **Research wizard** — step-through composer for `/business-research-city` plus handoff copy for agents.

The UI **does not replace** scraping or playbooks; it **surfaces** what the pipeline already produced.

## Experience Principles

1. **Provenance over fantasy** — undisclosed rent and straight-line miles are labeled honestly; contribution math is a labeled sandbox, not underwriting.
2. **One glance hierarchy** — market → anchor venue → sortable/filterable pins → expandable detail.
3. **Policy gates in the open** — condominium / podium / typology vetoes appear as **status**, not buried in flags alone.

## Aesthetic Direction

- **Philosophy**: Operational clarity (Linear-adjacent restraint — dense but scannable, not consumer-glossy).
- **Tone**: Confident, calm, instrument-like.
- **Reference points**: Internal ops dashboards, light shadcn/radix surface.
- **Anti-references**: Marketing microsites, neon “deal room” theatrics, fake precision on rent.

## Existing Patterns

- **Typography / font stack**: System-first with Inter/DM Sans fallbacks in Tailwind; `body` uses `font-sans` on `background` / `foreground` HSL tokens.
- **Colors**: `control-center/src/index.css` — `:root` semantic tokens (`--background`, `--card`, `--primary`, `--muted`, `--border`, `--ring`, `--destructive`, `--radius`).
- **Spacing / radius**: `rounded-lg` / `rounded-xl` via `--radius` (0.75rem); card `shadow-dashboard`.
- **Components**: shadcn-style `Card`, `Table`, `Button`, `Badge` (`status` variants for deal state), lucide icons.
- **Data**: `src/config/research-markets.tsx` imports `InventoryBundle` JSON per market (`austin`, `fort-lauderdale`); `App.tsx` market `<select>` + tabs.

## Component Inventory

| Component                | Status | Notes                                                     |
| ------------------------ | ------ | --------------------------------------------------------- |
| `App` shell              | Exists | Sticky header, skip link, Deal pins vs Research wizard    |
| `CityInventoryDashboard` | Modify | Add **status** column, filter, badges in detail           |
| `CityDashboard` (wizard) | Exists | Align copy with brief “handoff” framing                   |
| `Badge` (deal status)    | Exists | Variants: diligence, rejected-policy, appendix, reference |
| Inventory JSON           | Exists | Per city under `cities/<slug>/data/inventory/`            |

## Key Interactions

- User picks **market** (header) → Deal pins reload (`key={marketId}`).
- User picks **anchor venue** → rows re-sort by haversine miles.
- User filters by **search** and **deal status** → table and mobile cards reflect subset.
- User expands a row → inline `PropertyBreakdownPanel` with brokers, flags, sandbox, artifact paths.

## Responsive Behavior

- **Desktop (md+)** — wide table with horizontal scroll affordance; expandable row for detail.
- **Mobile** — stacked cards; same detail pattern; touch targets ≥ 44px on primary controls.

## Accessibility Requirements

- Skip link targets `#research-main`.
- Focus-visible rings on primary nav, selects, inputs, thumbnail buttons, `aria-expanded` / `aria-controls` on expandable rows.
- Listing images: descriptive `alt` from headline; decorative icons `aria-hidden`.
- Status communicated by **text + color** (badge labels), not color alone.

## Out of Scope

- Live portal scraping inside the app.
- Geocoding / drive-time APIs.
- Authenticated LoopNet/Crexi sessions.
- Dark mode (tokens could support later; not required for this brief).

## Related docs

- `thoughts/dashboard-and-multi-city-research-architecture.md` — pipeline and backlog.
- `control-center/README.md` — run instructions.
