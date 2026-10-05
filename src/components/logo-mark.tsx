/** Granja conectada: a barn embraced by a 360-degree traceability orbit. */
export function LogoMark({ inverse = false }: { inverse?: boolean }) {
  const green = inverse ? "#faf8f1" : "#173f35";
  return <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
    <path d="M9 43A39 39 0 0 1 57 10M16 73A39 39 0 0 0 60 85" stroke={green} strokeWidth="7" />
    <path d="M77 23A39 39 0 0 1 82 69" stroke="#cfa343" strokeWidth="7" />
    <circle cx="70" cy="16" r="7" fill={green} />
    <circle cx="10" cy="57" r="7" fill={green} />
    <circle cx="73" cy="79" r="7" fill="#cfa343" />
    <path d="M23 48 48 28 73 48" stroke={green} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M29 46V76H42V57H54V76H67V46L48 31 29 46Z" fill={green} />
    <path d="M44 41H52V49H44Z" fill={inverse ? "#173f35" : "#faf8f1"} />
  </svg>;
}
