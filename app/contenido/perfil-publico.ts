import type { Perfil } from "./modelo.ts";

export const perfilPublico: Perfil = {
  revision: "aprobado",
  nombre: "Roberto Zamora",
  portada: {
    area: "Ingeniería de Software",
    nombreCompleto: "Roberto David Zamora Alcívar",
    titular: ["Del análisis", "a la", "solución."],
    estudios: "Estudiante de 8vo semestre de Ingeniería de Software",
    introduccion: "con experiencia práctica en el entorno empresarial e interés en el análisis funcional, el desarrollo de soluciones tecnológicas y la calidad del software.",
    enfoque: "Busco una pasantía o una posición junior en tecnología donde pueda aplicar lo que he aprendido sobre procesos y desarrollo de software.",
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
  correo: "robertozamora421@gmail.com",
  whatsapp: { revision: "aprobado", numero: "+593960485065" },
  enlaces: [
    { titulo: "LinkedIn", url: "https://www.linkedin.com/in/roberto-zamora-alcivar" },
    { titulo: "GitHub", url: "https://github.com/RobertoZamora422" },
  ],
};
