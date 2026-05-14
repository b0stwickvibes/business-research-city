# business-research-city — site-selection artifacts

This folder is the **output root** for `/business-research-city` runs (alongside the command definition in `~/.claude/commands/business-research-city.md`).

## Layout

```
business-research-city/
├── README.md
├── scripts/
│   └── init-city-structure.sh   ← bootstrap cities/<slug>/ + _intake/request.yaml
├── cities/
│   ├── _intake/
│   │   ├── README.md             ← intake / Datablist handoff notes
│   │   └── example.request.yaml  ← template merged per city
│   └── <city-slug>/          ← slug from `--city`
│       ├── anchors.json
│       ├── playbooks/
│       ├── data/
│       │   ├── scrapes/
│       │   │   └── pdp/
│       │   ├── inventory/
│       │   └── receipts/
│       └── _intake/
│           └── request.yaml      ← seeded when using init-city-structure.sh
```

**Slug rule:** derive from `--city`: lowercase, spaces → hyphens (e.g. `San Antonio` → `san-antonio`).

Older pilot files may still live under `~/.firecrawl/playbooks/<city>/`; new runs should write **here** first.

## Git & live dashboard

- **Repository:** initialize or clone, then add remote `b0stwicvibes/business-research-city` (see **`docs/DEPLOY.md`**).
- **Zo / static hosting:** build `control-center` → deploy **`control-center/dist`**; the app’s **Refresh** reloads after you publish a new build.

## Control Center (optional UI)

UI + wizard: **`control-center/`** (see `control-center/README.md`; `npm run dev` spins Vite locally).
