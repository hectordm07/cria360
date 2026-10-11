import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CRIA360 · Tu granja, conectada",
    short_name: "CRIA360",
    description: "Tu criadero en el celular: inventario, ventas, gastos e identidad QR.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffef9",
    theme_color: "#173f35",
    categories: ["business", "shopping", "utilities"],
    lang: "es-PE",
    shortcuts: [
      { name: "Registrar venta", short_name: "Venta", url: "/cuenta/finanzas/nuevo?tipo=venta" },
      { name: "Registrar gasto", short_name: "Gasto", url: "/cuenta/finanzas/nuevo?tipo=gasto" },
      { name: "Mi inventario", short_name: "Inventario", url: "/cuenta/animales" },
    ],
    icons: [
      { src: "/icons/granja-conectada-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/granja-conectada-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/granja-conectada-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}


