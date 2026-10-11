import type { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace-browser";
import { featuredAnimals } from "@/lib/demo-data";
import { getCategory } from "@/lib/category-data";

export const metadata: Metadata = {
  title: "Venta de animales de criaderos en Perú",
  description: "Explora gallos, vacunos, porcinos, ovinos, caprinos y caballos de criaderos en Perú con identidad, procedencia y salud.",
  alternates: { canonical: "/marketplace" },
};

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ especie?: string | string[] }> }) {
  const params = await searchParams;
  const requested = typeof params.especie === "string" ? params.especie : "";
  const initialSpecies = getCategory(requested)?.slug ?? "";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Animales disponibles en CRIA360",
    itemListElement: featuredAnimals.map((animal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://cria360.vercel.app/animales/${animal.id}`,
      name: `${animal.name} · ${animal.breed}`,
    })),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />
    <MarketplaceBrowser key={initialSpecies} initialSpecies={initialSpecies} />
  </>;
}

