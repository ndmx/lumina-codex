import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumina Codex",
    short_name: "Lumina",
    description: "A living digital atelier where design principles become immersive, interactive experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#06070a",
    theme_color: "#79f3df",
    lang: "en",
  };
}
