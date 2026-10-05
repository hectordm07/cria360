import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { ManagementPricing } from "@/components/management-pricing";

export const metadata: Metadata = { title: "Placas y planes para granjas", description: "Compra placas QR o NFC y elige un plan de inventario, salud, genealogía y ventas para tu granja.", alternates: { canonical: "/planes" } };

const platePacks = [
  { name: "Placa QR", price: "S/ 29", detail: "Identidad digital para un animal", badge: "Para empezar", features: ["QR resistente al agua", "Código único CRIA360", "Ficha digital vinculada", "Activación incluida"] },
  { name: "Placa QR + NFC", price: "S/ 49", detail: "Escaneo y lectura por proximidad", badge: "Más elegida", features: ["QR + chip NFC", "Material de alta resistencia", "Ficha digital vinculada", "Activación incluida"] },
  { name: "Pack Granja", price: "Desde S/ 249", detail: "10 placas para inventario", badge: "Mejor precio", features: ["10 placas QR o NFC", "Codificación por lote", "Configuración inicial", "Soporte de activación"] },
];

export default function PlansPage() {
  return <>
    <section className="plans-hero product-plans-hero"><div className="section-shell plans-hero-grid"><div><span className="eyebrow light">Identidad física + gestión digital</span><h1>Una placa para identificar.<br />Un plan para crecer.</h1><p>Empieza comprando la placa que necesita tu animal y suma el sistema de inventario cuando quieras organizar genealogía, vacunas, fotos y ventas.</p><div className="hero-actions"><a className="button button-gold" href="#placas">Ver placas</a><a className="button button-outline-light" href="#gestion">Ver planes de gestión</a></div></div><div className="plans-business-card"><span>Modelo CRIA360</span><h2>Dos productos claros</h2><div><Icon name="tag" /><p><strong>Placas QR y NFC</strong><small>Compra por unidad o en packs.</small></p></div><div><Icon name="store" /><p><strong>Software para granjas</strong><small>Suscripción mensual según capacidad.</small></p></div></div></div></section>

    <section className="section-shell offer-section" id="placas"><div className="plans-section-heading"><span className="eyebrow">Producto físico</span><h2>Placas inteligentes para cada animal</h2><p>La placa se compra una sola vez. La identidad básica permanece activa y puede crecer con tu plan.</p></div><div className="plate-plan-grid">{platePacks.map((pack) => <article className="plate-price-card" key={pack.name}><span>{pack.badge}</span><h3>{pack.name}</h3><strong>{pack.price}</strong><p>{pack.detail}</p><ul>{pack.features.map((feature) => <li key={feature}><Icon name="check" size={16} />{feature}</li>)}</ul><Link className="button button-secondary" href="/registro">Solicitar placas</Link></article>)}</div></section>

    <section className="management-pricing" id="gestion"><div className="section-shell"><div className="plans-section-heading centered"><span className="eyebrow light">Software de gestión</span><h2>Planes para administrar la granja</h2><p>El plan anual incluye el equivalente a dos meses de descuento. Puedes empezar gratis y subir de plan cuando el criadero crezca.</p></div><ManagementPricing /></div></section>

    <section className="section-shell plans-capabilities"><div><span className="eyebrow">Todo conectado</span><h2>Del nacimiento a la venta</h2><p>Cada ficha reúne fotografías, procedencia, padres, vacunas, controles, placa y estado de publicación.</p></div><div className="capability-list"><span><Icon name="store" /> Inventario</span><span><Icon name="tree" /> Árbol genealógico</span><span><Icon name="health" /> Vacunas y salud</span><span><Icon name="spark" /> Fotos y publicaciones</span><span><Icon name="users" /> Vistas y contactos</span><span><Icon name="tag" /> QR + NFC</span></div></section>
  </>;
}
