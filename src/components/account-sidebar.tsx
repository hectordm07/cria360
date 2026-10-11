"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icon";
import { LogoMark } from "@/components/logo-mark";

const navigation = [
  { href: "/cuenta", label: "Inicio", icon: "store" as const, exact: true },
  { href: "/cuenta/animales", label: "Inventario", icon: "health" as const, exact: true },
  { href: "/cuenta/escanear", label: "Escanear QR / NFC", icon: "scan" as const, exact: true },
  { href: "/cuenta/animales/nuevo", label: "Registrar animal", icon: "spark" as const, exact: true },
  { href: "/cuenta/publicaciones", label: "Publicaciones", icon: "users" as const, exact: true },
  { href: "/cuenta/finanzas?tipo=venta", label: "Ventas", icon: "spark" as const, path: "/cuenta/finanzas", type: "venta" },
  { href: "/cuenta/finanzas?tipo=compra", label: "Compras", icon: "store" as const, path: "/cuenta/finanzas", type: "compra" },
  { href: "/cuenta/finanzas?tipo=gasto", label: "Gastos", icon: "tag" as const, path: "/cuenta/finanzas", type: "gasto" },
  { href: "/cuenta/soporte", label: "Soporte", icon: "users" as const, exact: true },
  { href: "/cuenta/configuracion", label: "Configuración", icon: "shield" as const, exact: true },
  { href: "/placas-inteligentes", label: "Placas QR + NFC", icon: "tag" as const, exact: true },
  { href: "/marketplace", label: "Marketplace", icon: "users" as const, exact: true },
  { href: "/planes", label: "Plan y servicios", icon: "verified" as const, exact: true },
];

export function AccountSidebar({ breederName, plan }: { breederName: string; plan: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const toggleButton = useRef<HTMLButtonElement>(null);

  const isActive = (item: (typeof navigation)[number]) => {
    if ("type" in item && item.type) {
      return (pathname === item.path || pathname.startsWith(`${item.path}/`)) && (searchParams.get("tipo") ?? "venta") === item.type;
    }
    if (item.href === "/cuenta/animales") {
      return pathname === item.href || pathname.startsWith("/cuenta/animales/importar");
    }
    return pathname === item.href;
  };

  return <><aside className="account-sidebar" data-expanded={expanded} onKeyDown={(event) => {
    if (event.key === "Escape" && expanded) {
      setExpanded(false);
      toggleButton.current?.focus();
    }
  }}>
    <div className="account-sidebar-brand"><Link className="sidebar-brand-symbol" href="/" aria-label="CRIA360, inicio"><LogoMark inverse /></Link><div><strong translate="no">CRIA<span>360</span></strong><small>Tu granja, conectada.</small><small title={breederName}>{breederName}</small></div><button ref={toggleButton} className="sidebar-expand-toggle" type="button" aria-label={expanded ? "Contraer panel" : "Ampliar panel"} aria-expanded={expanded} aria-controls="account-navigation" onClick={() => setExpanded(!expanded)}><Icon name={expanded ? "close" : "menu"} /></button></div>
    <nav id="account-navigation" aria-label="Panel del criadero">
      {navigation.map((item) => {
        const active = isActive(item);
        return <Link className={active ? "active" : ""} href={item.href} key={item.href} title={item.label} aria-label={item.label} aria-current={active ? "page" : undefined} onClick={() => setExpanded(false)}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link>;
      })}
    </nav>
    <div className="account-plan-mini"><small>PLAN DE GESTIÓN</small><strong>{plan}</strong><Link href="/planes">Ver beneficios del plan</Link></div>
    <form className="account-sidebar-logout" action="/auth/signout" method="post">
      <button type="submit" aria-label="Salir de CRIA360" title="Salir">
        <Icon name="logout" size={19} />
        <span>Salir</span>
      </button>
    </form>
  </aside>{expanded && <button className="sidebar-backdrop" type="button" aria-label="Contraer panel" onClick={() => { setExpanded(false); toggleButton.current?.focus(); }} />}</>;
}

