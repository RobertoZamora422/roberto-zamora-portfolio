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
  portada: {
    area: "Ingeniería de Software",
    titular: ["Del análisis", "a la", "solución."],
    estudios: "Estudiante de 8vo semestre de Ingeniería de Software",
    introduccion: "con experiencia práctica en el entorno empresarial e interés en el análisis funcional, el desarrollo de soluciones tecnológicas y la calidad del software.",
    enfoque: "Me interesa comprender las necesidades de las personas y los negocios, organizar ideas y convertir problemas en soluciones útiles, trabajando en la conexión entre tecnología, procesos y personas.",
    ubicacion: "Quito · Ecuador",
    ejes: ["Comprensión del negocio", "Soluciones tecnológicas", "Personas y colaboración"],
    capacidades: [
      { titulo: "Análisis de necesidades", descripcion: "Experiencia atendiendo requerimientos comerciales y estructurando procesos, complementada con definición de reglas y análisis funcional." },
      { titulo: "Soluciones tecnológicas", descripcion: "Participación en el diseño, implementación y documentación de aplicaciones que responden a necesidades concretas." },
      { titulo: "Calidad y verificación", descripcion: "Preparación de escenarios funcionales, revisión de condiciones esperadas y documentación de resultados y límites de las pruebas." },
      { titulo: "Comunicación y organización", descripcion: "Trabajo con clientes, propuestas comerciales, actividades de marketing y planificación de servicios, con atención a las personas." },
    ],
    trayectoria: [
      "Estudio Ingeniería de Software en la Universidad de Las Américas (UDLA). Mi formación se complementa con mi participación en Rancho Flor María, donde he trabajado en iniciativas comerciales, comunicación con clientes, estructuración de servicios y digitalización de procesos.",
      "Esta combinación ha influido en mi manera de entender el software como una herramienta al servicio de necesidades concretas. Quiero seguir aprendiendo, comunicar ideas y aportar en equipos que construyen soluciones con criterio.",
    ],
    datos: [
      { titulo: "Formación", descripcion: "Ingeniería de Software · UDLA" },
      { titulo: "Etapa", descripcion: "8vo semestre · En curso" },
      { titulo: "Intereses", descripcion: "Análisis funcional · Calidad · Soluciones tecnológicas" },
      { titulo: "Perspectiva adicional", descripcion: "Experiencia en procesos y atención comercial" },
    ],
  },
  cvPdf: { revision: "aprobado", archivo: "perfil/roberto-zamora-cv.pdf" },
  retrato: {
    revision: "aprobado",
    archivo: "perfil/roberto-zamora.webp",
    alt: "Retrato profesional de Roberto Zamora",
  },
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
