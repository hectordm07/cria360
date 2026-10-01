import type { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace-browser";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Venta de animales de criaderos en Perú",
  description: "Explora gallos, vacunos, porcinos, ovinos, caprinos y caballos de criaderos en Perú con identidad, procedencia y salud.",
  alternates: { canonical: "/marketplace" },
};

export default function MarketplacePage() {
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
    <MarketplaceBrowser />
  </>;
}
