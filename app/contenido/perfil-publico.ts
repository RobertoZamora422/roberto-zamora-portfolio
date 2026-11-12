import type { Perfil } from "./modelo.ts";

const formacion = {
  programa: "Ingeniería en Software",
  institucion: "Universidad de Las Américas (UDLA)",
  estado: "En curso",
};
const estudios = `${formacion.programa} en la ${formacion.institucion}`;

export const perfilPublico: Perfil = {
  revision: "aprobado",
  nombre: "Roberto Zamora",
  presentacion: "Tecnología · Procesos · Análisis funcional",
  propuesta: "Comprender problemas. Diseñar soluciones. Generar valor.",
  oportunidades: "Busco una pasantía o una posición junior en tecnología.",
  sobreMi: [
    "Me interesa la conexión entre las necesidades de un negocio y las soluciones tecnológicas que permiten atenderlas. Mi enfoque combina la comprensión de procesos, el análisis de requisitos, la definición de reglas de negocio y la validación de soluciones.",
    "En RFM CORE llevé este enfoque a la práctica desarrollando un sistema web para Rancho Flor María. Analicé su proceso comercial, estructuré el recorrido desde las consultas hasta los contratos y documenté nueve reglas de negocio vinculadas con decisiones técnicas y pruebas verificables. Mi participación abarcó el análisis, diseño, implementación, documentación y despliegue del sistema.",
    `Estudio ${estudios}. Me interesa especialmente trabajar en la intersección entre tecnología, procesos y personas, donde comprender un problema, comunicar decisiones y evaluar una solución es tan importante como desarrollarla.`,
    "Este portafolio reúne proyectos, decisiones y evidencias que permiten conocer no solo lo que he construido, sino también cómo abordo los problemas y fundamento mi trabajo.",
  ],
  resumenProfesional: [
    "Enfoque en el análisis de procesos, la definición de requisitos y el diseño y validación de soluciones tecnológicas.",
    "Desarrollé RFM CORE, un sistema web para un negocio real, abordando el análisis funcional, las reglas de negocio, la implementación y las pruebas. El proyecto cuenta con documentación y evidencias técnicas verificables.",
    `Estudiante de ${estudios}, con interés en funciones que conecten tecnología, procesos y personas.`,
  ],
  formacion: [formacion],
  correo: "robertozamora421@gmail.com",
  intereses: [
    { titulo: "Tecnología y procesos", descripcion: "Entender cómo trabaja un equipo y cómo puede ayudarle una herramienta digital." },
    { titulo: "Requisitos y documentación", descripcion: "Explicar reglas y decisiones de forma que otras personas puedan revisarlas." },
    { titulo: "Validación funcional", descripcion: "Definir escenarios para comprobar si una solución responde al problema." },
  ],
  trayectoria: [
    {
      titulo: "Análisis de requisitos y procesos",
      descripcion: "Distinguí las tareas de atención comercial del registro en el sistema. Vinculé las reglas con el código y las pruebas que las respaldan.",
      evidencias: ["rfm-e01-proceso", "rfm-e02-trazabilidad"],
    },
    {
      titulo: "Diseño y documentación de decisiones",
      descripcion: "Separé la cotización del contrato y reservé la conversión para cotizaciones confirmadas. Documenté cuándo se pueden reutilizar las condiciones de una oferta.",
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
