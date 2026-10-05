"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";

type Billing = "monthly" | "annual";

const plans = [
  {
    name: "Inicial",
    note: "Para probar CRIA360",
    monthly: 0,
    annual: 0,
    cta: "Crear mi granja",
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
    note: "Criaderos en crecimiento",
    monthly: 69.9,
    annual: 699,
    cta: "Elegir Granja",
    popular: true,
    features: [
      "Hasta 150 animales",
      "Genealogía e historial sanitario",
      "30 publicaciones activas",
      "Ventas, compras y gastos",
      "Escaneo QR / NFC y salidas de inventario",
      "Estadísticas y soporte",
      "10% de descuento en placas",
    ],
  },
  {
    name: "Granja Pro",
    note: "Operación profesional",
    monthly: 149.9,
    annual: 1499,
    cta: "Elegir Pro",
    features: [
      "Hasta 1,000 animales",
      "Genealogía y salud completas",
      "Publicaciones ilimitadas",
      "Hasta 5 usuarios del equipo",
      "Reportes y trazabilidad avanzada",
      "Gestión financiera completa",
      "Prioridad en soporte",
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
        <button type="button" className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>Mensual</button>
        <button type="button" className={billing === "annual" ? "active" : ""} onClick={() => setBilling("annual")}>
          Anual <span>Ahorra 2 meses</span>
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
              {plan.popular && <span className="popular-label">Mejor valor</span>}
              <small>{plan.note}</small>
              <h3>{plan.name}</h3>

              {isFree ? (
                <strong className="management-price">Gratis</strong>
              ) : billing === "monthly" ? (
                <>
                  <strong className="management-price">S/ {money(price)}<em> / mes</em></strong>
                  <span className="billing-detail">Puedes cambiar o cancelar el plan al siguiente periodo.</span>
                </>
              ) : (
                <>
                  <strong className="management-price">S/ {money(price)}<em> / año</em></strong>
                  <span className="annual-equivalent">Equivale a S/ {money(annualEquivalent)} / mes</span>
                  <span className="annual-saving">Ahorras S/ {money(annualSaving)} al año</span>
                </>
              )}

              <ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={16} />{feature}</li>)}</ul>
              <Link className={`button ${plan.popular ? "button-gold" : "button-outline-light"}`} href="/registro" data-analytics-cta={`plan-${plan.name.toLowerCase().replace(/\s+/g,"-")}-${billing}`}>
                {plan.cta}
              </Link>
            </article>
          );
        })}
      </div>
      <p className="pricing-note">Los precios incluyen actualizaciones de la plataforma. Las placas físicas se adquieren por separado.</p>
    </>
  );
}
