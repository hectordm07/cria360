"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icon";
import { LogoMark } from "@/components/logo-mark";

const navigation = [
  { href: "/cuenta", label: "Dashboard", icon: "store" as const, match: "dashboard" },
  { href: "/cuenta/animales", label: "Inventario", icon: "health" as const, match: "inventory" },
  { href: "/cuenta/escanear", label: "Escanear QR / NFC", icon: "scan" as const, match: "scan" },
  { href: "/cuenta/animales/nuevo", label: "Registrar animal", icon: "spark" as const, match: "new-animal" },
  { href: "/cuenta/publicaciones", label: "Publicaciones", icon: "users" as const, match: "publications" },
  { href: "/cuenta/finanzas?tipo=venta", label: "Ventas", icon: "spark" as const, match: "finance-sale" },
  { href: "/cuenta/finanzas?tipo=compra", label: "Compras", icon: "store" as const, match: "finance-purchase" },
  { href: "/cuenta/finanzas?tipo=gasto", label: "Gastos", icon: "tag" as const, match: "finance-expense" },
  { href: "/cuenta/soporte", label: "Soporte", icon: "users" as const, match: "support" },
  { href: "/cuenta/configuracion", label: "Configuración", icon: "shield" as const, match: "settings" },
  { href: "/placas-inteligentes", label: "Placas QR + NFC", icon: "tag" as const, match: "plates" },
  { href: "/marketplace", label: "Marketplace", icon: "users" as const, match: "marketplace" },
  { href: "/planes", label: "Plan y servicios", icon: "verified" as const, match: "plans" },
];

export function AccountSidebar({ breederName, plan }: { breederName: string; plan: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const financeType = searchParams.get("tipo") ?? "venta";

  const isActive = (match: string) => {
    switch (match) {
      case "dashboard": return pathname === "/cuenta";
      case "inventory": return pathname === "/cuenta/animales";
      case "scan": return pathname === "/cuenta/escanear";
      case "new-animal": return pathname === "/cuenta/animales/nuevo";
      case "publications": return pathname.startsWith("/cuenta/publicaciones");
      case "finance-sale": return pathname === "/cuenta/finanzas" && financeType === "venta";
      case "finance-purchase": return pathname === "/cuenta/finanzas" && financeType === "compra";
      case "finance-expense": return pathname === "/cuenta/finanzas" && financeType === "gasto";
      case "support": return pathname.startsWith("/cuenta/soporte");
      case "settings": return pathname.startsWith("/cuenta/configuracion");
      case "plates": return pathname.startsWith("/placas-inteligentes");
      case "marketplace": return pathname.startsWith("/marketplace");
      case "plans": return pathname.startsWith("/planes");
      default: return false;
    }
  };

  return <aside className="account-sidebar">
    <div className="account-sidebar-brand">
      <Link className="sidebar-brand-symbol" href="/" aria-label="CRIA360, inicio"><LogoMark inverse /></Link>
      <div><strong>CRIA<span>360</span></strong><small>Tu granja, conectada.</small><small title={breederName}>{breederName}</small></div>
    </div>
    <nav aria-label="Panel del criadero">
      {navigation.map((item) => {
        const active = isActive(item.match);
        return <Link className={active ? "active" : ""} href={item.href} key={item.href} title={item.label} aria-label={item.label} aria-current={active ? "page" : undefined}>
          <Icon name={item.icon} size={19} /><span>{item.label}</span>
        </Link>;
      })}
    </nav>
    <div className="account-plan-mini"><small>PLAN DE GESTIÓN</small><strong>{plan}</strong><Link href="/planes">Ver beneficios del plan</Link></div>
    <form className="account-sidebar-logout" action="/auth/signout" method="post">
      <button type="submit" aria-label="Salir de CRIA360" title="Salir">
        <Icon name="logout" size={19} />
        <span>Salir</span>
      </button>
    </form>
  </aside>;
}
