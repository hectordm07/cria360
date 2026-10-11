import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { animalCategories } from "@/lib/category-data";

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
    "/eliminar-cuenta",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-10-11"),
    changeFrequency: path === "/marketplace" ? "daily" as const : "weekly" as const,
    priority: path === "" ? 1 : path === "/marketplace" || path === "/venta-de-gallos" ? 0.9 : path === "/contacto" ? 0.8 : 0.6,
  }));

  const articleRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [new URL(post.image, baseUrl).href],
  }));

  const categoryRoutes = animalCategories.map(category => ({
    url: `${baseUrl}/categorias/${category.slug}`,
    lastModified: new Date("2026-10-11"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    images: [new URL(category.image, baseUrl).href],
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}

