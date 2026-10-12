import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { animalCategories } from "@/lib/category-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app";

// Next's image sitemap serializer emits these values directly into XML.
function sitemapImageUrl(image: string) {
  return new URL(image, baseUrl).href.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/marketplace",
    "/venta-de-gallos",
    "/placas-inteligentes",
    "/blog",
    "/planes",
    "/instalar",
    "/contacto",
    "/aviso-legal",
    "/privacidad",
    "/eliminar-cuenta",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(["", "/planes", "/instalar", "/privacidad", "/aviso-legal"].includes(path) ? "2026-10-12" : "2026-10-11"),
    changeFrequency: path === "/marketplace" ? "daily" as const : "weekly" as const,
    priority: path === "" ? 1 : path === "/marketplace" || path === "/venta-de-gallos" ? 0.9 : path === "/contacto" ? 0.8 : 0.6,
  }));

  const articleRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [sitemapImageUrl(post.image)],
  }));

  const categoryRoutes = animalCategories.map(category => ({
    url: `${baseUrl}/categorias/${category.slug}`,
    lastModified: new Date("2026-10-11"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    images: [sitemapImageUrl(category.image)],
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}


