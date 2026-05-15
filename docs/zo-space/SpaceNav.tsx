import { useEffect, useState } from "react";

/** Active route id — must match a link with the same `id` when internal. */
export type SpaceNavId =
  | "home"
  | "trading"
  | "inventory"
  | "research"
  | "greenroom";

/**
 * Green room destination. Use a path on this Space, or a full https URL if it
 * lives on another host. (Legacy `greenroom.html` can be swapped here without
 * touching the rest of the nav.)
 */
/** Match the Space route path on Zo (see `list_space_routes` — often `greenroom.html`). */
export const GREENROOM_HREF = "/greenroom.html";

export const BRAINOS_ORIGIN = "https://brainos-dbostwick.zocomputer.io";

const tokens = {
  border: "#2a2a30",
  /** Warm zinc, not pure gray — slight amber bias */
  surface: "#0c0e12",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  accent: "#e8932a",
  accentDim: "rgba(232, 147, 42, 0.14)",
  accentRing: "rgba(232, 147, 42, 0.45)",
} as const;

export function SpaceTopNav({ active }: { active: SpaceNavId }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links: {
    href: string;
    id: SpaceNavId | null;
    label: string;
    ext?: boolean;
    /** Screen-reader hint */
    describe?: string;
  }[] = [
    { href: "/", id: "home", label: "Home", describe: "Navigator Space home" },
    {
      href: "/trading",
      id: "trading",
      label: "Trading",
      describe: "Trading workspace",
    },
    {
      href: "/inventory",
      id: "inventory",
      label: "Inventory",
      describe: "Long book inventory",
    },
    {
      href: "/research",
      id: "research",
      label: "Research",
      describe: "Site selection control center",
    },
    {
      href: GREENROOM_HREF,
      id: "greenroom",
      label: "Green room",
      describe: "Pre-show and staging",
    },
    {
      href: BRAINOS_ORIGIN,
      id: null,
      label: "BrainOS",
      ext: true,
      describe: "Opens BrainOS in a new tab",
    },
  ];

  const linkStyle = (is: boolean, mobile: boolean) =>
    ({
      padding: mobile ? "10px 12px" : "6px 12px",
      borderRadius: 8,
      fontSize: mobile ? 14 : 13,
      fontWeight: is ? 600 : 500,
      textDecoration: "none",
      color: is ? tokens.text : tokens.muted,
      background: is ? tokens.accentDim : "transparent",
      border: is ? `1px solid ${tokens.accentRing}` : "1px solid transparent",
      outline: "none",
      transition: "color 0.15s, background 0.15s, border-color 0.15s",
    }) as const;

  return (
    <>
      <a
        href="#zo-main"
        style={{
          position: "fixed",
          left: 16,
          top: 8,
          zIndex: 200,
          padding: "8px 14px",
          borderRadius: 8,
          background: tokens.accent,
          color: "#0c0e12",
          fontSize: 12,
          fontWeight: 700,
          textDecoration: "none",
          transform: "translateY(-120%)",
          transition: "transform 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = "translateY(-120%)";
        }}
      >
        Skip to content
      </a>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(12, 14, 18, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${tokens.border}`,
          fontFamily: "ui-sans-serif, system-ui, 'Inter', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 16px",
            minHeight: 54,
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
              color: tokens.text,
              fontWeight: 800,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: tokens.accent }} aria-hidden>
              ◈
            </span>
            Navigator
            <span
              style={{
                fontWeight: 500,
                fontSize: 10,
                color: tokens.muted,
                marginLeft: 6,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Space
            </span>
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="zo-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="zo-mnav-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              marginLeft: "auto",
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              color: tokens.text,
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
            className="zo-dnav"
            aria-label="Space"
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
                  aria-current={is ? "page" : undefined}
                  title={l.describe}
                  onClick={() => setMenuOpen(false)}
                  style={linkStyle(is, false)}
                  onMouseEnter={(e) => {
                    if (!is) e.currentTarget.style.color = tokens.text;
                  }}
                  onMouseLeave={(e) => {
                    if (!is) e.currentTarget.style.color = tokens.muted;
                  }}
                >
                  {l.label}
                  {l.ext ? (
                    <span style={{ opacity: 0.6, fontSize: 11 }}> ↗</span>
                  ) : null}
                </a>
              );
            })}
          </nav>
        </div>
        <div
          id="zo-nav-mobile"
          className="zo-mwrap"
          aria-hidden={!menuOpen}
          style={{
            display: menuOpen ? "block" : "none",
            borderTop: `1px solid ${tokens.border}`,
            padding: "10px 16px 14px",
          }}
        >
          <nav
            aria-label="Space mobile"
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            {links.map((l) => {
              const is = l.id === active;
              return (
                <a
                  key={`${l.href}-m`}
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noopener noreferrer" : undefined}
                  aria-current={is ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...linkStyle(is, true),
                    background: is ? tokens.accentDim : tokens.surface,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  {l.label}
                  {l.ext ? " ↗" : ""}
                </a>
              );
            })}
          </nav>
        </div>
        <style>{`
          .zo-mnav-btn { display: none !important; }
          @media (max-width: 768px) {
            .zo-mnav-btn { display: inline-flex !important; align-items: center; }
            .zo-dnav { display: none !important; }
          }
          @media (min-width: 769px) {
            .zo-mwrap { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
