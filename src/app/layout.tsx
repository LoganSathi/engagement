import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Marcellus, Mukta } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-script",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://engagement.loganvenolia.com"),
  title: "Logan & Venolia — Engagement Ceremony",
  description:
    "Join us for the engagement ceremony of Logan & Venolia — Friday, September 11, 2026, Cyberjaya, Selangor.",
  openGraph: {
    title: "Logan & Venolia — Engagement Ceremony",
    description:
      "Join us for the engagement ceremony of Logan & Venolia — Friday, September 11, 2026, Cyberjaya, Selangor.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logan & Venolia — Engagement Ceremony",
    description:
      "Join us for the engagement ceremony of Logan & Venolia — Friday, September 11, 2026, Cyberjaya, Selangor.",
  },
};

// fixes a mobile browser-chrome color flash: without this, Chrome/Safari
// auto-color the address bar from a default, then snap to match the page
// once it paints (the gold/cream envelope) — pinning it removes the jump
export const viewport: Viewport = {
  themeColor: "#b8862f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${marcellus.variable} ${mukta.variable} h-full antialiased`}
    >
      {/* overflow-x-clip (not hidden) — hidden would make body a scroll
          container and break position:sticky in the mural sections */}
      <body className="min-h-full bg-[var(--cream)] text-[var(--ink)] font-body overflow-x-clip">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
