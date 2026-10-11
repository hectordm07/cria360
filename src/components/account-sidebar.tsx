"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  { href: "/cuenta/mi-cuenta", label: "Mi cuenta", icon: "shield" as const, exact: true },
  { href: "/cuenta/configuracion", label: "Configuración", icon: "shield" as const, exact: true },
  { href: "/placas-inteligentes", label: "Placas QR + NFC", icon: "tag" as const, exact: true },
  { href: "/marketplace", label: "Marketplace", icon: "users" as const, exact: true },
  { href: "/planes", label: "Plan y servicios", icon: "verified" as const, exact: true },
];

export function AccountSidebar({ breederName, plan, preview = false }: { breederName: string; plan: string; preview?: boolean }) {
  const currentPath = usePathname();
  const pathname = preview ? "/cuenta" : currentPath;
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const toggleButton = useRef<HTMLButtonElement>(null);
  const mobileMenuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  const closeMenu = () => {
    setExpanded(false);
    if (mobileMenuButton.current?.offsetParent !== null) mobileMenuButton.current?.focus();
    else toggleButton.current?.focus();
  };

  useEffect(() => {
    if (!expanded) return;
    const frame = requestAnimationFrame(() => drawer.current?.querySelector<HTMLAnchorElement>("nav a")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  const isActive = (item: (typeof navigation)[number]) => {
    if ("type" in item && item.type) {
      return (pathname === item.path || pathname.startsWith(`${item.path}/`)) && (searchParams.get("tipo") ?? "venta") === item.type;
    }
    if (item.href === "/cuenta/animales") {
      return pathname === item.href || pathname.startsWith("/cuenta/animales/importar");
    }
    return pathname === item.href;
  };

  const mobileItems = [
    { href: "/cuenta", label: "Inicio", icon: "store" as const, active: pathname === "/cuenta" },
    { href: "/cuenta/animales", label: "Inventario", icon: "health" as const, active: pathname.startsWith("/cuenta/animales") },
    { href: "/cuenta/escanear", label: "Escanear", icon: "scan" as const, active: pathname === "/cuenta/escanear" },
    { href: "/cuenta/finanzas", label: "Movimientos", icon: "tag" as const, active: pathname.startsWith("/cuenta/finanzas") },
    { href: "/cuenta/mi-cuenta", label: "Cuenta", icon: "users" as const, active: pathname === "/cuenta/mi-cuenta" || pathname === "/cuenta/configuracion" },
  ];

  return <>
    <header className="account-mobile-header">
      <button ref={mobileMenuButton} type="button" aria-label={expanded ? "Cerrar menú del criadero" : "Abrir menú del criadero"} aria-controls="account-navigation" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><Icon name="menu" size={24} /></button>
      <Link className="account-mobile-brand" href="/cuenta"><LogoMark inverse /><span><strong title={breederName}>{breederName}</strong><small>CRIA360 · {plan}</small></span></Link>
      <Link className="account-mobile-help" href="/cuenta/soporte" aria-label="Ayuda y soporte"><Icon name="shield" size={23} /></Link>
    </header>
    <aside ref={drawer} className="account-sidebar" data-expanded={expanded} onKeyDown={(event) => {
    if (event.key === "Escape" && expanded) {
      closeMenu();
    }
    if (event.key === "Tab" && expanded && window.matchMedia("(max-width: 1000px), (display-mode: standalone)").matches) {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }}>
    <div className="account-sidebar-brand"><Link className="sidebar-brand-symbol" href="/cuenta" aria-label="CRIA360, mi criadero"><LogoMark inverse /></Link><div><strong translate="no">CRIA<span>360</span></strong><small>Tu granja, conectada.</small><small title={breederName}>{breederName}</small></div><button ref={toggleButton} className="sidebar-expand-toggle" type="button" aria-label={expanded ? "Contraer panel" : "Ampliar panel"} aria-expanded={expanded} aria-controls="account-navigation" onClick={() => expanded ? closeMenu() : setExpanded(true)}><Icon name={expanded ? "close" : "menu"} /></button></div>
    <nav id="account-navigation" aria-label="Panel del criadero">
      {navigation.map((item) => {
        const active = isActive(item);
        return <Link className={active ? "active" : ""} href={item.href} key={item.href} title={item.label} aria-label={item.label} aria-current={active ? "page" : undefined} onClick={() => setExpanded(false)}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link>;
      })}
    </nav>
    <div className="account-plan-mini"><small>PLAN DE GESTIÓN</small><strong>{plan}</strong><Link href="/planes">Ver beneficios del plan</Link></div>
    {!preview && <form className="account-sidebar-logout" action="/auth/signout" method="post">
      <button type="submit" aria-label="Salir de CRIA360" title="Salir">
        <Icon name="logout" size={19} />
        <span>Salir</span>
      </button>
    </form>}
  </aside>{expanded && <button className="sidebar-backdrop" type="button" aria-label="Contraer panel" onClick={closeMenu} />}
  <nav className="account-bottom-nav" aria-label="Navegación de mi criadero">{mobileItems.map(item => <Link key={item.href} href={item.href} aria-current={item.active ? "page" : undefined} onClick={() => setExpanded(false)}><Icon name={item.icon} size={23} /><span>{item.label}</span></Link>)}</nav>
  </>;
}


