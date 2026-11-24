export const proyectoAprobado = {
  slug: "solucion-qa",
  revision: "aprobado",
  nombre: "Solución QA",
  estado: "Estado verificado QA",
  categoria: "Sistema QA",
  descripcion: "Presentación de portada QA",
  repositorio: "https://example.org/proyecto",
  visual: "conceptual",
  pagina: {
    revision: "aprobado",
    entradilla: "Presentación de ficha QA",
    problema: "Problema QA",
    contexto: "Contexto QA",
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
  portada: {
    area: "Área QA", titular: ["Titular", "de", "prueba"], estudios: "Estudios QA",
    introduccion: "Introducción QA", enfoque: "Enfoque QA", ubicacion: "Lugar QA",
    ejes: [], capacidades: [], trayectoria: [], datos: [],
  },
  retrato: { revision: "aprobado", archivo: "retrato-qa.png", alt: "Retrato QA" },
};

export function registroFixture() {
  return structuredClone({
    proyectos: [proyectoAprobado],
    evidencias: [evidenciaAprobada],
    casos: [casoAprobado],
  });
}
