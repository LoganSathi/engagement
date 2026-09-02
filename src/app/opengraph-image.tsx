import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Logan & Venolia — Engagement Ceremony";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/art/logan-venolio-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 30%, #7a1f2b 0%, #5d1420 55%, #2c0a0e 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 128,
            height: 128,
            borderRadius: "50%",
            border: "3px solid #f5c64f",
            overflow: "hidden",
            marginBottom: 28,
            background: "#fdf8ec",
          }}
        >
          <img
            src={logoSrc}
            alt=""
            width={128}
            height={128}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            color: "#f3d98b",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          You&apos;re Invited
        </div>
        <div
          style={{
            display: "flex",
            color: "#fdf3df",
            fontSize: 72,
            letterSpacing: 4,
            fontWeight: 600,
          }}
        >
          LOGAN &amp; VENOLIA
        </div>
        <div
          style={{
            display: "flex",
            color: "#f5c64f",
            fontSize: 30,
            marginTop: 18,
            fontStyle: "italic",
          }}
        >
          are getting engaged
        </div>
        <div
          style={{
            display: "flex",
            color: "#f3d98b",
            fontSize: 24,
            marginTop: 26,
            letterSpacing: 2,
          }}
        >
          Friday · September 11, 2026 · Cyberjaya, Malaysia
        </div>
      </div>
    ),
    { ...size }
  );
}
