export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "alimentacion-de-pollos-segun-su-etapa",
    title: "Alimentación de pollos según su etapa de crecimiento",
    description: "Principios para organizar la alimentación de pollitos, aves en crecimiento y reproductores sin improvisar la dieta.",
    category: "Nutrición avícola",
    readingTime: "7 min",
    publishedAt: "2026-09-30",
    updatedAt: "2026-09-30",
    image: "https://images.unsplash.com/photo-1685032236350-3873c9035ee0?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Aves de crianza en un ambiente abierto",
    sections: [
      {
        heading: "La dieta cambia con la edad y el objetivo",
        paragraphs: [
          "Un pollito en desarrollo, un ave adulta y un reproductor no tienen las mismas necesidades. La energía, proteína, minerales y presentación del alimento deben ajustarse a la etapa, la genética, el ambiente y el objetivo productivo.",
          "Antes de cambiar una ración conviene registrar edad, peso, consumo, condición corporal y cualquier señal sanitaria. Ese historial permite detectar si el problema está en la dieta, el acceso al agua, el alojamiento o la salud del lote.",
        ],
        bullets: [
          "Inicio: priorizar alimento formulado para crecimiento temprano y agua limpia disponible permanentemente.",
          "Crecimiento: ajustar la ración al peso y evitar cambios bruscos de alimento.",
          "Adultos y reproductores: controlar condición corporal y usar una fórmula indicada para su función.",
        ],
      },
      {
        heading: "Agua, almacenamiento y observación diaria",
        paragraphs: [
          "El agua forma parte de la nutrición. Bebederos sucios, caudal insuficiente o agua caliente reducen el consumo y pueden afectar el comportamiento y la ganancia de peso.",
          "Conserva el alimento en un lugar seco, ventilado y protegido de roedores. Descarta productos con humedad, hongos, olor extraño o fecha vencida. Llevar el lote y la fecha de apertura ayuda a investigar cualquier problema.",
        ],
      },
      {
        heading: "Cuándo pedir una evaluación profesional",
        paragraphs: [
          "Pérdida de peso, diarrea persistente, caída del consumo, mortalidad o cambios repentinos requieren la evaluación de un médico veterinario o profesional en nutrición animal. Una guía general no reemplaza una fórmula calculada para el criadero.",
        ],
      },
    ],
  },
  {
    slug: "nutricion-del-ganado-vacuno-guia-practica",
    title: "Nutrición del ganado vacuno: una guía práctica para el criador",
    description: "Cómo ordenar forrajes, agua, minerales y registros para tomar mejores decisiones en la alimentación del ganado.",
    category: "Ganado vacuno",
    readingTime: "8 min",
    publishedAt: "2026-09-30",
    updatedAt: "2026-09-30",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Ganado vacuno alimentándose en pastoreo",
    sections: [
      {
        heading: "Comienza por conocer el forraje disponible",
        paragraphs: [
          "La base de muchas dietas bovinas es el forraje, pero su calidad cambia con la especie vegetal, la madurez, el clima y la conservación. Analizarlo permite estimar qué aporta y qué necesita complementarse.",
          "La ración debe considerar peso, edad, etapa reproductiva, producción y condición corporal. Copiar la dieta de otro predio puede generar excesos, deficiencias o un gasto que no se convierte en mejor desempeño.",
        ],
      },
      {
        heading: "Cuatro controles simples que sí generan información",
        paragraphs: ["Un registro constante es más útil que una medición aislada. CRIA360 puede asociar esos controles a la identidad de cada animal o lote."],
        bullets: [
          "Disponibilidad y limpieza del agua.",
          "Consumo estimado y cambios de alimento.",
          "Peso o condición corporal en fechas comparables.",
          "Minerales, suplementos y tratamientos registrados con responsable.",
        ],
      },
      {
        heading: "Ajustes con respaldo profesional",
        paragraphs: [
          "Un médico veterinario o zootecnista puede interpretar el análisis del alimento, revisar la salud del hato y formular una dieta adecuada. En animales con enfermedad, gestación, lactancia o alta exigencia productiva, esa evaluación es especialmente importante.",
        ],
      },
    ],
  },
  {
    slug: "como-verificar-un-animal-antes-de-comprar",
    title: "Qué verificar antes de comprar un animal de un criadero",
    description: "Una lista clara para revisar identidad, procedencia, salud, vendedor y condiciones de la transferencia.",
    category: "Compra responsable",
    readingTime: "6 min",
    publishedAt: "2026-09-30",
    updatedAt: "2026-09-30",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Ejemplar equino observado antes de una compra",
    sections: [
      {
        heading: "La foto y el precio no son suficientes",
        paragraphs: [
          "Una publicación responsable debe permitir identificar al animal y al criadero. Solicita un código único, fotografías actuales, fecha de nacimiento estimada o registrada, sexo, raza o tipo racial, ubicación y responsable de la publicación.",
          "Cuando la genealogía es importante, revisa que el padre y la madre estén identificados y que los documentos coincidan con el ejemplar ofrecido.",
        ],
      },
      {
        heading: "Información sanitaria y revisión presencial",
        paragraphs: ["La ficha digital ayuda a ordenar la información, pero no reemplaza una revisión física ni los documentos exigidos por la autoridad competente."],
        bullets: [
          "Vacunas, desparasitación y controles con fecha y responsable.",
          "Restricciones sanitarias, reproductivas o de traslado.",
          "Condición corporal y comportamiento observados directamente.",
          "Comprobante, condiciones de entrega y registro de la transferencia.",
        ],
      },
      {
        heading: "Diferencia entre declarado y verificado",
        paragraphs: [
          "CRIA360 distingue la información declarada por el criador de la validada por un profesional u organización. Esa diferencia debe verse antes del contacto para que el comprador sepa qué necesita confirmar.",
        ],
      },
    ],
  },
  {
    slug: "placa-qr-para-animales-como-funciona",
    title: "Placa QR para animales: cómo funciona y qué datos protege",
    description: "Conoce cómo una placa inteligente conecta la identidad, salud, genealogía y responsable de cada animal.",
    category: "Tecnología para criadores",
    readingTime: "5 min",
    publishedAt: "2026-09-30",
    updatedAt: "2026-09-30",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Animal de criadero identificado para su control",
    sections: [
      {
        heading: "Un código que abre una ficha controlada",
        paragraphs: [
          "La placa CRIA360 contiene un QR único. Al escanearlo con la cámara de un celular se abre la ficha pública del animal, sin obligar al visitante a instalar una aplicación.",
          "El criador decide qué campos son públicos. La información personal, documentos privados y datos internos del criadero permanecen restringidos a los usuarios autorizados.",
        ],
      },
      {
        heading: "Qué puede mostrar la ficha",
        paragraphs: ["La placa no guarda la información dentro del QR; conecta con el registro actualizado del animal."],
        bullets: [
          "Código, nombre, especie, sexo, raza y fotografía.",
          "Padre, madre y genealogía disponible.",
          "Estado sanitario resumido y restricciones declaradas.",
          "Criadero responsable y canal de contacto protegido.",
        ],
      },
      {
        heading: "Identidad durante toda la vida",
        paragraphs: [
          "Si el animal cambia de propietario, su código puede conservar el historial autorizado y registrar la transferencia. Esto ayuda a evitar fichas duplicadas y mantiene la trazabilidad entre generaciones.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
