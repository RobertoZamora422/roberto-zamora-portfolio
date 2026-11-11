import type { Evidencia, Proyecto, Registro } from "../contenido/modelo.ts";

// Textos de revisión local derivados de la definición y del diseño aprobado.
// Las aprobaciones de este registro se aplican solo a la vista local.
const proyectosRevision: readonly Proyecto[] = [
  {
    slug: "rfm-core",
    ficha: {
      revision: "aprobado",
      nombre: "RFM CORE",
      resumen: "Sistema de gestión comercial y operativa de un negocio real.",
      estado: "Ficha pendiente de revisión",
    },
  },
  {
    slug: "claridez",
    ficha: {
      revision: "aprobado",
      nombre: "Claridez",
      resumen: "Plataforma SaaS B2B para gestión de salones de eventos.",
      estado: "Ficha pendiente de revisión",
    },
  },
  {
    slug: "portafolio-web",
    ficha: {
      revision: "aprobado",
      nombre: "Portafolio web",
      resumen: "Sitio profesional para presentar proyectos y aportes verificables.",
      estado: "Desarrollo en curso",
    },
    pagina: {
      revision: "aprobado",
      destacado: "Un sitio para que reclutadores y equipos técnicos puedan examinar aportes concretos.",
      entradilla: "Portafolio profesional de Ingeniería en Software con recorridos para explorar soluciones y revisar aportes concretos.",
      problema: "Quien llega desde un catálogo necesita entender la solución completa. Quien abre un caso compartido necesita identificar el aporte y su evidencia.",
      contexto: "El sitio se dirige a reclutadores y equipos técnicos que evalúan perfiles para pasantías y posiciones junior.",
      proposito: "Facilitar la evaluación del perfil y el acceso al CV y al contacto.",
      solucion: "El catálogo da acceso a las páginas de proyecto. Los casos profundizan en decisiones y evidencias. El CV y el contacto tienen accesos directos en la navegación.",
      participacion: "Aprobé la dirección visual y revisé la base técnica, la navegación y la estrategia de prerenderizado.",
      tecnologias: ["React", "TypeScript", "Vite"],
      evidencias: ["decision-portafolio-revision"],
    },
  },
];

const evidenciaRevision: Evidencia = {
  revision: "aprobado",
  id: "decision-portafolio-revision",
  titulo: "Arquitectura de información y revisión del portafolio",
  tipo: "Decisión documentada",
  fuente: "Arquitectura de información, cierre de diseño UX/UI y revisión del incremento 1",
  autoria: "Equipo del portafolio",
  afirmacion: "El catálogo, las fichas y los casos tienen funciones distintas y la dirección visual fue aprobada.",
  recurso: { archivo: "pruebas/decision-portafolio-revision.txt" },
};

export function registroParaRevision(publico: Registro): Registro {
  const casos = publico.proyectos.some(({ slug }) => slug === "portafolio-web")
    ? []
    : [{
        revision: "aprobado" as const,
        slug: "separar-proyecto-y-caso",
        proyecto: "portafolio-web",
        titulo: "Separar el proyecto del caso de estudio",
        resumen: "Decisión de arquitectura de información documentada en la fase de definición.",
        contexto: "El catálogo y los casos compartidos son puntos de entrada diferentes.",
        alcance: "Definir el alcance editorial de cada página.",
        decisiones: "Dar URLs propias a la solución completa y a los aportes concretos.",
        trabajo: "Documentar las rutas, los contenidos mínimos y los recorridos.",
        validacion: "La revisión visual cubrió escritorio, 390 px y 320 px.",
        resultadosYLimites: "La relación entre las páginas quedó documentada en la fase de definición.",
        evidencias: [evidenciaRevision.id],
      }];

  return {
    ...publico,
    proyectos: [
      ...publico.proyectos,
      ...proyectosRevision.filter(({ slug }) => !publico.proyectos.some((proyecto) => proyecto.slug === slug)),
    ],
    casos: [...publico.casos, ...casos],
    evidencias: [...publico.evidencias, ...(casos.length ? [evidenciaRevision] : [])],
    casoDestacado: publico.casoDestacado ?? casos[0]?.slug,
  };
}
