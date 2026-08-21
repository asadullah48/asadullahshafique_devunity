import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Asadullah Shafique | Agentic AI Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#22D3EE",
            }}
          />
          <div style={{ color: "#22D3EE", fontSize: "24px", letterSpacing: "4px" }}>
            ONLINE · GENERAL AGENT
          </div>
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "84px",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Asadullah Shafique
        </div>
        <div
          style={{
            color: "#22D3EE",
            fontSize: "40px",
            marginTop: "16px",
          }}
        >
          Agentic AI Developer
        </div>
        <div
          style={{
            color: "#71717a",
            fontSize: "26px",
            marginTop: "36px",
            display: "flex",
            gap: "24px",
          }}
        >
          <span>harness</span>
          <span style={{ color: "#22D3EE" }}>×</span>
          <span>loop</span>
          <span style={{ color: "#22D3EE" }}>×</span>
          <span>graph</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
