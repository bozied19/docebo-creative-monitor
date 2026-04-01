import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Health Monitor | Docebo",
  description:
    "Campaign fatigue monitoring and creative refresh engine powered by PostHog and Claude",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Docebo typography: Figtree (body), Lora (quotes), IBM Plex Mono (code/CTA) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Special Gothic Expanded — Docebo's headline font (not on Google Fonts, requires local install or CDN) */}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
