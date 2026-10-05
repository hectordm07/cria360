import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link className={`brand ${inverse ? "brand-inverse" : ""}`} href="/" aria-label="CRIA360, inicio"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 4 39 12v15c0 9-6 14-15 17C15 41 9 36 9 27V12L24 4Z"/><path d="M16 27c7-1 11-5 16-11-1 9-5 15-14 17"/><path d="M18 32c-2-6 0-11 6-14"/></svg></span><span className="brand-word">CRIA<span>360</span><small>Identidad que hace crecer</small></span></Link>;
}
