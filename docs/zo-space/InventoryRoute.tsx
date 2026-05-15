import { SpaceTopNav } from "./SpaceNav";

/** Zo Space `/inventory` — replace with long-book / Schwab brief embed. */
export default function InventoryPage() {
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
      <SpaceTopNav active="inventory" />
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
          Inventory
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "#a1a1aa",
            margin: 0,
          }}
        >
          Drop in the long-bucket dashboard, thesis validator output, or
          portfolio narrative for this Space route.
        </p>
      </main>
    </div>
  );
}
