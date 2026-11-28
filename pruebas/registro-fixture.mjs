const proyectoAprobado = {
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
    contexto: ["Contexto QA"],
    solucion: ["Solución documentada QA"],
    participacion: ["Participación documentada QA"],
    evidencias: ["archivo-aprobado-qa"],
  },
};

const evidenciaAprobada = {
  revision: "aprobado",
  id: "archivo-aprobado-qa",
  titulo: "Evidencia QA",
  tipo: "Decisión documentada",
  fuente: "Fuente QA",
  autoria: "Autoría QA",
  afirmacion: "Participación documentada QA",
  recurso: { archivo: "archivo-aprobado-qa.txt" },
};

const casoAprobado = {
  revision: "aprobado",
  proyecto: proyectoAprobado.slug,
  titulo: "Caso QA",
  resumen: "Resumen QA",
  pregunta: "¿Cómo se valida el proceso QA?",
  introduccion: "Introducción QA",
  resumenVisual: [{ titulo: "Desafío QA", descripcion: "Síntesis QA" }],
  contexto: ["Contexto QA"],
  alcance: ["Alcance QA"],
  decisiones: [{ titulo: "Decisión QA", parrafos: ["Criterio QA"] }],
  trazabilidad: ["Trazabilidad QA"],
  validacion: {
    introduccion: "Comprobación pendiente QA",
    escenarios: [{ titulo: "Escenario QA", descripcion: "Condición QA" }],
    ejecucion: "Ejecución QA",
    resultados: [{ titulo: "Resultado QA", descripcion: "Verificación QA" }],
    fuente: "Informe QA",
    limites: ["Medición pendiente QA"],
  },
  evidencias: [evidenciaAprobada.id],
};

export const perfilAprobado = {
  revision: "aprobado",
  nombre: "Perfil QA",
  portada: {
    area: "Área QA", titular: ["Titular", "de", "prueba"], estudios: "Estudios QA",
    introduccion: "Introducción QA", enfoque: ["Enfoque QA"], ubicacion: "Lugar QA",
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
