import { useState, useEffect } from "react";

const C = {
  bg: "#0a0c10",
  surface: "#12151c",
  border: "#2d3340",
  text: "#e8eaed",
  muted: "#8b939e",
  faint: "#5c6570",
  green: "#3fb950",
  red: "#f85149",
  yellow: "#d29922",
  blue: "#6ea8ff",
  orange: "#e8a23d",
  purple: "#a78bfa",
  teal: "#2dd4bf",
};

type TradingData = {
  mode: string;
  haltToday: boolean;
  sessionActive: boolean;
  session: {
    todayPnl: number;
    tradesTotal: number;
    wins: number;
    losses: number;
    winRate: number | null;
  };
  latestDigests: {
    daily_html: string | null;
    scalp_md: string | null;
    premkt_md: string | null;
    weekly_md: string | null;
  };
  paperCount: number | null;
};

type BrainItem = {
  id?: string;
  content: string;
  created_at?: string;
  timestamp?: string;
};
type StatusState = "ok" | "error" | "loading";

type SpaceNavActive =
  | "home"
  | "inventory"
  | "trading"
  | "greenroom"
  | "research";

function SpaceTopNav({ active }: { active: SpaceNavActive }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const border = "#27272a";
  const text = "#fafafa";
  const muted = "#a1a1aa";
  const accent = "#e8a23d";
  const links: {
    href: string;
    id: SpaceNavActive | null;
    label: string;
    ext?: boolean;
  }[] = [
    { href: "/", id: "home", label: "Home" },
    { href: "/trading", id: "trading", label: "Trading" },
    { href: "/inventory", id: "inventory", label: "Inventory" },
    { href: "/research", id: "research", label: "Research" },
    { href: "/greenroom.html", id: "greenroom", label: "Green room" },
    {
      href: "https://brainos-dbostwick.zocomputer.io",
      id: null,
      label: "BrainOS",
      ext: true,
    },
  ];
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,12,16,0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${border}`,
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 16px",
            minHeight: 52,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: text,
              fontWeight: 800,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: accent }}>◈</span>
            Navigator
            <span
              style={{
                fontWeight: 500,
                fontSize: 10,
                color: muted,
                marginLeft: 6,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Space
            </span>
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="space-mnav-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              marginLeft: "auto",
              background: "#0d1117",
              border: `1px solid ${border}`,
              color: text,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Menu
          </button>
          <nav
            className="space-dnav"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {links.map((l) => {
              const is = l.id === active;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: is ? 600 : 500,
                    textDecoration: "none",
                    color: is ? text : muted,
                    background: is ? "rgba(232,162,61,0.14)" : "transparent",
                    border: is
                      ? "1px solid rgba(232,162,61,0.4)"
                      : "1px solid transparent",
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div
          className="space-mwrap"
          style={{
            display: menuOpen ? "block" : "none",
            borderTop: `1px solid ${border}`,
            padding: "10px 16px 14px",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {links.map((l) => {
              const is = l.id === active;
              return (
                <a
                  key={`${l.href}-m`}
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: is ? 600 : 500,
                    textDecoration: "none",
                    color: is ? text : muted,
                    background: is ? "rgba(232,162,61,0.12)" : "#0d1117",
                    border: `1px solid ${border}`,
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>
      <style>{`
        .space-mnav-btn { display: none !important; }
        @media (max-width: 768px) {
          .space-mnav-btn { display: inline-flex !important; align-items: center; }
          .space-dnav { display: none !important; }
        }
        @media (min-width: 769px) {
          .space-mwrap { display: none !important; }
        }
      `}</style>
    </>
  );
}

function StatusBadge({ state, label }: { state: StatusState; label: string }) {
  const color = state === "ok" ? C.green : state === "error" ? C.red : C.muted;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: color + "18",
        border: `1px solid ${color}44`,
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span style={{ color, fontSize: 9 }}>
        {state === "loading" ? "◌" : "●"}
      </span>
      <span style={{ color }}>{label}</span>
    </div>
  );
}

function DigestLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        padding: "6px 10px",
        background: "transparent",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        color: C.text,
        textDecoration: "none",
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </a>
  );
}

function LaneCard({
  eyebrow,
  title,
  body,
  href,
  cta,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "20px 20px 18px",
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${accent}`,
        background: C.surface,
        textDecoration: "none",
        color: C.text,
        minHeight: 118,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {eyebrow}
      </p>
      <p style={{ margin: "10px 0 6px", fontSize: 17, fontWeight: 700 }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: C.muted }}>
        {body}
      </p>
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          fontWeight: 600,
          color: accent,
        }}
      >
        {cta} →
      </p>
    </a>
  );
}

