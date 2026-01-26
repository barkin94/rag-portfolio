import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Barkin Buyuksagin's Portfolio",
    short_name: "Portfolio",
    description: "Portfolio with RAG-powered AMA chat",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3b82f6",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon", purpose: "any" },
    ],
  };
}
