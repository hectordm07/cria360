import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Crear cuenta", description: "Registra tu criadero en CRIA360." };

export default function RegisterPage() {
  return <section className="register-page"><div className="register-copy"><span className="eyebrow light">Únete a CRIA360</span><h1>Tu criadero,<br />listo para crecer.</h1><p>Crea tu identidad digital y registra tus primeros cinco animales sin costo.</p><ul><li><Icon name="check" /> Fichas digitales con QR</li><li><Icon name="check" /> Genealogía y salud</li><li><Icon name="check" /> Perfil público del criadero</li></ul></div><div className="register-form"><span className="plan-pill">Plan Gratis</span><h2>Crea tu cuenta</h2><p>Primero cuéntanos quién eres.</p><form><label>Nombre completo<input placeholder="Tu nombre y apellido" /></label><label>Correo electrónico<input type="email" placeholder="nombre@correo.com" /></label><label>Nombre del criadero<input placeholder="Ej. Hacienda El Roble" /></label><label>Especie principal<select defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Aves</option><option>Porcinos</option><option>Vacunos</option><option>Ovinos</option><option>Caprinos</option><option>Equinos</option><option>Otro</option></select></label><button className="button button-primary full-button" type="button">Continuar</button></form><small>Al continuar aceptas los términos y la política de privacidad.</small><Link href="/planes">Comparar planes</Link></div></section>;
}
