# Dashboard & multi-city research architecture — notes for Claude review / enhancement

**Purpose:** Capture everything discussed and implemented around `business-research-city`, the Austin property dashboard, and the gap between **agent-led CRE research** vs **a live unified UI**. Intended for a follow-on Claude pass to critique, extend, or automate.

**Last touched context:** User asked whether the dashboard could replace per-city massive research + PDP population “live”; answer was **no as-built** — dashboard reads curated JSON; research/scrapes remain upstream.

---

## 1. Product intent (operator mental model)

- **Site selection** for hospitality / spectacle F&B concepts anchored on **trade-area presets** (e.g. Austin `ut-moody-core`, `q2-north`, `both`).
- Runs are orchestrated via a Cursor command **`/business-research-city`** with flags (`--city`, `--state`, `--trade-area`, `--depth`, `--condo_policy`, `--corporate_podium_policy`).
- **Outputs** are filesystem artifacts under `cities/<slug>/`: anchors, playbooks, scrapes (index + PDP markdown), receipts (TX mixed beverage JSON for deep runs).

**User aspiration:** One **dashboard** that could serve **many cities** without redoing “massive research” and PDP scraping manually each time — i.e. **live** or **semi-automated** ingestion.

**Current reality:** Dashboard is a **rollup viewer** of hand-curated inventory for Austin only; deep research pipeline is unchanged.

---

## 2. Repository layout (authoritative)

From root `README.md`:

```
business-research-city/
├── README.md
└── cities/
    └── <city-slug>/          # lowercase from --city
        ├── anchors.json       # Phase 0 anchor discovery
        ├── playbooks/        # synthesized Markdown (email-ready)
        └── data/
            ├── scrapes/       # portal index / search-result markdown dumps
            │   └── pdp/       # property detail page scrapes (--depth=deep)
            ├── inventory/     # optional curated manifests (dashboard JSON)
            └── receipts/      # mixed beverage exports (TX + deep)
```

**Slug rule:** `--city` → lowercase, spaces → hyphens.

Older pilots may live under `~/.firecrawl/playbooks/<city>/`; new runs target **this repo first**.

---

## 3. Austin research artifact stack (what agents actually produce)

### 3.1 Anchors (`cities/austin/anchors.json`)

Structured Phase 0: university, stadiums/arenas, hotel clusters, wealth corridors, corridor classification notes (e.g. Rainey vs Red River noise posture).

### 3.2 Index scrapes (`data/scrapes/*.md`)

Markdown dumps from listing portals:

| Artifact                                                                                                     | Role                                                   |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `crexi-downtown-restaurants-2026-05-13.md`                                                                   | Crexi search — strongest index fidelity in this corpus |
| `loopnet-sixth-st-restaurants-index.md`, `loopnet-warehouse-restaurants-index.md`                            | Often **CDN/Akamai stubs** — low listing fidelity      |
| `cityfeet-austin-restaurants-index.md`                                                                       | Alternate portal; sometimes large footprints           |
| Regulatory / city stubs (`austin-dsd-build-connect-skim.md`, `austin-search-amplified-placeholder.md`, etc.) | Not inventory; entitlement/diligence context           |

**Known issue:** Crexi results **pollute** with non-core ZIPs (Hutto, Boerne, San Antonio); playbooks filter to **787xx** where relevant.

### 3.3 PDP scrapes (`data/scrapes/pdp/*.md`)

Broker-hosted pages (e.g. RRG Wix), LoopNet teasers when full HTML blocked, CityFeet HTML, extracted flyers.

**Epistemic caveat (from deep playbook):** `--depth=deep` hit **Akamai/login/403** on scripted LoopNet/Crexi HTML; PDP depth is therefore **heterogeneous** — marketing PDFs + open broker sites + degraded captures.

### 3.4 Receipts (`data/receipts/`)

TX mixed beverage obligation-style JSON + narrative notes. Used for **market wedge** stats, not property-level joins without extra keys (TABC / name dedupe).

