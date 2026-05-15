# Todo (for Claude) — gap-go-trader operator dashboard + wiring

Hand off to **Claude Desktop / Opus** when touching Navigator scalp, MCP, or BrainOS. Context: the **canonical repo** is [`b0stwickvibes/gap-go-trader`](https://github.com/b0stwickvibes/gap-go-trader); Zo clone: `/home/workspace/Projects/gap-go-trader`.

---

## Done (don’t redo unless regressing)

- [x] **`dashboard/` in repo** — `python3 dashboard/serve.py` pins `GAP_GO_TRADER_ROOT` to the checkout and serves `session_state.build_operator_snapshot()` at `GET /api/snapshot` (stdlib only).
- [x] **BrainOS** — `/api/trading-state` exposes `source_links` → GitHub; Trading tab shows repo links + shortened `Projects/` paths in state table.
- [x] **Zo Space `/trading`** — explains repo vs BrainOS + link to `dashboard/` on GitHub tree.

---

## Open todos

- [ ] **Claude Desktop + `zo_*` tools** — If the user runs **gap-go-trader MCP** locally, keep `GAP_GO_TRADER_ROOT` / mirror (`.zo-mirror`) in sync with Zo **or** document that **Zo hosted MCP** is the path for live disk without rsync (see `thoughts/claude-desktop-gap-go-zo-mcp-checklist.md`).
- [ ] **Expose `dashboard/serve.py` on Zo (optional)** — Today it binds `127.0.0.1:8765`. For remote access: reverse proxy, SSH tunnel, or `GAP_GO_DASHBOARD_HOST=0.0.0.0` **only** behind auth/firewall — never open raw to the internet.
- [ ] **BrainOS embed (optional)** — If a stable internal URL exists for the repo dashboard, add an iframe or “Open operator dashboard” that hits that URL; until then, BrainOS stays the **desk** and the repo dashboard stays the **checkout-native** monitor.
- [ ] **`run_session.sh` / automation** — Consider starting `dashboard/serve.py` via **systemd** or **Zo automation** on session host so the UI is always up (watch restart policy; port conflicts).

---

## One-liner for the user

> “Operator numbers live in **`gap-go-trader` `state/`**; open **`python3 dashboard/serve.py`** from **that** clone, or use BrainOS for the full desk.”
