export const proyectoAprobado = {
  slug: "solucion-qa",
  ficha: {
    revision: "aprobado",
    nombre: "Solución QA",
    resumen: "Resumen de catálogo QA",
    estado: "Estado verificado QA",
  },
  pagina: {
    revision: "aprobado",
    entradilla: "Presentación de ficha QA",
    destacado: "Presentación de portada QA",
    problema: "Problema QA",
    contexto: "Contexto QA",
    proposito: "Propósito QA",
    solucion: "Solución documentada QA",
    participacion: "Participación documentada QA",
    evidencias: ["archivo-aprobado-qa"],
  },
};

export const evidenciaAprobada = {
  revision: "aprobado",
  id: "archivo-aprobado-qa",
  titulo: "Evidencia QA",
  tipo: "Decisión documentada",
  fuente: "Fuente QA",
  autoria: "Autoría QA",
  afirmacion: "Participación documentada QA",
  recurso: { archivo: "archivo-aprobado-qa.txt" },
};

export const casoAprobado = {
  revision: "aprobado",
  slug: "caso-qa",
  proyecto: proyectoAprobado.slug,
  titulo: "Caso QA",
  resumen: "Resumen QA",
  contexto: "Contexto QA",
  alcance: "Alcance QA",
  decisiones: "Decisiones QA",
  trabajo: "Trabajo QA",
  validacion: "Validación QA",
  resultadosYLimites: "Resultados QA",
  evidencias: [evidenciaAprobada.id],
};

export const perfilAprobado = {
  revision: "aprobado",
  nombre: "Perfil QA",
  presentacion: "Presentación QA",
  propuesta: "Propuesta QA.",
  oportunidades: "Oportunidades QA.",
  formacion: [],
  trayectoria: [],
  retrato: { revision: "aprobado", archivo: "retrato-qa.png", alt: "Retrato QA" },
};

export function registroFixture() {
  return structuredClone({
    proyectos: [proyectoAprobado],
    evidencias: [evidenciaAprobada],
    casos: [casoAprobado],
    casoDestacado: casoAprobado.slug,
  });
}