### 3.5 Playbooks (`playbooks/*.md`)

Human-readable synthesis: thesis, ranked targets, veto gates (`condo_policy`, `corporate_podium_policy`), SF gates (~6.5k SF thesis), broker one-pagers, source inventory tables.

---

## 4. Control Center — what was implemented

**Location:** `control-center/`

**Stack:** Vite 6, React 18, TypeScript, Tailwind 3, lucide-react.

**Entry:** `npm install && npm run dev` → default `http://127.0.0.1:5173/`

### 4.1 Tabs (`src/App.tsx`)

1. **Deal pins** — inventory grid for each market curated in-repo
2. **Research wizard** — guided `/business-research-city …` composer + stakeholder handoff package (`CityDashboard.tsx`)

### 4.2 Deal pins dashboard (`src/components/CityInventoryDashboard.tsx`)

**Data source:** JSON import via Vite alias `@repo` →

`cities/austin/data/inventory/austin-properties.json`

**Features:**

- Filters: anchor venue (from `_meta.venues`; keys vary per market), **deal status** (diligence / rejected-policy / appendix / reference), text search across headline/address/ZIP/corridor/flags/status label.
- Table: thumbnail (first image or placeholder), headline + address + corridor badge, SF text, rent line (mostly undisclosed), **status badge**, **haversine miles** to selected venue; expandable inline breakdown (no separate sidebar) with SF/rent/source copy, brokers, flags, illustrative contribution sandbox, repo-relative artifact paths.

**Important limitation:** Coordinates for properties and venues are **approximate centroids**; miles are **straight-line**, not drive time.

### 4.3 Inventory manifest (`cities/austin/data/inventory/austin-properties.json`)

**`_meta`:** city, state, provenance strings, coordinate disclaimer, `venues` object `{ moody, dkr, q2 }` each `{ label, lat, lng }`.

**`properties`:** array of objects with fields including:

- `id`, `headline`, `addressLine`, `city`, `state`, `zip`
- `lat`, `lng`
- `corridor`, `sfDisplay`, `rentDisplay`, `rentNotes`, `listingSource`
- `agents[]`: `name`, `email`, `phone`, `company`, `title` (nullable where unknown)
- `images[]`: URLs from Crexi / Wix / CityFeet scrapes
- `artifactPaths[]`: strings pointing at markdown under repo
- `flags[]`, `status` (diligence · rejected-policy · appendix · reference) — **surfaced in Deal pins** as badges + filter

**Pins currently modeled (10):** e.g. 510–512 Neches, 710 W 6th (teaser), 501/100 Congress (podium veto), 90 Rainey, 44 East (condo reject), 1915 MLK, 5610 IH-35 (typology fail), 816 Congress, 601 Congress — aligned with playbook narratives.

### 4.4 Build / tooling

- `vite.config.ts`: `resolve.alias.@repo` → repo root (parent of `control-center`).
- `control-center/.gitignore`: `node_modules`, `dist`.
- `control-center/README.md`: documents tabs + data path.
- **Design flow artifacts:** `.design/control-center/` (`DESIGN_BRIEF.md`, `INFORMATION_ARCHITECTURE.md`, `DESIGN_TOKENS.md`, `TASKS.md`, `DESIGN_REVIEW.md`).

---

## 5. Architectural truth: static rollup vs live research

| Layer                        | Automated “live”?            | Notes                                                                                        |
| ---------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| Portal index scrape          | Via agent/Firecrawl when run | Fragile; LoopNet often walled                                                                |
| PDP markdown                 | Via agent when run           | Same fragility                                                                               |
| Playbook synthesis           | Agent-written                | Qualitative gates                                                                            |
| **Dashboard inventory JSON** | **Manual / batch** today     | No watcher, no scraper inside UI                                                             |
| Geospatial accuracy          | Static lat/lng in JSON       | Could swap for geocoding API                                                                 |
| Rent / CAM / TI              | Usually absent in scrapes    | Needs OM or broker                                                                           |
| Multi-city                   | Partially wired              | Markets enumerated in `control-center/src/config/research-markets.tsx` + pinned JSON imports |

