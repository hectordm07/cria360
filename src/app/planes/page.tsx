import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Planes", description: "Planes de CRIA360 para cada etapa de tu criadero." };

const plans = [
  { name: "Gratis", price: "S/ 0", note: "Para empezar", cta: "Crear cuenta", features: ["1 criadero", "Hasta 5 animales", "Ficha digital y QR", "1 anuncio al mes", "Perfil público básico"] },
  { name: "Criador", price: "S/ 39", note: "Para crecer", cta: "Probar 14 días", popular: true, features: ["Hasta 50 animales", "Genealogía de 3 generaciones", "Vacunas y recordatorios", "5 anuncios activos", "Historial de propietarios", "Soporte prioritario"] },
  { name: "Pro", price: "S/ 89", note: "Para profesionalizar", cta: "Elegir Pro", features: ["Hasta 250 animales", "Genealogía ilimitada", "3 miembros de equipo", "20 anuncios activos", "Importación masiva", "Reportes y documentos"] },
  { name: "Empresa", price: "A medida", note: "Para operaciones grandes", cta: "Conversar", features: ["Animales ilimitados", "Múltiples sedes", "Roles y auditoría", "API e integraciones", "Verificación institucional", "Acompañamiento dedicado"] },
];

export default function PlansPage() {
  return <>
    <section className="page-hero compact"><span className="eyebrow">Planes simples y transparentes</span><h1>Empieza gratis. Crece a tu ritmo.</h1><p>Paga por la capacidad de gestión, no por ocultar la información que tus compradores necesitan.</p></section>
    <section className="section-shell pricing-grid">{plans.map((plan) => <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>{plan.popular && <span className="popular-label">Más elegido</span>}<span className="plan-note">{plan.note}</span><h2>{plan.name}</h2><div className="price"><strong>{plan.price}</strong>{plan.price.startsWith("S/") && <span>/ mes</span>}</div><Link href="/registro" className={`button ${plan.popular ? "button-primary" : "button-secondary"}`}>{plan.cta}</Link><ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={17} />{feature}</li>)}</ul></article>)}</section>
    <section className="section-shell plan-note-panel"><div><Icon name="shield" size={28} /><div><strong>Las placas se venden por separado</strong><p>El software puede usarse gratis. Los kits QR/NFC tendrán precio según material, tamaño y volumen.</p></div></div><Link href="/registro" className="text-link">Solicitar kit piloto →</Link></section>
  </>;
}
