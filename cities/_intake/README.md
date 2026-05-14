# City intake stubs

Drop **machine-readable briefs** here (or beside a new slug under `cities/<slug>/_intake/`) before the research slash command runs. Typical flow:

1. Datablist, Git issue, or email exports a YAML/JSON snippet.
2. `scripts/init-city-structure.sh <slug>` creates empty folders matching the archive layout under `thoughts/dashboard-and-multi-city-research-architecture.md`.
3. An agent merges the brief → runs `/business-research-city …` → fills `anchors.json`, playbooks, and scrapes.
4. Optional: curate `data/inventory/*.json` with `_meta.venues` so the control center Deal pins tab can sort by straight-line miles.

See `example.request.yaml` for a minimal schema aligned with the research wizard headers.
