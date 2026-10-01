export type AnimalCategory = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  marketplaceSpecies: string[];
  symbol: string;
  tone: string;
  image: string;
  imageAlt: string;
};

export const animalCategories: AnimalCategory[] = [
  { slug: "aves", name: "Aves", shortName: "Aves", description: "Gallos, gallinas y otras aves de crianza permitidas.", marketplaceSpecies: ["Ave", "Aves"], symbol: "A", tone: "amber", image: "https://images.unsplash.com/photo-1685032236350-3873c9035ee0?auto=format&fit=crop&w=1200&q=86", imageAlt: "Ave de criadero en un entorno natural" },
  { slug: "porcinos", name: "Porcinos", shortName: "Porcinos", description: "Lechones y reproductores con procedencia documentada.", marketplaceSpecies: ["Porcino", "Porcinos"], symbol: "P", tone: "rose", image: "https://images.unsplash.com/photo-1532633378163-24c2c0da3c99?auto=format&fit=crop&w=1200&q=86", imageAlt: "Porcino criado en granja" },
  { slug: "vacunos", name: "Vacunos", shortName: "Vacunos", description: "Terneros, vaquillonas y reproductores para ganadería.", marketplaceSpecies: ["Vacuno", "Vacunos"], symbol: "V", tone: "green", image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=86", imageAlt: "Ganado vacuno en pastoreo" },
  { slug: "ovinos", name: "Ovinos", shortName: "Ovinos", description: "Ovinos registrados para crianza y reproducción responsable.", marketplaceSpecies: ["Ovino", "Ovinos"], symbol: "O", tone: "blue", image: "https://images.unsplash.com/photo-1484557985045-edf25e08da945?auto=format&fit=crop&w=1200&q=86", imageAlt: "Ovino sobre pasto" },
  { slug: "caprinos", name: "Caprinos", shortName: "Caprinos", description: "Cabras y reproductores con historial organizado.", marketplaceSpecies: ["Caprino", "Caprinos"], symbol: "C", tone: "gold", image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=86", imageAlt: "Caprino de criadero en el campo" },
  { slug: "equinos", name: "Equinos", shortName: "Equinos", description: "Caballos y yeguas de criaderos identificados.", marketplaceSpecies: ["Equino", "Equinos"], symbol: "E", tone: "brown", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=86", imageAlt: "Caballo de crianza en campo abierto" },
  { slug: "mascotas", name: "Mascotas permitidas", shortName: "Mascotas", description: "Animales de compañía cuya tenencia y transferencia estén permitidas.", marketplaceSpecies: ["Mascota", "Mascotas"], symbol: "M", tone: "violet", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=86", imageAlt: "Perro doméstico identificado" },
  { slug: "otras-especies", name: "Otras especies autorizadas", shortName: "Otras especies", description: "Solo especies con comercialización y documentación legalmente permitidas.", marketplaceSpecies: ["Otro"], symbol: "+", tone: "slate", image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=86", imageAlt: "Animal de crianza legalmente permitido" },
];

export function getCategory(slug: string) {
  return animalCategories.find((category) => category.slug === slug);
}
