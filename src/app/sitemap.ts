import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { featuredAnimals } from "@/lib/demo-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/marketplace",
    "/venta-de-gallos",
    "/placas-inteligentes",
    "/blog",
    "/planes",
    "/registro",
    "/instalar",
    "/contacto",
    "/aviso-legal",
    "/privacidad",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-10-05"),
    changeFrequency: path === "/marketplace" ? "daily" as const : "weekly" as const,
    priority: path === "" ? 1 : path === "/marketplace" || path === "/venta-de-gallos" ? 0.9 : path === "/contacto" ? 0.8 : 0.6,
  }));

  const articleRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [post.image],
  }));

  const animalRoutes = featuredAnimals.map((animal) => ({
    url: `${baseUrl}/animales/${animal.id}`,
    lastModified: new Date("2026-10-05"),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [animal.image],
  }));

  return [...staticRoutes, ...articleRoutes, ...animalRoutes];
}
