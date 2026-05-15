import { SpaceTopNav } from "./SpaceNav";

/**
 * Navigator Space — home / launch pad.
 * Paste as your Zo Space `/` (or `/home`) route component.
 */
export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0e12",
        color: "#e4e4e7",
        fontFamily: "ui-sans-serif, system-ui, 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SpaceTopNav active="home" />

      <main id="zo-main" style={{ flex: 1 }}>
        {/* Hero */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid #2a2a30",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.4,
              backgroundImage: `
                radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232, 147, 42, 0.22), transparent),
                linear-gradient(180deg, rgba(12, 14, 18, 0) 0%, #0c0e12 100%)
              `,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cg fill='none' stroke='%232a2a30' stroke-width='0.4'%3E%3Cpath d='M0 14h28M14 0v28'/%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 1120,
              margin: "0 auto",
              padding: "56px 20px 48px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                margin: "0 0 12px",
              }}
            >
              dbostwick · command surface
            </p>
            <h1
              style={{
                fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "#fafafa",
                margin: 0,
                maxWidth: "18ch",
              }}
            >
              One Space. Trading, research, and show prep.
            </h1>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "#a1a1aa",
                maxWidth: "52ch",
              }}
            >
              Jump to the desk you need: live execution, portfolio inventory,
              market-site dossiers, or the green room. BrainOS opens in a
              separate tab when you need the full brain stack.
            </p>
          </div>
        </section>

        {/* Bento destinations */}
        <section
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "40px 20px 24px",
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#71717a",
              margin: "0 0 20px",
            }}
            id="destinations"
          >
            Go to
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            <DestinationCard
              href="/trading"
              title="Trading"
              desc="Navigator scalp session, logs, and execution context tied to the live book."
              kicker="Live"
            />
            <DestinationCard
              href="/inventory"
              title="Inventory"
              desc="Long positions, thesis checks, and holdings narrative — the other side of the ledger."
              kicker="Book"
            />
            <DestinationCard
              href="/research"
              title="Research"
              desc="business-research-city control center: markets, deal pins, and the research wizard."
              kicker="Featured"
              highlight
            />
            <DestinationCard
              href="/greenroom.html"
              title="Green room"
              desc="Pre-show staging, briefs, and last-mile prep before you go on camera or live."
              kicker="Ops"
            />
          </div>
        </section>

        {/* Secondary strip */}
        <section
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "8px 20px 48px",
          }}
        >
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #2a2a30",
              background: "rgba(24, 24, 27, 0.55)",
              padding: "20px 22px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
              justifyContent: "space-between",
            }}
          >
            <div style={{ minWidth: 240 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fafafa",
                }}
              >
                BrainOS
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "#a1a1aa",
                  lineHeight: 1.5,
                }}
              >
                Full orchestration and memory live here — use when you are past
                the lightweight Space chrome.
              </p>
            </div>
            <a
              href="https://brainos-dbostwick.zocomputer.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                color: "#0c0e12",
                background: "#e8932a",
                border: "1px solid rgba(232, 147, 42, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              Open BrainOS ↗
            </a>
          </div>
        </section>

        <footer
          style={{
            marginTop: "auto",
            padding: "24px 20px 32px",
            borderTop: "1px solid #2a2a30",
            textAlign: "center",
            fontSize: 12,
            color: "#71717a",
          }}
        >
          Navigator Space · internal use · routes mirror{" "}
          <code style={{ fontSize: 11, color: "#a1a1aa" }}>docs/zo-space/</code>{" "}
          in <span style={{ color: "#a1a1aa" }}>business-research-city</span>
        </footer>
      </main>
    </div>
  );
}

function DestinationCard({
  href,
  title,
  desc,
  kicker,
  highlight,
}: {
  href: string;
  title: string;
  desc: string;
  kicker: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        borderRadius: 12,
        padding: "18px 18px 20px",
        border: highlight
          ? "1px solid rgba(232, 147, 42, 0.45)"
          : "1px solid #2a2a30",
        background: highlight
          ? "rgba(232, 147, 42, 0.08)"
          : "rgba(24, 24, 27, 0.45)",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(232, 147, 42, 0.55)";
        e.currentTarget.style.background = highlight
          ? "rgba(232, 147, 42, 0.12)"
          : "rgba(39, 39, 42, 0.65)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlight
          ? "rgba(232, 147, 42, 0.45)"
          : "#2a2a30";
        e.currentTarget.style.background = highlight
          ? "rgba(232, 147, 42, 0.08)"
          : "rgba(24, 24, 27, 0.45)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: highlight ? "#e8932a" : "#71717a",
        }}
      >
        {kicker}
      </span>
      <p
        style={{
          margin: "10px 0 8px",
          fontSize: 17,
          fontWeight: 700,
          color: "#fafafa",
        }}
      >
        {title}
      </p>
      <p
        style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#a1a1aa" }}
      >
        {desc}
      </p>
      <p
        style={{
          margin: "14px 0 0",
          fontSize: 12,
          fontWeight: 600,
          color: "#e8932a",
        }}
      >
        Enter →
      </p>
    </a>
  );
}
