import type { Metadata } from "next";
import { CheckoutExperience } from "@/components/checkout-experience";
import "./checkout.css";

export const metadata: Metadata = {
  title: "Checkout seguro de suscripción",
  description: "Revisa tu suscripción CRIA360 y continúa al cobro recurrente seguro de Mercado Pago Perú.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; periodo?: string }>;
}) {
  const params = await searchParams;
  const plan = params.plan === "pro" ? "pro" : "granja";
  const period = params.periodo === "mensual" ? "monthly" : "annual";
  return <CheckoutExperience initialPlan={plan} initialPeriod={period} />;
}
