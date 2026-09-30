"use client";

import { useState } from "react";

const calculatorPlans = [
  { id: "gratis", name: "Gratis", rate: 0.07, minimum: 10, maximum: 250 },
  { id: "criador", name: "Criador", rate: 0.03, minimum: 0, maximum: 150 },
  { id: "pro", name: "Criadero Pro", rate: 0.01, minimum: 0, maximum: 100 },
];

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export function CommissionCalculator() {
  const [salePrice, setSalePrice] = useState("500");
  const [selectedPlan, setSelectedPlan] = useState("gratis");

  const plan = calculatorPlans.find((item) => item.id === selectedPlan) ?? calculatorPlans[0];
  const numericPrice = Number(salePrice);
  const safePrice = Number.isFinite(numericPrice) ? Math.max(numericPrice, 0) : 0;
  const calculatedCommission = safePrice === 0 ? 0 : Math.max(safePrice * plan.rate, plan.minimum);
  const commission = Math.min(safePrice, calculatedCommission, plan.maximum);
  const net = Math.max(safePrice - commission, 0);

  return (
    <section className="commission-section">
      <div className="section-shell commission-grid">
        <div className="commission-copy">
          <span className="eyebrow light">Simulador transparente</span>
          <h2>Calcula cuánto recibirías por una venta protegida</h2>
          <p>El cálculo aplica solamente cuando el pago se complete dentro de CRIA360.</p>
          <label htmlFor="sale-price">Precio de venta del animal</label>
          <div className="money-input"><span>S/</span><input id="sale-price" type="number" min="0" step="50" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} /></div>
          <fieldset>
            <legend>Selecciona tu plan</legend>
            <div className="calculator-plans">
              {calculatorPlans.map((plan) => (
                <button className={selectedPlan === plan.id ? "selected" : ""} key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} aria-pressed={selectedPlan === plan.id}>
                  <strong>{plan.name}</strong><span>{Math.round(plan.rate * 100)}%</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="calculator-result" aria-live="polite">
          <span>Con el plan {plan.name}</span>
          <div><small>Comisión CRIA360</small><strong>{currency.format(commission)}</strong></div>
          <div className="net-result"><small>El vendedor recibe</small><strong>{currency.format(net)}</strong></div>
          <p>El límite máximo de este plan es {currency.format(plan.maximum)} por operación.</p>
        </div>
      </div>
    </section>
  );
}
