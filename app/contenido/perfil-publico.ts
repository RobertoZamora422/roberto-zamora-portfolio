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
  descripcionInicio: "En RFM CORE analicé el proceso comercial, definí las reglas para pasar de una consulta a un contrato e implementé y probé el flujo.",
  sobreMi: [
    "Me interesa la conexión entre las necesidades de un negocio y las soluciones tecnológicas que permiten atenderlas. Mi enfoque combina la comprensión de procesos, el análisis de requisitos, la definición de reglas de negocio y la validación de soluciones.",
    "En RFM CORE llevé este enfoque a la práctica desarrollando un sistema web para Rancho Flor María. Analicé su proceso comercial, estructuré el recorrido desde las consultas hasta los contratos y documenté nueve reglas de negocio vinculadas con decisiones técnicas y pruebas verificables. Mi participación abarcó el análisis, diseño, implementación, documentación y despliegue del sistema.",
    `Estudio ${estudios}. Me interesa especialmente trabajar en la intersección entre tecnología, procesos y personas, donde comprender un problema, comunicar decisiones y evaluar una solución es tan importante como desarrollarla.`,
    "Este portafolio reúne proyectos, decisiones y evidencias que permiten conocer no solo lo que he construido, sino también cómo abordo los problemas y fundamento mi trabajo.",
  ],
  formacion: [formacion],
  correo: "robertozamora421@gmail.com",
  enlaces: [
    { titulo: "GitHub", url: "https://github.com/RobertoZamora422" },
    { titulo: "LinkedIn", url: "https://www.linkedin.com/in/roberto-zamora-alcivar" },
  ],
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
