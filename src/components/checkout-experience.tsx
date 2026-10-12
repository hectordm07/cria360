"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";

type Plan = "granja" | "pro";
type Period = "monthly" | "annual";
const options = {
  granja: {
    title: "Granja",
    animals: "Hasta 200 animales",
    features: ["Inventario y genealogía", "Ventas, compras y gastos", "Control sanitario y reportes básicos"],
    monthly: { price: 34.99, link: "https://mpago.la/2kYixKC" },
    annual: { price: 335.90, link: "https://mpago.la/2AbaeZ7" },
  },
  pro: {
    title: "Granja Pro",
    animals: "Hasta 2,000 animales",
    features: ["Todas las funciones de Granja", "Carga masiva desde Excel", "Reportes avanzados y soporte prioritario"],
    monthly: { price: 69.99, link: "https://mpago.la/1Mrerfo" },
    annual: { price: 671.90, link: "https://mpago.la/2PNwRAx" },
  },
} as const;

const pen = (price: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(price);

export function CheckoutExperience({ initialPlan, initialPeriod }: { initialPlan: Plan; initialPeriod: Period }) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const selected = options[plan];
  const selectedPayment = selected[period];
  const savings = Math.max(0, selected.monthly.price * 12 - selected.annual.price);

  return (
    <section className="cria-checkout">
      <div className="cria-checkout-shell">
        <Link href="/planes#gestion" className="cria-checkout-back"><Icon name="arrow-left" size={17} /> Volver a los planes</Link>
        <div className="cria-checkout-heading">
          <span className="cria-checkout-eyebrow"><Icon name="shield-check" size={18} /> Suscripciones CRIA360</span>
          <h1>Un último paso para organizar tu criadero.</h1>
          <p>Revisa tu plan y continúa al pago seguro. Tu suscripción se cobrará automáticamente con la frecuencia que elijas.</p>
        </div>

        <div className="cria-checkout-grid">
          <div className="cria-checkout-panel">
            <div className="cria-checkout-section-title"><span className="cria-checkout-number">1</span><div><h2>Selecciona tu plan</h2><p>Podrás ampliarlo cuando lo necesites.</p></div></div>
            <div className="cria-checkout-options" role="group" aria-label="Plan de suscripción">
              {(Object.keys(options) as Plan[]).map(key => (
                <button key={key} type="button" className={`cria-checkout-option ${plan === key ? "selected" : ""}`} aria-pressed={plan === key} onClick={() => setPlan(key)}>
                  <span><strong>{options[key].title}</strong><small>{options[key].animals}</small></span>
                  <Icon name={plan === key ? "circle-check" : "circle"} size={23} />
                </button>
              ))}
            </div>

            <div className="cria-checkout-section-title"><span className="cria-checkout-number">2</span><div><h2>Frecuencia de pago</h2><p>Sin cargos adicionales de CRIA360 por elegir un periodo.</p></div></div>
            <div className="cria-checkout-frequency" role="group" aria-label="Frecuencia de cobro">
              <button type="button" aria-pressed={period === "monthly"} className={period === "monthly" ? "selected" : ""} onClick={() => setPeriod("monthly")}>Mensual</button>
              <button type="button" aria-pressed={period === "annual"} className={period === "annual" ? "selected" : ""} onClick={() => setPeriod("annual")}>Anual <span>Ahorra ~20%</span></button>
            </div>

            <div className="cria-checkout-benefits">
              <h3>Todo lo incluido en {selected.title}</h3>
              <ul>{selected.features.map(item => <li key={item}><Icon name="check-circle" size={18}/>{item}</li>)}</ul>
            </div>
          </div>

          <aside className="cria-checkout-summary" aria-label="Resumen del pedido">
            <span className="cria-checkout-eyebrow">Resumen de suscripción</span>
            <h2>{selected.title}</h2>
            <p>{selected.animals}</p>
            <div className="cria-checkout-line"><span>Periodo</span><strong>{period === "annual" ? "Cada 12 meses" : "Cada mes"}</strong></div>
            {period === "annual" && <div className="cria-checkout-line discount"><span>Ahorro frente a 12 meses</span><strong>−{pen(savings)}</strong></div>}
            <div className="cria-checkout-total"><span>Total recurrente</span><strong>{pen(selectedPayment.price)}</strong><small>/{period === "annual" ? "año" : "mes"}</small></div>
            <div className="cria-checkout-currency"><Icon name="map-pin" size={17}/> Precio y cobro en soles peruanos (PEN)</div>
            <a className="cria-checkout-pay" href={selectedPayment.link} target="_blank" rel="noopener noreferrer" data-analytics-cta={`checkout-${plan}-${period}`}>
              Continuar con Mercado Pago <Icon name="arrow-up-right" size={20}/>
            </a>
            <p className="cria-checkout-note"><Icon name="lock-keyhole" size={17}/> CRIA360 no recoge ni almacena datos de tu tarjeta. Mercado Pago procesa el pago.</p>
            <div className="cria-checkout-activation">
              <strong><Icon name="info" size={17}/> Importante sobre la activación</strong>
              <p>La autorización de pago no activa todavía el plan de forma automática en CRIA360. Después de pagar, comunícate con soporte desde tu cuenta para verificar tu suscripción y habilitarla.</p>
              <Link href="/cuenta/soporte">Ir a soporte de CRIA360 →</Link>
            </div>
            <p className="cria-checkout-terms">Al continuar, aceptas los términos del cobro recurrente presentados por Mercado Pago. Las placas físicas se venden por separado. Puedes solicitar la cancelación de futuras renovaciones desde Mercado Pago.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
