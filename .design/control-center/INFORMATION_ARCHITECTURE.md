# Information Architecture: Control Center

## Site Map

Single-page application (Vite); no route-based URLs. Logical map:

- **Shell** `/` (implicit)
  - **Deal pins** — primary workspace: inventory table (desktop) / cards (mobile)
    - Inline expansion: **Pin detail** (breakdown panel: gallery, envelope, rent signal, brokers, flags, contribution sandbox, repo paths)
  - **Research wizard** — secondary: guided command builder + presets

Market selection and tab state are **in-memory** (not URL-synced); acceptable for internal tool. Future: optional `?market=austin&tab=pins` if shareable links matter.

## Navigation Model

- **Primary navigation**: Header tab control — `Deal pins` | `Research wizard` (max 2).
- **Secondary**: Within Deal pins — anchor venue `<select>`, search field, **deal status filter** (all | diligence | rejected-policy | appendix | reference).
- **Utility**: Skip link; “Clear filters” on table/card headers.
- **Mobile**: Same tab model; cards replace table; no hamburger (single-column stack).

## Content Hierarchy

### Deal pins (80% dwell time expected)

1. **Market + anchor context** — which city and which distance anchor (stadium / corridor centroid).
2. **Pin list** — photo, headline, address, **deal status**, SF, rent signal, miles.
3. **Expanded detail** — evidence brokers can use: images, flags, artifacts, sandbox.

### Research wizard

1. City / state / trade-area / depth / policies.
2. Generated command string + copy affordance.
3. Handoff notes (stakeholder package).

## User Flows

### Compare pins for one market

1. User opens app → Deal pins, default market.
2. User selects anchor venue → rows re-order by miles.
3. User sets status filter to “Diligence” → shortlist only.
4. User expands row → reads flags + artifacts paths → copies broker email.

### Hand off a research run

1. User switches to Research wizard.
2. User steps through or selects presets → copies `/business-research-city …` command.
3. User pastes into Cursor / orchestrator.

## Naming Conventions

| Concept                        | Label in UI                                                       |
| ------------------------------ | ----------------------------------------------------------------- |
| Curated listing row            | **Pin**                                                           |
| Geographic bucket in JSON      | **Corridor**                                                      |
| Stadium / cluster for distance | **Anchor venue**                                                  |
| Playbook gate outcome          | **Status** (diligence / rejected (policy) / appendix / reference) |
| CLI orchestration              | **Research wizard**                                               |

## Component Reuse Map

| Structure                                   | Used on                     |
| ------------------------------------------- | --------------------------- |
| Sticky header + primary tabs                | All views                   |
| `Card` / `Table`                            | Deal pins desktop           |
| `Card` stack                                | Deal pins mobile            |
| `PropertyBreakdownPanel`                    | Expanded row (both layouts) |
| Form controls (`Button`, `select`, `input`) | Filters, wizard             |

## Data Wiring

- Markets: `src/config/research-markets.tsx` → static imports of `cities/<slug>/data/inventory/*-properties.json`.
- Adding a city: new JSON + one `RESEARCH_MARKETS` entry + optional `trade-presets` alignment in wizard.
