import { useState } from "react";

const C = {
  surface: "#0c0e12",
  text: "#e4e4e7",
  muted: "#a1a1aa",
  faint: "#71717a",
  accent: "#e8932a",
  border: "#27272a",
};

const GAP_GO_REPO = "https://github.com/b0stwickvibes/gap-go-trader";
const BRAINOS_ORIGIN = "https://brainos-dbostwick.zocomputer.io";

type SpaceNavActive =
  | "home"
  | "inventory"
  | "trading"
  | "greenroom"
  | "research";

/** Inlined — Zo Space compiles each route alone (`./SpaceNav` is not on bundle path). Same chrome as `HomeRoute.zo.tsx`. */
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
      href: BRAINOS_ORIGIN,
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

/** Zo Space `/trading` — primary links to GitHub + BrainOS trading (not ~/Projects). */
export default function TradingPage() {
  const brainTrading = `${BRAINOS_ORIGIN.replace(/\/$/, "")}/?view=trading`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.surface,
        color: C.text,
        fontFamily: "ui-sans-serif, system-ui, 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpaceTopNav active="trading" />
      <main
        id="zo-main"
        style={{
          flex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fafafa",
            margin: "0 0 12px",
          }}
        >
          Trading
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: C.muted,
            margin: "0 0 8px",
          }}
        >
          Navigator scalp stack: canonical source is the{" "}
          <strong style={{ color: C.text, fontWeight: 600 }}>
            gap-go-trader
          </strong>{" "}
          repo on GitHub. The full trading desk (P&amp;L, tiers, state files)
          lives in BrainOS — open the Trading view there.
        </p>
        <p
          style={{ fontSize: 13, lineHeight: 1.55, color: C.faint, margin: 0 }}
        >
          The Zo runner checks out that same remote on{" "}
          <code style={{ color: C.muted }}>main</code> — use GitHub as the
          source of truth, not ad-hoc project folders.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 28,
          }}
        >
          <a
            href={GAP_GO_REPO}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 10,
              background: "rgba(232, 147, 42, 0.12)",
              border: `1px solid rgba(232, 147, 42, 0.45)`,
              color: C.accent,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            gap-go-trader on GitHub ↗
          </a>
          <a
            href={brainTrading}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 10,
              background: "#18181b",
              border: `1px solid ${C.border}`,
              color: C.text,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Open BrainOS · Trading ↗
          </a>
        </div>
      </main>
    </div>
  );
}
