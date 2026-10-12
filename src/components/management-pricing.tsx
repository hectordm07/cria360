"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { PriceRegionSelector, RegionalPriceNote, useRegionalPricing } from "@/components/regional-pricing";
import { formatPrice, roundPrice } from "@/lib/commercial-pricing";

type Billing = "monthly" | "annual";
const peruCheckoutLinks = {
  granja: { monthly: "https://mpago.la/2kYixKC", annual: "https://mpago.la/2AbaeZ7" },
  pro: { monthly: "https://mpago.la/1Mrerfo", annual: "https://mpago.la/2PNwRAx" },
} as const;

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
    monthly: 34.99,
    annual: 335.90,
    cta: "Solicitar Granja",
    popular: true,
    features: [
      "Hasta 200 animales",
      "Genealogía e historial sanitario",
      "30 publicaciones activas",
      "Ventas, compras y gastos",
      "Escaneo QR / NFC y salidas de inventario",
      "Exportación de reportes básicos",
      "Estadísticas y soporte",
      "10% de descuento en placas",
    ],
  },
  {
    name: "Granja Pro",
    note: "Operación profesional",
    monthly: 69.99,
    annual: 671.90,
    cta: "Solicitar Granja Pro",
    features: [
      "Hasta 2,000 animales",
      "Genealogía y salud completas",
      "Publicaciones ilimitadas",
      
      "Reportes y trazabilidad avanzada",
      "Carga masiva Excel hasta 2,000 animales",
      "Gestión financiera completa",
      "Soporte prioritario",
      "20% de descuento en placas",
    ],
  },
];

export function ManagementPricing() {
  const [billing, setBilling] = useState<Billing>("annual");
  const { quote, loading } = useRegionalPricing();
  const peruCheckoutReady = !loading && quote.country === "PE" && quote.currency === "PEN";
  const money = (value: number) => formatPrice(value, quote.currency, quote.country);

  return (
    <>
      <PriceRegionSelector />
      <div className="billing-toggle" role="group" aria-label="Frecuencia de pago">
        <button type="button" aria-pressed={billing === "monthly"} className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>Mensual</button>
        <button type="button" aria-pressed={billing === "annual"} className={billing === "annual" ? "active" : ""} onClick={() => setBilling("annual")}>
          Anual <span>20% de descuento</span>
        </button>
      </div>

      <div className="management-plan-grid">
        {plans.map((plan) => {
          const isFree = plan.monthly === 0;
          const monthly = isFree ? 0 : quote.prices[plan.popular ? "granjaMonthly" : "proMonthly"];
          const annual = isFree ? 0 : quote.prices[plan.popular ? "granjaAnnual" : "proAnnual"];
          const annualEquivalent = roundPrice(annual / 12, quote.currency);
          const annualSaving = roundPrice(monthly * 12 - annual, quote.currency);
          const price = billing === "annual" ? annual : monthly;
          const checkoutUrl = plan.popular ? peruCheckoutLinks.granja[billing] : peruCheckoutLinks.pro[billing];
          const paymentLink = !isFree && peruCheckoutReady;
          const destination = isFree ? "/registro" : paymentLink ? checkoutUrl : "/cuenta/soporte";
          const buttonText = isFree ? plan.cta : paymentLink ? "Suscribirme con Mercado Pago" : plan.cta;

          return (
            <article className={plan.popular ? "popular" : ""} key={plan.name}>
              {plan.popular && <span className="popular-label">Recomendado</span>}
              <small>{plan.note}</small>
              <h3>{plan.name}</h3>

              {isFree ? (
                <><strong className="management-price">Gratis<em> / 30 días</em></strong><span className="billing-detail">Desde tu primer registro de correo. Sin tarjeta ni renovación automática.</span></>
              ) : billing === "monthly" ? (
                <>
                  <strong className="management-price">{money(price)}<em> / mes</em></strong>
                  <span className="billing-detail">Pago mensual. Cambia de plan al siguiente periodo.</span>
                </>
              ) : (
                <>
                  <strong className="management-price">{money(price)}<em> / año</em></strong>
                  <span className="annual-equivalent">Equivale a {money(annualEquivalent)} / mes</span>
                  <span className="annual-saving">Oferta anual: ahorras {money(annualSaving)} · 20% de descuento</span>
                </>
              )}

              <ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={16} />{feature}</li>)}</ul>
              <Link className={`button ${plan.popular ? "button-gold" : "button-outline-light"}`} href={destination} target={paymentLink ? "_blank" : undefined} rel={paymentLink ? "noopener noreferrer" : undefined} data-analytics-cta={`plan-${plan.name.toLowerCase().replace(/\s+/g,"-")}-${billing}`}>
                {buttonText}
              </Link>
              {paymentLink && <span className="billing-detail">Pago recurrente en soles. La activación de la cuenta requiere verificar el pago con soporte.</span>}
            </article>
          );
        })}
      </div>
      <RegionalPriceNote />
      <p className="pricing-note">En Perú, los enlaces de Mercado Pago permiten contratar cobros recurrentes. La activación del acceso de pago en CRIA360 requiere validación con soporte y aún no es automática. Fuera de Perú, consulta medios de pago disponibles. El pago anual incluye aproximadamente 20% de ahorro. Las placas se venden por separado.</p>
    </>
  );
}


