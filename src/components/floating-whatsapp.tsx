export function FloatingWhatsApp({ number }: { number?: string | null }) {
  const clean = (number ?? "").replace(/\D/g, "");
  if (!clean) return null;

  const message = encodeURIComponent("Hola CRIA360, quisiera recibir información.");
  const href = `https://wa.me/${clean}?text=${message}`;

  return (
    <a
      className="floating-whatsapp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a CRIA360 por WhatsApp"
      data-analytics-cta="whatsapp"
    >
      <span aria-hidden="true">WA</span>
      <strong>WhatsApp</strong>
    </a>
  );
}
