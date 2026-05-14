import { useState } from "react";

type SpaceNav = "home" | "inventory" | "trading" | "greenroom" | "research";

const DASHBOARD_ORIGIN = "https://brc-control-center-dbostwick.zocomputer.io";

function SpaceTopNav({ active }: { active: SpaceNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const border = "#27272a";
  const text = "#fafafa";
  const muted = "#a1a1aa";
  const accent = "#f0a500";
  const links: {
    href: string;
    id: SpaceNav | null;
    label: string;
    ext?: boolean;
  }[] = [
    { href: "/", id: "home", label: "Home" },
    { href: "/trading", id: "trading", label: "Trading" },
    { href: "/inventory", id: "inventory", label: "Inventory" },
    { href: "/research", id: "research", label: "Research" },
    { href: "/greenroom.html", id: "greenroom", label: "Greenroom" },
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
          background: "rgba(9,9,11,0.94)",
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
            className="rs-mnav-btn"
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
            className="rs-dnav"
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
                    background: is ? "rgba(240,165,0,0.14)" : "transparent",
                    border: is
                      ? "1px solid rgba(240,165,0,0.4)"
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
          className="rs-mwrap"
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
                    background: is ? "rgba(240,165,0,0.12)" : "#0d1117",
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
        .rs-mnav-btn { display: none !important; }
        @media (max-width: 768px) {
          .rs-mnav-btn { display: inline-flex !important; align-items: center; }
          .rs-dnav { display: none !important; }
        }
        @media (min-width: 769px) {
          .rs-mwrap { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default function ResearchPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e6edf3",
        fontFamily: "'Inter',system-ui,sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpaceTopNav active="research" />
      <iframe
        title="business-research-city — site selection"
        src={`${DASHBOARD_ORIGIN}/`}
        style={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
