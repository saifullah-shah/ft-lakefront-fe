import { ImageResponse } from "next/og";

export const alt = "Lakefront Capital & Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#294d50",
          color: "#f3f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Lakefront Capital &amp; Development
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
            A considered relationship with water.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#c7a77b" }}>
            Three distinct locations around Tarbela Lake
          </div>
        </div>
      </div>
    ),
    size,
  );
}
