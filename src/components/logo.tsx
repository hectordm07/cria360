import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="CRIA360, inicio"><span className="brand-mark"><span>C</span></span><span className="brand-word">CRIA<span>360</span><small>Identidad animal</small></span></Link>;
}
