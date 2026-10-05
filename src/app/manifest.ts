import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CRIA360 · Tu granja, conectada",
    short_name: "CRIA360",
    description: "Marketplace, identidad y gestión responsable para criaderos de animales.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffef9",
    theme_color: "#173f35",
    categories: ["business", "shopping", "utilities"],
    lang: "es-PE",
    icons: [
      { src: "/icons/granja-conectada-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/granja-conectada-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/granja-conectada-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
