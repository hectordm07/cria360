"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountLink } from "./account-link";
import { Icon } from "./icon";

const items = [
  { href: "/", label: "Inicio", icon: "store" as const },
  { href: "/marketplace", label: "Comprar", icon: "spark" as const },
  { href: "/cuenta", label: "Mi criadero", icon: "health" as const, primary: true },
  { href: "/instalar", label: "Instalar", icon: "verified" as const },
];

export function MobileAppNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/marketplace");
    router.prefetch("/instalar");
    router.prefetch("/ingresar");
  }, [router]);

  return (
    <nav className="mobile-app-nav" aria-label="Navegación de la aplicación">
      {items.map((item) => (
        <Link
          className={item.primary ? "primary" : ""}
          href={item.href}
          key={item.href}
          prefetch
          aria-current={pathname === item.href ? "page" : undefined}
        >
          <span className="mobile-nav-icon"><Icon name={item.icon} size={21} /></span>
          <span>{item.label}</span>
        </Link>
      ))}
      <AccountLink mobile />
    </nav>
  );
}

