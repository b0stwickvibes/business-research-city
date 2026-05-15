import { SpaceTopNav } from "./SpaceNav";

/** Zo Space `/trading` — replace main content with your trading surface or embed. */
export default function TradingPage() {
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
            color: "#a1a1aa",
            margin: 0,
          }}
        >
          Wire your scalp session UI, Alpaca bridge, or Zo-hosted tool here.
          This shell only keeps the shared Navigator nav in sync with other
          Space routes.
        </p>
      </main>
    </div>
  );
}
