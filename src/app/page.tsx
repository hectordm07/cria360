import Link from "next/link";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { featuredAnimals } from "@/lib/demo-data";

const modules = [
  { icon: "tag" as const, name: "CRIA360 ID", text: "Una placa QR o NFC que abre la ficha digital del animal en segundos." },
  { icon: "tree" as const, name: "Genealogía", text: "Padres, abuelos y líneas de crianza conectados en un historial claro." },
  { icon: "health" as const, name: "Salud", text: "Vacunas, controles, restricciones y documentos en un solo lugar." },
  { icon: "store" as const, name: "CRIA360 Market", text: "Criaderos y animales con identidad, reputación e información verificable." },
];

const species = ["Aves", "Porcinos", "Vacunos", "Ovinos", "Caprinos", "Equinos", "Otros"];

export default function Home() {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="spark" /> Tecnología para criadores</span>
          <h1>La identidad digital de <em>cada generación.</em></h1>
          <p className="hero-lead">Registra el origen, genealogía, salud y trayectoria de cada animal. Conecta tu criadero con compradores que valoran la trazabilidad.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/registro">Crear mi criadero <span>→</span></Link>
            <Link className="button button-secondary" href="/marketplace">Explorar marketplace</Link>
          </div>
          <p className="microcopy"><Icon name="check" /> Empieza gratis · No requiere tarjeta</p>
        </div>
        <div className="hero-visual" aria-label="Ficha digital de animal CRIA360">
          <div className="sun-orb" />
          <div className="profile-card">
            <div className="profile-photo animal-gradient cattle"><span className="species-mark">V</span><span className="verified-chip"><Icon name="verified" /> Verificado</span></div>
            <div className="profile-body">
              <div className="profile-title"><div><span className="mini-label">CRIA360 ID</span><h3>Magnus 428</h3></div><span className="id-badge">PE-00428</span></div>
              <div className="profile-facts"><span><small>Especie</small>Vacuno</span><span><small>Raza</small>Brown Swiss</span><span><small>Nacimiento</small>14 Mar 2025</span></div>
              <div className="lineage-line"><Icon name="tree" /><span><small>Padre</small>Artemis 091</span><span><small>Madre</small>Luna 214</span></div>
            </div>
          </div>
          <div className="qr-float"><div className="qr-pattern" aria-hidden="true" /><span><strong>Escanea su placa</strong><small>Ficha pública protegida</small></span></div>
        </div>
      </section>

      <section className="trust-strip"><div className="section-shell trust-inner"><p>Creado para criaderos de</p><div className="species-list">{species.map((item) => <span key={item}>{item}</span>)}</div></div></section>

      <section className="section-shell section-block">
        <div className="section-heading centered"><span className="eyebrow">Todo el ciclo en una plataforma</span><h2>Del nacimiento a la próxima generación</h2><p>Información útil para criar mejor, demostrar procedencia y comercializar con confianza.</p></div>
        <div className="module-grid">{modules.map((module, index) => <article className="module-card" key={module.name}><span className="module-number">0{index + 1}</span><span className="icon-box"><Icon name={module.icon} /></span><h3>{module.name}</h3><p>{module.text}</p></article>)}</div>
      </section>

      <section className="how-section"><div className="section-shell split-section">
        <div><span className="eyebrow light">Simple desde el primer animal</span><h2>Una placa pequeña.<br />Una historia completa.</h2><p>El QR puede leerse con la cámara de cualquier celular. Tú decides qué información es pública y cuál permanece privada.</p><Link className="text-link light-link" href="/animales/CRIA-PE-00428">Ver una ficha de ejemplo <span>→</span></Link></div>
        <ol className="steps-list"><li><span>1</span><div><strong>Registra</strong><p>Crea la identidad del animal y conecta a sus padres.</p></div></li><li><span>2</span><div><strong>Coloca la placa</strong><p>Asigna un QR único, resistente y difícil de duplicar.</p></div></li><li><span>3</span><div><strong>Actualiza su historia</strong><p>Salud, producción, cambios de dueño y documentos.</p></div></li></ol>
      </div></section>

      <section className="section-shell section-block">
        <div className="section-heading row-heading"><div><span className="eyebrow">CRIA360 Market</span><h2>Animales con historia, no solo anuncios</h2></div><Link className="text-link" href="/marketplace">Ver todos <span>→</span></Link></div>
        <div className="animal-grid">{featuredAnimals.slice(0, 3).map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div>
      </section>

      <section className="section-shell cta-panel"><div><span className="eyebrow light">Tu criadero merece ser visible</span><h2>Empieza a construir una historia que genere confianza.</h2></div><div className="cta-actions"><Link className="button button-white" href="/registro">Crear cuenta gratis</Link><Link className="button button-ghost" href="/planes">Ver planes</Link></div></section>
    </>
  );
}