**Conclusion:** The dashboard **does not** eliminate repeated research per city unless you add **(a)** per-city inventory files + UI city switcher, **(b)** a generator script/agent step **Markdown/YAML → JSON**, and/or **(c)** authenticated listing APIs — each with reliability tradeoffs.

---

## 6. Enhancement backlog (suggested for Claude)

Prioritized ideas for a reviewer to validate or implement:

1. **Multi-city UX** _(partially done)_
   - Markets enumerated in `control-center/src/config/research-markets.tsx` with header market `<select>` on Deal pins.
   - **Still open:** glob-based discovery / lazy-load JSON without editing `research-markets.tsx` for each new city.

2. **Inventory generator**
   - Node script: parse playbook tables + optionally grep PDP frontmatter / Crexi image regex → emit JSON draft for human edit.
   - Version manifest with `generatedAt`, `sourcePlaybookHashes`.

3. **Provenance chips**
   - **Partial:** Deal **status** badges (diligence / appendix / etc.) now first-class; full “Crexi vs PDP” sourcing still future work.

4. **Drive times**
   - Optional Google Routes / OSRM backend; cache per `(propertyId, venueId)`; rate-limit aware.

5. **Receipts sidebar**
   - Load summarized stats from `receipt-analysis-notes-*.md` or small derived JSON — never pretend outlet-level attribution without merge keys.

6. **Auth / compliance**
   - If embedding live scrape in-app: robots/terms, LoopNet ToS, credential vault — separate architecture decision.

7. **Testing**
   - Snapshot tests for haversine helper; fixture JSON for empty/partial agents.

8. **Accessibility**
   - Table semantics, keyboard row selection, contrast on status badges.

---

## 7. Key files reference (quick grep anchors)

| Concern                                | Path                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------- |
| Repo layout                            | `README.md`                                                                |
| Austin anchors                         | `cities/austin/anchors.json`                                               |
| Deep playbook + source inventory table | `cities/austin/playbooks/playbook-ut-moody-core-deep-reject-2026-05-13.md` |
| Standard playbook + Crexi shortlist    | `cities/austin/playbooks/playbook-both-standard-reject-2026-05-13.md`      |
| Inventory manifest                     | `cities/austin/data/inventory/austin-properties.json`                      |
| Dashboard UI                           | `control-center/src/components/CityInventoryDashboard.tsx`                 |
| App shell / tabs                       | `control-center/src/App.tsx`                                               |
| Market list + JSON imports             | `control-center/src/config/research-markets.tsx`                           |
| Status badges (CVA)                    | `control-center/src/components/ui/badge.tsx`                               |
| Research wizard                        | `control-center/src/components/CityDashboard.tsx`                          |
| Vite alias                             | `control-center/vite.config.ts`                                            |
| Design brief / IA / review             | `.design/control-center/`                                                  |

---

## 8. Command replay examples (from playbooks)

Standard Austin both-corridor:

```bash
/business-research-city --city=austin --state=TX --trade-area=both --depth=standard --condo_policy=reject
```

Deep UT/Moody core:

```bash
/business-research-city --city=austin --state=TX --trade-area=ut-moody-core --depth=deep --condo_policy=reject
```

(Command definition lives outside repo per README: `~/.claude/commands/business-research-city.md`.)

---

## 9. Questions for Claude reviewer

1. Should inventory JSON become **single source of truth** upstream of playbooks, or remain **downstream** summary (risk of drift)?
2. What’s the minimal **schema** that generalizes to Nashville/Columbus without Austin-specific gates leaking?
3. Is **automated PDP→JSON** worth maintaining vs **structured broker CSV** uploads?
4. How to represent **confidence** per field (index vs PDP vs broker verbal) in UI without clutter?

---

_End of thoughts dump — safe for iterative enhancement._
