import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="CRIA360, inicio"><span className="brand-mark"><LogoMark inverse={inverse} /></span><span className="brand-word">CRIA<span>360</span><small>Tu granja, conectada.</small></span></Link>;
}
