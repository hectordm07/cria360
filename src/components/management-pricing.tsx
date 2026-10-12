"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";

type Billing = "monthly" | "annual";

const plans = [
  {
    name: "Inicial",
    note: "Prueba de lanzamiento · 30 días",
    monthly: 0,
    annual: 0,
    cta: "Probar gratis 30 días",
    features: [
      "Hasta 5 animales",
      "Ficha básica y fotografías",
      "1 publicación activa",
      "1 placa vinculada",
      "Escaneo QR / NFC",
    ],
  },
  {
    name: "Granja",
    note: "Criaderos pequeños y medianos",
    monthly: 29,
    annual: 290,
    cta: "Solicitar Granja",
    popular: true,
    features: [
      "Hasta 150 animales",
      "Genealogía e historial sanitario",
      "30 publicaciones activas",
      "Ventas, compras y gastos",
      "Escaneo QR / NFC y salidas de inventario",
      "Carga masiva desde Excel",
      "Estadísticas y soporte",
      "10% de descuento en placas",
    ],
  },
  {
    name: "Granja Pro",
    note: "Operación profesional",
    monthly: 69,
    annual: 690,
    cta: "Solicitar Granja Pro",
    features: [
      "Hasta 1,000 animales",
      "Genealogía y salud completas",
      "Publicaciones ilimitadas",
      
      "Reportes y trazabilidad avanzada",
      "Carga masiva Excel hasta 1,000 animales",
      "Gestión financiera completa",
      "Soporte prioritario",
      "20% de descuento en placas",
    ],
  },
];

function money(value: number) {
  return value.toLocaleString("es-PE", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function ManagementPricing() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <>
      <div className="billing-toggle" role="group" aria-label="Frecuencia de pago">
        <button type="button" aria-pressed={billing === "monthly"} className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>Mensual</button>
        <button type="button" aria-pressed={billing === "annual"} className={billing === "annual" ? "active" : ""} onClick={() => setBilling("annual")}>
          Anual <span>2 meses gratis</span>
        </button>
      </div>

      <div className="management-plan-grid">
        {plans.map((plan) => {
          const isFree = plan.monthly === 0;
          const annualEquivalent = plan.annual ? plan.annual / 12 : 0;
          const annualSaving = plan.monthly * 12 - plan.annual;
          const price = billing === "annual" ? plan.annual : plan.monthly;

          return (
            <article className={plan.popular ? "popular" : ""} key={plan.name}>
              {plan.popular && <span className="popular-label">Recomendado</span>}
              <small>{plan.note}</small>
              <h3>{plan.name}</h3>

              {isFree ? (
                <><strong className="management-price">Gratis<em> / 30 días</em></strong><span className="billing-detail">Desde tu primer registro de correo. Sin tarjeta ni renovación automática.</span></>
              ) : billing === "monthly" ? (
                <>
                  <strong className="management-price">US$ {money(price)}<em> / mes</em></strong>
                  <span className="billing-detail">Pago mensual. Cambia de plan al siguiente periodo.</span>
                </>
              ) : (
                <>
                  <strong className="management-price">US$ {money(price)}<em> / año</em></strong>
                  <span className="annual-equivalent">Equivale a US$ {money(annualEquivalent)} / mes</span>
                  <span className="annual-saving">Oferta anual: ahorras US$ {money(annualSaving)} · pagas 10 meses y usas 12</span>
                </>
              )}

              <ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={16} />{feature}</li>)}</ul>
              <Link className={`button ${plan.popular ? "button-gold" : "button-outline-light"}`} href={isFree ? "/registro" : "/cuenta/soporte"} data-analytics-cta={`plan-${plan.name.toLowerCase().replace(/\s+/g,"-")}-${billing}`}>
                {plan.cta}
              </Link>
            </article>
          );
        })}
      </div>
      <p className="pricing-note">Precios en dólares estadounidenses (USD) para Latinoamérica. Los planes de pago se activan previa confirmación con soporte; no se cobran automáticamente. El pago anual incluye aproximadamente 17% de ahorro. Las placas físicas se adquieren por separado.</p>
    </>
  );
}


