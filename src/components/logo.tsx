import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="CRIA360, inicio"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path className="logo-plate" d="M24 3 40 12v24l-16 9L8 36V12L24 3Z"/><circle className="logo-hole" cx="24" cy="9" r="2.2"/><text className="logo-monogram" x="24" y="30" textAnchor="middle">C360</text></svg></span><span className="brand-word">CRIA<span>360</span><small>Identidad que hace crecer</small></span></Link>;
}
