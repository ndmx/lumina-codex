import type { Metadata } from "next";
import { SystemShowcase } from "@/components/system-showcase";
import "./showcase.css";

export const metadata: Metadata = {
  title: "System",
  description:
    "Lumina's scheme, grid, and variation systems — light and dark, mobile and web, driven by one set of tokens.",
};

export default function SystemPage() {
  return (
    <main className="lumina-page">
      <div className="lumina-page__veil" />
      <SystemShowcase />
    </main>
  );
}
