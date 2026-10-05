import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="CRIA360, inicio"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path className="logo-plate" d="M24 3 40 12v24l-16 9L8 36V12L24 3Z"/><circle className="logo-hole" cx="24" cy="9" r="2.4"/><path className="logo-bird" d="M17 29c0-6 3.8-10.3 9-10.3 3.9 0 7 2.5 7 6.2 0 .7-.1 1.4-.3 2.1l4.3 2.3-5.5 2.1c-1.7 2.4-4.4 3.8-7.8 3.8-2.8 0-5.1-.8-6.7-2.2 1.4-.3 2.5-1.1 3.1-2.2-1.2 0-2.2-.7-3.1-1.8Z"/><circle className="logo-eye" cx="28.3" cy="24" r="1.1"/><path className="logo-comb" d="M21.2 19c-.1-2 1-3.5 2.6-4.2.6.9.9 1.9.7 2.9.8-1.2 2-1.8 3.4-1.8.1 1.2-.3 2.3-1.2 3.2"/></svg></span><span className="brand-word">CRIA<span>360</span><small>Identidad que hace crecer</small></span></Link>;
}
