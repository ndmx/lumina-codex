import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumina-codex.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lumina Codex",
    template: "%s | Lumina Codex",
  },
  description:
    "A living digital atelier where design principles become immersive, interactive experiences.",
  keywords: [
    "portfolio",
    "design portfolio",
    "interactive portfolio",
    "three.js",
    "react three fiber",
    "creative development",
    "lumina codex",
  ],
  openGraph: {
    title: "Lumina Codex",
    description:
      "A living digital atelier where design principles become immersive, interactive experiences.",
    url: siteUrl,
    siteName: "Lumina Codex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Codex",
    description:
      "A living digital atelier where design principles become immersive, interactive experiences.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
