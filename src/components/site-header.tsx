"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AccountLink } from "./account-link";
import { Icon } from "./icon";
import { Logo } from "./logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return <header className="site-header" onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      menuButton.current?.focus();
    }
  }}><div className="section-shell header-inner">
    <Logo />
    <nav id="site-navigation" className={open ? "site-navigation is-open" : "site-navigation"} aria-label="Navegación principal" onClick={() => setOpen(false)}><Link href="/#gestion">Para granjas</Link><Link href="/placas-inteligentes">Placas QR + NFC</Link><Link href="/marketplace">Animales</Link><Link href="/blog">Guía de crianza</Link><Link href="/planes">Planes</Link><Link className="mobile-menu-account" href="/ingresar">Ingresar a mi cuenta</Link></nav>
    <div className="header-actions"><AccountLink /><Link className="button button-small button-primary" href="/registro">Empezar gratis</Link></div>
    <button ref={menuButton} className="site-menu-toggle" type="button" aria-controls="site-navigation" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
  </div></header>;
}

