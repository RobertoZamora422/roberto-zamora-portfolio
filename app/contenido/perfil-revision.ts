import type { Perfil } from "./modelo.ts";

export const perfilRevision: Perfil = {
  revision: "borrador",
  nombre: "Roberto Zamora",
  presentacion: "Estudiante de Ingeniería en Software",
  propuesta: "Comprender problemas. Diseñar soluciones. Generar valor.",
  oportunidades: "Busco una pasantía o una posición junior en tecnología.",
  formacion: [{ programa: "Ingeniería en Software" }],
  intereses: [
    { titulo: "Tecnología y procesos", descripcion: "Entender cómo trabaja un equipo y cómo puede ayudarle una herramienta digital." },
    { titulo: "Requisitos y documentación", descripcion: "Explicar reglas y decisiones de forma que otras personas puedan revisarlas." },
    { titulo: "Validación funcional", descripcion: "Definir escenarios para comprobar si una solución responde al problema." },
  ],
  trayectoria: [
    {
      titulo: "Análisis de requisitos y procesos",
      descripcion: "Modelé el flujo comercial de RFM CORE y documenté nueve reglas de negocio, desde la solicitud hasta la formalización del contrato.",
      evidencias: ["rfm-e01-proceso", "rfm-e02-trazabilidad"],
    },
    {
      titulo: "Diseño y documentación de decisiones",
      descripcion: "Diseñé e implementé el flujo comercial de RFM CORE. Documenté las decisiones sobre estados, conversión a contrato y uso de las condiciones de la oferta.",
      evidencias: ["rfm-e03-decisiones"],
    },
    {
      titulo: "Validación funcional",
      descripcion: "Preparé escenarios de prueba para comprobar el rechazo de una conversión sin paquete y el uso de las condiciones históricas de la oferta.",
      evidencias: ["rfm-e04-verificacion"],
    },
  ],
  casos: ["del-interes-comercial-al-contrato"],
};
