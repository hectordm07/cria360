import type { Metadata } from "next";
import Link from "next/link";
import { CommissionCalculator } from "@/components/commission-calculator";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Planes para vender animales",
  description:
    "Publica animales gratis o elige un plan para reducir comisiones, administrar tu criadero y obtener mayor visibilidad en CRIA360.",
  alternates: { canonical: "/planes" },
};

const plans = [
  {
    id: "gratis",
    name: "Gratis",
    price: "S/ 0",
    note: "Para comenzar",
    description: "Publica tus primeros animales y prueba CRIA360 sin mensualidad.",
    cta: "Publicar gratis",
    commission: "7% por venta protegida",
    cap: "Máximo S/ 250 por venta",
    features: [
      "Hasta 2 publicaciones activas",
      "Anuncios visibles durante 30 días",
      "Perfil básico del criadero",
      "Código de identidad CRIA360",
      "Servicios adicionales opcionales",
    ],
  },
  {
    id: "criador",
    name: "Criador",
    price: "S/ 39.90",
    note: "Para vender con frecuencia",
    description: "Más publicaciones, mejores herramientas y una comisión reducida.",
    cta: "Elegir Criador",
    popular: true,
    commission: "3% por venta protegida",
    cap: "Máximo S/ 150 por venta",
    features: [
      "Hasta 20 publicaciones activas",
      "Página propia del criadero",
      "Genealogía de 3 generaciones",
      "Estadísticas de visitas y contactos",
      "Descuento en placas QR",
    ],
  },
  {
    id: "pro",
    name: "Criadero Pro",
    price: "S/ 89.90",
    note: "Para profesionalizar",
    description: "Gestión completa para criaderos con catálogo y equipo de trabajo.",
    cta: "Elegir Pro",
    commission: "1% por venta protegida",
    cap: "Máximo S/ 100 por venta",
    features: [
      "Hasta 100 publicaciones activas",
      "Prioridad en los resultados",
      "Genealogía e historial sanitario",
      "Hasta 3 miembros del equipo",
      "Reportes e importación masiva",
    ],
  },
];

const comparisonRows = [
  ["Publicaciones activas", "2", "20", "100"],
  ["Página del criadero", "Básica", "Profesional", "Profesional"],
  ["Comisión por venta protegida", "7%", "3%", "1%"],
  ["Tope por cada venta", "S/ 250", "S/ 150", "S/ 100"],
  ["Genealogía", "Ficha básica", "3 generaciones", "Completa"],
  ["Estadísticas", "—", "Visitas y contactos", "Reportes avanzados"],
  ["Miembros del equipo", "1", "1", "3"],
];

const extras = [
  { icon: "spark" as const, title: "Publicación destacada", price: "S/ 9.90", detail: "Mayor visibilidad durante 7 días." },
  { icon: "tag" as const, title: "Placa QR inteligente", price: "Desde S/ 39", detail: "Identidad física conectada a la ficha digital." },
  { icon: "verified" as const, title: "Verificación documental", price: "S/ 29", detail: "Revisión de identidad y documentos disponibles." },
  { icon: "users" as const, title: "Contactos verificados", price: "Desde S/ 9.90", detail: "Paquetes para responder nuevas oportunidades." },
];

const faqs = [
  {
    question: "¿El plan Gratis realmente no tiene mensualidad?",
    answer: "Sí. Permite mantener hasta dos publicaciones activas sin pagar una cuota mensual. Los servicios para destacar, verificar o identificar con una placa son opcionales.",
  },
  {
    question: "¿Cuándo se cobra la comisión por venta?",
    answer: "Únicamente cuando la operación se complete y cobre mediante la venta protegida de CRIA360. El vendedor verá el costo antes de confirmar.",
  },
  {
    question: "¿Qué ocurre si comprador y vendedor coordinan directamente?",
    answer: "CRIA360 no descuenta una comisión automática de un pago realizado fuera de la plataforma. En ese caso, la plataforma obtiene ingresos de servicios opcionales como destacados, contactos, verificaciones y placas.",
  },
  {
    question: "¿La comisión puede crecer demasiado en animales de alto valor?",
    answer: "No. Cada plan tiene un límite máximo por operación: S/ 250 en Gratis, S/ 150 en Criador y S/ 100 en Criadero Pro.",
  },
];

