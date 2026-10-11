export type Animal = {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: string;
  location: string;
  price: string;
  priceValue?: number;
  breeder: string;
  breederSlug: string;
  tone: string;
  mark: string;
  image: string;
  imageAlt: string;
  verified?: boolean;
};

export const featuredAnimals: Animal[] = [
  { id: "CRIA-PE-00428", name: "Magnus 428", species: "Vacuno", breed: "Brown Swiss", sex: "Macho", age: "18 meses", location: "Cajamarca", price: "S/ 8,500", priceValue: 8500, breeder: "Hacienda El Roble", breederSlug: "hacienda-el-roble", tone: "cattle", mark: "V", image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=85", imageAlt: "Ganado vacuno criado en pastoreo", verified: true },
  { id: "CRIA-PE-01772", name: "Aurora 772", species: "Porcino", breed: "Landrace", sex: "Hembra", age: "9 meses", location: "Lima", price: "S/ 2,200", priceValue: 2200, breeder: "Granja Santa Elena", breederSlug: "granja-santa-elena", tone: "swine", mark: "P", image: "/images/animals/porcinos-v1.webp", imageAlt: "Ejemplar porcino en una granja", verified: true },
  { id: "CRIA-PE-03091", name: "Imperial 091", species: "Ave", breed: "Brahma", sex: "Macho", age: "11 meses", location: "Arequipa", price: "S/ 480", priceValue: 480, breeder: "Criadero Valle Sur", breederSlug: "criadero-valle-sur", tone: "poultry", mark: "A", image: "https://images.unsplash.com/photo-1685032236350-3873c9035ee0?auto=format&fit=crop&w=1200&q=85", imageAlt: "Gallo de criadero fotografiado al aire libre", verified: true },
  { id: "CRIA-PE-00816", name: "Canela 816", species: "Caprino", breed: "Anglo-Nubian", sex: "Hembra", age: "14 meses", location: "Piura", price: "S/ 1,400", priceValue: 1400, breeder: "Fundo San Miguel", breederSlug: "fundo-san-miguel", tone: "goat", mark: "C", image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=85", imageAlt: "Cabra de criadero en el campo" },
  { id: "CRIA-PE-01452", name: "Tornado 452", species: "Equino", breed: "Caballo peruano", sex: "Macho", age: "4 años", location: "La Libertad", price: "Consultar", breeder: "Establo Paso Norte", breederSlug: "establo-paso-norte", tone: "horse", mark: "E", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=85", imageAlt: "Caballo de crianza en un campo abierto", verified: true },
  { id: "CRIA-PE-02514", name: "Nube 514", species: "Ovino", breed: "Dorper", sex: "Hembra", age: "8 meses", location: "Junín", price: "S/ 1,100", priceValue: 1100, breeder: "Ganadera Los Andes", breederSlug: "ganadera-los-andes", tone: "sheep", mark: "O", image: "/images/animals/ovinos-v1.webp", imageAlt: "Oveja de criadero sobre pasto" },
];