export default function HomePage() {
  const [trading, setTrading] = useState<TradingData | null>(null);
  const [tradingState, setTradingState] = useState<StatusState>("loading");
  const [brainItems, setBrainItems] = useState<BrainItem[]>([]);
  const [brainState, setBrainState] = useState<StatusState>("loading");
  const [brainSvcState, setBrainSvcState] = useState<StatusState>("loading");

  useEffect(() => {
    fetch("/api/trading/state")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: TradingData) => {
        setTrading(d);
        setTradingState("ok");
      })
      .catch(() => setTradingState("error"));
  }, []);

  useEffect(() => {
    fetch("https://brainos-dbostwick.zocomputer.io", {
      method: "HEAD",
      mode: "no-cors",
    })
      .then(() => setBrainSvcState("ok"))
      .catch(() => setBrainSvcState("error"));

    fetch("/api/brain-mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "search_thoughts",
          arguments: { query: "recent", limit: 3 },
        },
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Record<string, unknown>>;
      })
      .then((data) => {
        if (data?.error != null) {
          setBrainState("error");
          return;
        }
        const result = data?.result as { content?: unknown } | undefined;
        const content = result?.content;
        let text: string | undefined;
        if (Array.isArray(content) && content.length > 0) {
          const first = content[0] as { text?: string } | string;
          text =
            typeof first === "object" && first && "text" in first
              ? first.text
              : typeof first === "string"
                ? first
                : undefined;
        }
        if (text === undefined || text === "") {
          setBrainItems([]);
          setBrainState("ok");
          return;
        }
        try {
          const p = JSON.parse(text) as unknown;
          const arr: BrainItem[] = Array.isArray(p)
            ? p
            : ((p as { thoughts?: BrainItem[]; results?: BrainItem[] })
                ?.thoughts ??
              (p as { results?: BrainItem[] }).results ??
              []);
          setBrainItems(arr.slice(0, 3));
          setBrainState("ok");
        } catch {
          if (typeof text === "string" && text.trim().length > 0) {
            setBrainItems([{ content: text }]);
            setBrainState("ok");
          } else {
            setBrainState("error");
          }
        }
      })
      .catch(() => setBrainState("error"));
  }, []);

  const modeColor = !trading
    ? C.muted
    : trading.mode === "live"
      ? C.green
      : C.yellow;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <SpaceTopNav active="home" />

      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "28px 16px 48px",
        }}
      >
        <header
          style={{
            marginBottom: 36,
            paddingBottom: 32,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.faint,
            }}
          >
            dbostwick · command surface
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              maxWidth: "16ch",
            }}
          >
            Pick a lane.
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              lineHeight: 1.55,
              color: C.muted,
              maxWidth: "46ch",
            }}
          >
            Markets, restaurants, and expansion research do not belong in one
            undifferentiated list. Use the three lanes below — then drill into
            Trading, Inventory, or Research only when you need depth.
          </p>
        </header>

        <section
          aria-label="Primary lanes"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <LaneCard
            eyebrow="Markets"
            title="Execution & scalp stack"
            body="Alpaca session state, digests, and the full Navigator trading desk. Not your restaurant ops."
            href="/trading"
            cta="Open trading"
            accent={C.orange}
          />
          <LaneCard
            eyebrow="Hospitality"
            title="TPH · inventory & venues"
            body="Cantina Añejo and OAK — theoreticals, orders, MarginEdge-backed views."
            href="/inventory"
            cta="Open inventory"
            accent={C.teal}
          />
          <LaneCard
            eyebrow="Expansion"
            title="CRE site research"
            body="business-research-city pins, markets, and the research wizard — separate from the trading book."
            href="/research"
            cta="Open research"
            accent={C.purple}
          />
        </section>

        <section
          style={{
            marginBottom: 28,
            padding: "18px 20px",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: "rgba(18,21,28,0.65)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.faint,
            }}
          >
            Systems pulse
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatusBadge
              state={brainSvcState}
              label={`BrainOS ${brainSvcState === "ok" ? "reachable" : brainSvcState === "error" ? "offline" : "…"}`}
            />
            <StatusBadge
              state={
                tradingState === "error" ? "error" : trading ? "ok" : "loading"
              }
              label={
                trading
                  ? `${trading.mode.toUpperCase()}${trading.haltToday ? " · HALT" : ""}${trading.sessionActive ? " · LIVE" : ""}`
                  : "Trading API…"
              }
            />
            <StatusBadge
              state={brainState}
              label={`Brain-MCP ${brainState === "ok" ? "ok" : brainState === "error" ? "down" : "…"}`}
            />
          </div>
        </section>

        <section
          aria-label="Scalp snapshot"
          style={{
            marginBottom: 28,
            padding: "22px 24px",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${C.orange}`,
            background: "rgba(232,162,61,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.orange,
                }}
              >
                Markets snapshot
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Navigator Trading OS
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>
                gap-go-trader · Sentinel Intraday v1.1
              </p>
            </div>
            <a
              href="/trading"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(232,162,61,0.15)",
                border: `1px solid rgba(232,162,61,0.45)`,
                color: C.orange,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Full dashboard
            </a>
          </div>

          {tradingState === "loading" && (
            <p style={{ margin: "16px 0 0", fontSize: 13, color: C.muted }}>
              Loading snapshot…
            </p>
          )}
          {tradingState === "error" && (
            <p style={{ margin: "16px 0 0", fontSize: 13, color: C.red }}>
              Could not load trading state.
            </p>
          )}
          {trading && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 18,
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "Mode",
                    value: trading.mode.toUpperCase(),
                    color: modeColor,
                  },
                  {
                    label: "Today P&L",
                    value: `${trading.session.todayPnl >= 0 ? "+" : ""}$${trading.session.todayPnl.toFixed(2)}`,
                    color:
                      trading.session.todayPnl > 0
                        ? C.green
                        : trading.session.todayPnl < 0
                          ? C.red
                          : C.muted,
                  },
                  {
                    label: "Trades",
                    value: String(trading.session.tradesTotal),
                    color: C.text,
                    sub: `${trading.session.wins}W / ${trading.session.losses}L`,
                  },
                ].map(({ label, value, color, sub }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </div>
                    {sub && (
                      <div
                        style={{ fontSize: 11, color: C.muted, marginTop: 4 }}
                      >
                        {sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <details style={{ marginTop: 14 }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.muted,
                    fontWeight: 600,
                  }}
                >
                  Reports & API links
                </summary>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {trading.latestDigests?.daily_html && (
                    <DigestLink
                      href={trading.latestDigests.daily_html}
                      label="Daily HTML"
                    />
                  )}
                  {trading.latestDigests?.scalp_md && (
                    <DigestLink
                      href={trading.latestDigests.scalp_md}
                      label="Scalp digest"
                    />
                  )}
                  {trading.latestDigests?.premkt_md && (
                    <DigestLink
                      href={trading.latestDigests.premkt_md}
                      label="Pre-market"
                    />
                  )}
                  {trading.latestDigests?.weekly_md && (
                    <DigestLink
                      href={trading.latestDigests.weekly_md}
                      label="Weekly"
                    />
                  )}
                  <DigestLink href="/api/trading/state" label="API state" />
                </div>
              </details>
            </>
          )}
        </section>

        <section
          aria-label="Hospitality"
          style={{
            marginBottom: 28,
            padding: "22px 24px",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${C.teal}`,
            background: "rgba(45,212,191,0.05)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.teal,
            }}
          >
            Restaurants
          </p>
          <p
            style={{
              margin: "10px 0 8px",
              fontSize: 16,
              fontWeight: 700,
              color: C.text,
            }}
          >
            Three Points Hospitality
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.muted }}>
            Venue inventory and order workflow — separate from market P&L above.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Cantina Añejo", "OAK"].map((v) => (
              <span
                key={v}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  fontSize: 13,
                  color: C.text,
                }}
              >
                {v}
              </span>
            ))}
          </div>
          <a
            href="/inventory"
            style={{
              display: "inline-block",
              marginTop: 16,
              fontSize: 13,
              fontWeight: 600,
              color: C.teal,
              textDecoration: "none",
            }}
          >
            Go to inventory →
          </a>
        </section>

        <section
          aria-label="Brain"
          style={{
            marginBottom: 28,
            padding: "20px 22px",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: C.surface,
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.muted,
            }}
          >
            Memory · Brain-MCP
          </p>
          {brainState === "loading" && (
            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
              Connecting…
            </p>
          )}
          {brainState === "error" && (
            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
              Unavailable.{" "}
              <a
                href="https://brainos-dbostwick.zocomputer.io"
                style={{ color: C.purple }}
              >
                Open BrainOS
              </a>
            </p>
          )}
          {brainState === "ok" && brainItems.length === 0 && (
            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
              No recent thoughts.
            </p>
          )}
          {brainState === "ok" && brainItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {brainItems.map((item, i) => (
                <div
                  key={item.id ?? i}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {item.content}
                </div>
              ))}
            </div>
          )}
        </section>

        <details
          style={{
            marginBottom: 24,
            padding: "12px 16px",
            borderRadius: 10,
            border: `1px dashed ${C.border}`,
            background: "rgba(18,21,28,0.4)",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: C.muted,
            }}
          >
            External tools (POS, HR, infra)
          </summary>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 8,
              marginTop: 14,
            }}
          >
            {[
              {
                label: "Toast POS",
                href: "https://www.toasttab.com/login",
                desc: "POS",
              },
              {
                label: "7shifts",
                href: "https://app.7shifts.com",
                desc: "Scheduling",
              },
              {
                label: "MarginEdge",
                href: "https://app.marginedge.com",
                desc: "Costs",
              },
              {
                label: "Supabase",
                href: "https://supabase.com/dashboard/project/zpcjphbhjtryovgsvbhk",
                desc: "DB",
              },
              {
                label: "Opvela GitHub",
                href: "https://github.com/b0stwickvibes/opvela-nextjs",
                desc: "SaaS",
              },
            ].map((x) => (
              <a
                key={x.href}
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  textDecoration: "none",
                  color: C.text,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{x.label}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{x.desc}</div>
              </a>
            ))}
          </div>
        </details>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            paddingTop: 8,
            borderTop: `1px solid ${C.border}`,
            fontSize: 12,
            color: C.faint,
          }}
        >
          <a
            href="/greenroom.html"
            style={{ color: C.muted, fontWeight: 600, textDecoration: "none" }}
          >
            Green room
          </a>
          <span style={{ color: C.border }}>|</span>
          <a
            href="https://brainos-dbostwick.zocomputer.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.muted, textDecoration: "none" }}
          >
            BrainOS ↗
          </a>
        </div>
      </div>
    </div>
  );
}
