"use client";
import { useActionState, useState } from "react";
import { createTransaction } from "@/app/cuenta/finanzas/actions";
import { validTransactionAmount, validTransactionDate } from "@/lib/finance-validation";

const suggestions = { venta: ["Venta de animales", "Venta de huevos", "Venta de leche"], compra: ["Compra de animales", "Alimento", "Equipamiento"], gasto: ["Alimento", "Vacunas", "Veterinario", "Transporte"] };
export function QuickFinanceForm({ type, today }: { type: "venta" | "compra" | "gasto"; today: string }) {
  const [state, action, pending] = useActionState(createTransaction, { error: "" });
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [date, setDate] = useState(today);
  const [payment, setPayment] = useState("pagado");
  const [notes, setNotes] = useState("");
  const valid = concept.trim().length >= 2 && validTransactionAmount(amount) && validTransactionDate(date);
  return <form action={action} className="quick-finance-form" aria-busy={pending}>
    <input name="type" value={type} type="hidden" />
    <label className="quick-amount">Monto total (S/)<input name="amount_pen" type="number" inputMode="decimal" min="0.01" max="9999999999.99" step="0.01" required value={amount} onChange={event => setAmount(event.target.value)} placeholder="0.00" readOnly={pending} /></label>
    <label>Concepto<input name="concept" required minLength={2} maxLength={120} value={concept} onChange={event => setConcept(event.target.value)} placeholder={type === "gasto" ? "¿En qué se utilizó?" : type === "compra" ? "¿Qué compraste?" : "¿Qué vendiste?"} readOnly={pending} /></label>
    <div className="concept-suggestions" aria-label="Conceptos frecuentes">{suggestions[type].map(suggestion => <button key={suggestion} type="button" aria-pressed={concept === suggestion} onClick={() => setConcept(suggestion)} disabled={pending}>{suggestion}</button>)}</div>
    <label>Fecha<input name="transaction_date" type="date" required value={date} onChange={event => setDate(event.target.value)} readOnly={pending} /></label>
    <label>Estado del pago<select name="payment_status" value={payment} onChange={event => setPayment(event.target.value)} disabled={pending}><option value="pagado">{type === "venta" ? "Cobrado" : "Pagado"}</option><option value="pendiente">Pendiente</option></select></label>
    <details className="quick-notes"><summary>Añadir una nota <span>Opcional</span></summary><label>Nota<textarea name="notes" rows={3} maxLength={2000} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Información adicional del movimiento" readOnly={pending} /></label></details>
    {state.error && <p className="form-notice error" role="alert">{state.error}</p>}
    <div className="quick-form-submit"><button className="button button-primary" type="submit" disabled={pending || !valid}>{pending ? "Guardando…" : `Guardar ${type}`}</button><p aria-live="polite">{pending ? "Estamos guardando tu movimiento." : !valid ? "Completa el monto y el concepto para guardar." : "Se guardará en los movimientos de tu criadero."}</p></div>
  </form>;
}