export default function PlansPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="plans-hero">
        <div className="section-shell plans-hero-grid">
          <div>
            <span className="eyebrow light">Planes transparentes para criadores</span>
            <h1>Publica gratis.<br />Paga menos cuando creces.</h1>
            <p>
              Empieza sin mensualidad y elige un plan cuando necesites más publicaciones,
              gestión y visibilidad. Las comisiones siempre tienen un límite.
            </p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/registro?plan=gratis">Publicar gratis</Link>
              <a className="button button-outline-light" href="#comparar">Comparar planes</a>
            </div>
          </div>
          <div className="revenue-summary" aria-label="Cómo funciona el plan gratuito">
            <span>Plan Gratis</span>
            <strong>S/ 0 <small>al mes</small></strong>
            <ul>
              <li><Icon name="check" /> 2 publicaciones activas</li>
              <li><Icon name="check" /> 7% solo en venta protegida</li>
              <li><Icon name="check" /> Comisión máxima de S/ 250</li>
            </ul>
            <p>También puedes contratar destacados, verificación y placas QR cuando los necesites.</p>
          </div>
        </div>
      </section>

      <section className="section-shell plans-intro" id="comparar">
        <span className="eyebrow">Elige según el tamaño de tu criadero</span>
        <h2>Tres formas de vender con información clara</h2>
        <p>Todos los planes permiten mostrar identidad, procedencia y datos del animal al comprador.</p>
      </section>

      <section className="section-shell pricing-grid pricing-grid-three">
        {plans.map((plan) => (
          <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
            {plan.popular && <span className="popular-label">Mejor equilibrio</span>}
            <span className="plan-note">{plan.note}</span>
            <h2>{plan.name}</h2>
            <p className="plan-description">{plan.description}</p>
            <div className="price">
              <strong>{plan.price}</strong>
              <span>/ mes</span>
            </div>
            <div className="commission-box">
              <strong>{plan.commission}</strong>
              <small>{plan.cap}</small>
            </div>
            <Link
              href={`/registro?plan=${plan.id}`}
              className={`button ${plan.popular ? "button-primary" : "button-secondary"}`}
            >
              {plan.cta}
            </Link>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}><Icon name="check" size={17} />{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <CommissionCalculator />

      <section className="section-shell plan-comparison">
        <div className="plans-section-heading">
          <span className="eyebrow">Comparación completa</span>
          <h2>Lo que incluye cada plan</h2>
        </div>
        <div className="comparison-scroll">
          <table>
            <thead>
              <tr><th>Beneficio</th><th>Gratis</th><th>Criador</th><th>Criadero Pro</th></tr>
            </thead>
            <tbody>
              {comparisonRows.map(([label, free, breeder, pro]) => (
                <tr key={label}><th>{label}</th><td>{free}</td><td>{breeder}</td><td>{pro}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="plan-extras">
        <div className="section-shell">
          <div className="plans-section-heading centered">
            <span className="eyebrow">Servicios opcionales</span>
            <h2>Gana visibilidad sin cambiar de plan</h2>
            <p>El plan Gratis puede complementarse solamente cuando el vendedor lo necesite.</p>
          </div>
          <div className="extra-grid">
            {extras.map((extra) => (
              <article key={extra.title}>
                <span className="extra-icon"><Icon name={extra.icon} /></span>
                <div><h3>{extra.title}</h3><p>{extra.detail}</p></div>
                <strong>{extra.price}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell direct-sale-panel">
        <div><Icon name="shield" size={30} /></div>
        <div>
          <span className="eyebrow">Costos sin sorpresas</span>
          <h2>¿Y si la venta se coordina por WhatsApp?</h2>
          <p>
            Si el pago se realiza fuera de CRIA360, no se descuenta una comisión automática.
            La plataforma se sostiene con servicios opcionales y con las operaciones que utilicen
            la venta protegida.
          </p>
        </div>
      </section>

      <section className="section-shell plans-faq">
        <div className="plans-section-heading centered">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2>Antes de elegir</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>
          ))}
        </div>
      </section>

      <section className="section-shell cta-panel commerce-cta plans-cta">
        <div><span className="eyebrow light">Empieza sin riesgo</span><h2>Publica tus primeros animales gratis.</h2><p>Activa un plan únicamente cuando tu criadero necesite crecer.</p></div>
        <div className="cta-actions"><Link className="button button-white" href="/registro?plan=gratis">Crear cuenta</Link><Link className="button button-ghost" href="/marketplace">Ver marketplace</Link></div>
      </section>
    </>
  );
}
