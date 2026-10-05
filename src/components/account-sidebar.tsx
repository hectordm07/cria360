"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

const navigation = [
  { href: "/cuenta", label: "Dashboard", icon: "store" as const },
  { href: "/cuenta/animales", label: "Inventario", icon: "health" as const },
  { href: "/cuenta/animales/nuevo", label: "Registrar animal", icon: "spark" as const },
  { href: "/cuenta/publicaciones", label: "Publicaciones", icon: "users" as const },
  { href: "/cuenta/finanzas?tipo=venta", label: "Ventas", icon: "spark" as const },
  { href: "/cuenta/finanzas?tipo=compra", label: "Compras", icon: "store" as const },
  { href: "/cuenta/finanzas?tipo=gasto", label: "Gastos", icon: "tag" as const },
  { href: "/placas-inteligentes", label: "Placas QR + NFC", icon: "tag" as const },
  { href: "/marketplace", label: "Marketplace", icon: "users" as const },
  { href: "/planes", label: "Plan y servicios", icon: "verified" as const },
];

export function AccountSidebar({ breederName, plan }: { breederName: string; plan: string }) {
  const pathname = usePathname();
  return <aside className="account-sidebar">
    <div className="account-sidebar-brand"><span className="sidebar-brand-symbol">C360</span><div><strong>CRIA360</strong><small>{breederName}</small></div></div>
    <nav aria-label="Panel del criadero">{navigation.map((item) => { const active = item.href === "/cuenta" ? pathname === item.href : pathname.startsWith(item.href); return <Link className={active ? "active" : ""} href={item.href} key={item.href}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link>; })}</nav>
    <div className="account-plan-mini"><small>PLAN DE GESTIÓN</small><strong>{plan}</strong><Link href="/planes">Ver beneficios del plan</Link></div>
  </aside>;
}
