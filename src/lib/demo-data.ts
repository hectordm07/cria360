export type Animal = { id: string; name: string; species: string; breed: string; sex: string; age: string; location: string; price: string; breeder: string; breederSlug: string; tone: string; mark: string; verified?: boolean };

export const featuredAnimals: Animal[] = [
  { id: "CRIA-PE-00428", name: "Magnus 428", species: "Vacuno", breed: "Brown Swiss", sex: "Macho", age: "18 meses", location: "Cajamarca", price: "S/ 8,500", breeder: "Hacienda El Roble", breederSlug: "hacienda-el-roble", tone: "cattle", mark: "V", verified: true },
  { id: "CRIA-PE-01772", name: "Aurora 772", species: "Porcino", breed: "Landrace", sex: "Hembra", age: "9 meses", location: "Lima", price: "S/ 2,200", breeder: "Granja Santa Elena", breederSlug: "granja-santa-elena", tone: "swine", mark: "P", verified: true },
  { id: "CRIA-PE-03091", name: "Imperial 091", species: "Ave", breed: "Brahma", sex: "Macho", age: "11 meses", location: "Arequipa", price: "S/ 480", breeder: "Criadero Valle Sur", breederSlug: "criadero-valle-sur", tone: "poultry", mark: "A", verified: true },
  { id: "CRIA-PE-00816", name: "Canela 816", species: "Caprino", breed: "Anglo-Nubian", sex: "Hembra", age: "14 meses", location: "Piura", price: "S/ 1,400", breeder: "Fundo San Miguel", breederSlug: "fundo-san-miguel", tone: "goat", mark: "C" },
  { id: "CRIA-PE-01452", name: "Tornado 452", species: "Equino", breed: "Caballo peruano", sex: "Macho", age: "4 años", location: "La Libertad", price: "Consultar", breeder: "Establo Paso Norte", breederSlug: "establo-paso-norte", tone: "horse", mark: "E", verified: true },
  { id: "CRIA-PE-02514", name: "Nube 514", species: "Ovino", breed: "Dorper", sex: "Hembra", age: "8 meses", location: "Junín", price: "S/ 1,100", breeder: "Ganadera Los Andes", breederSlug: "ganadera-los-andes", tone: "sheep", mark: "O" },
];
