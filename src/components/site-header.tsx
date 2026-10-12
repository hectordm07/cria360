"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AccountLink } from "./account-link";
import { Icon } from "./icon";
import { Logo } from "./logo";
import { animalCategories } from "@/lib/category-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const animalsMenu = useRef<HTMLDetailsElement>(null);
  return <header className="site-header" onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      menuButton.current?.focus();
    }
    if (event.key === "Escape" && animalsMenu.current?.open) {
      animalsMenu.current.open = false;
      if (!open) animalsMenu.current.querySelector("summary")?.focus();
    }
  }}><div className="section-shell header-inner">
    <Logo />
    <nav id="site-navigation" className={open ? "site-navigation is-open" : "site-navigation"} aria-label="Navegación principal" onClick={event => { if ((event.target as Element).closest("a")) { setOpen(false); if (animalsMenu.current) animalsMenu.current.open = false; } }}><Link href="/#gestion">Para granjas</Link><Link href="/placas-inteligentes">Placas QR + NFC</Link><details ref={animalsMenu} className="navigation-animals"><summary>Animales <span aria-hidden="true">⌄</span></summary><div className="navigation-animal-types"><Link href="/marketplace">Ver todo el Marketplace</Link>{animalCategories.map(category => <Link key={category.slug} href={`/marketplace?especie=${category.slug}`}>{category.shortName}</Link>)}</div></details><Link href="/blog">Guía de crianza</Link><Link href="/planes">Planes</Link><Link href="/instalar">Instalar app</Link><Link className="mobile-menu-account" href="/ingresar" target="_blank" rel="noopener noreferrer">Ingresar a mi cuenta</Link></nav>
    <div className="header-actions"><AccountLink /><Link className="button button-small button-primary" href="/registro">Empezar gratis</Link></div>
    <button ref={menuButton} className="site-menu-toggle" type="button" aria-controls="site-navigation" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
  </div></header>;
}


