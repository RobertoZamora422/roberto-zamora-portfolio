import type { Registro } from "./modelo.ts";
import { perfilPublico } from "./perfil-publico.ts";

export const registroPublico: Registro = {
  perfil: perfilPublico,
  proyectos: [
    {
      slug: "rfm-core",
      revision: "aprobado",
      nombre: "RFM CORE",
      estado: "Solución desplegada",
      categoria: "Sistema web",
      descripcion: "Desarrollé un sistema para Rancho Flor María que conecta las consultas de eventos con las cotizaciones, los contratos y el seguimiento financiero.",
      repositorio: "https://github.com/RobertoZamora422/rfm-core---django-react",
      aplicacion: "https://ranchoflormaria.com/login",
      visual: { captura: "rfm-core/panel-operativo.webp" },
      pagina: {
        revision: "aprobado",
        entradilla: "Diseñé y desarrollé el sistema con el que Rancho Flor María puede dar seguimiento a una consulta de eventos, formalizar un contrato y consultar los costos e ingresos asociados.",
        problema: "El reto era conservar esos datos durante la negociación y saber qué condiciones debían cumplirse antes de formalizar la venta.",
        contexto: "Rancho Flor María ofrece servicios de eventos y catering en Esmeraldas. Una consulta puede empezar con una fecha tentativa y un paquete todavía por definir.",
        solucion: "La precotización pública inicia el seguimiento. El equipo comercial puede preparar la cotización y convertirla en contrato cuando cumple las reglas. El backend valida esa transición y calcula los indicadores financieros a partir de los datos registrados.",
        participacion: "Fui el único desarrollador. Analicé el proceso comercial, modelé sus reglas e implementé la interfaz y la API. También preparé las pruebas, documenté las decisiones y desplegué la aplicación.",
        tecnologias: ["React", "Vite", "Django", "Django REST Framework", "PostgreSQL"],
        evidencias: ["rfm-e03-decisiones"],
        capturas: [
          {
            revision: "aprobado",
            archivo: "rfm-core/panel-operativo.webp",
            titulo: "Panel operativo",
            alt: "Panel de RFM CORE con indicadores de cotizaciones y eventos, y accesos a contratos y finanzas.",
            descripcion: "El panel reúne el seguimiento comercial, la agenda y los accesos a la gestión financiera. Los indicadores corresponden a registros de demostración.",
            ancho: 1440,
            alto: 910,
          },
          {
            revision: "aprobado",
            archivo: "rfm-core/precotizacion.png",
            titulo: "Precotización pública",
            alt: "Resultado de una precotización de servicio completo con la opción de elegir un paquete después.",
            descripcion: "La solicitud pública permite elegir el paquete más adelante. El evento y los importes de esta captura son sintéticos.",
            ancho: 1088,
            alto: 725,
          },
        ],
      }
    },
    {
      slug: "claridez",
      revision: "aprobado",
      nombre: "Claridez",
      estado: "En desarrollo",
      categoria: "Software empresarial B2B",
      descripcion: "Plataforma multiempresa para organizar las solicitudes, cotizaciones y reservas de salones y espacios de eventos.",
      repositorio: "https://github.com/RobertoZamora422/Claridez",
      visual: "conceptual",
    },
  ],
  casos: [
    {
      revision: "aprobado",
      slug: "del-interes-comercial-al-contrato",
      proyecto: "rfm-core",
      titulo: "Del interés comercial al contrato",
      resumen: "Cómo traduje el proceso comercial de Rancho Flor María en reglas de negocio, decisiones de diseño y pruebas para pasar de una consulta a un contrato.",
      resumenVisual: [
        {
          etiqueta: "Problema",
          valor: "Consultas con datos tentativos",
          detalle: "El sistema debía conservarlos y distinguirlos de las condiciones del contrato."
        },
        {
          etiqueta: "Mi responsabilidad",
          valor: "Único desarrollador",
          detalle: "Análisis, diseño e implementación del flujo."
        },
        {
          etiqueta: "Decisiones principales",
          valor: "Cotización y contrato por separado",
          detalle: "Conversión tras la confirmación y reutilización de la oferta histórica cuando es compatible."
        },
        {
          etiqueta: "Resultados verificables",
          valor: "171/171 pruebas aprobadas",
          detalle: "Backend en SQLite en memoria con datos sintéticos. E02 vincula nueve reglas de negocio con código y pruebas."
        }
      ],
      ejemplo: {
        titulo: "Cuándo se exige un paquete",
        situaciones: [
          {
            titulo: "Registrar la solicitud pública",
            descripcion: "La persona puede enviar una solicitud de servicio completo con el paquete pendiente. El personal puede confirmar esa cotización de origen público aunque el paquete siga pendiente."
          },
          {
            titulo: "Formalizar el contrato",
            descripcion: "Para convertir esa cotización confirmada, RFM CORE exige un paquete. Si falta, rechaza la conversión y conserva la cotización sin crear un contrato."
          }
        ],
        referencias: [
          { evidencia: "rfm-e02-trazabilidad", texto: "RN-03 · Regla de negocio", ancla: "rn-03" },
          { evidencia: "rfm-e04-verificacion", texto: "QA-06 · Prueba de conversión", ancla: "qa-06" },
          { evidencia: "rfm-e01-proceso", texto: "Ver pantalla de precotización", ancla: "pantalla-precotizacion" }
        ]
      },
      contexto: "En Rancho Flor María, una consulta podía empezar con una fecha tentativa, un número estimado de invitados y una modalidad por decidir. El sistema debía conservar esa información durante el seguimiento y distinguirla de las condiciones acordadas al contratar.",
      alcance: "Definí los datos, las reglas y las transiciones del proceso comercial. Implementé el flujo en React y las validaciones de negocio en Django REST Framework.",
      decisiones: "Separé la cotización del contrato para distinguir una oportunidad de una operación formalizada. Reservé la conversión para cotizaciones confirmadas e incorporé instantáneas para recuperar las condiciones de la oferta cuando son compatibles con los términos finales.",
      trabajo: "Modelé las etapas del proceso y las traduje en entidades, servicios y validaciones. Después documenté la relación entre las reglas, el código y las pruebas, y preparé escenarios para comprobar la conversión y el uso de ofertas históricas.",
      validacion: "En la auditoría local, QA-06 comprobó el rechazo de la conversión sin paquete. QA-14 comprobó cuándo se reutiliza la oferta histórica y cuándo se reconstruye. Tras integrar estas regresiones, GitHub Actions aprobó 171 de 171 pruebas de backend y 25 de 25 de frontend en el commit a95ce07. E04 enlaza la ejecución y documenta por separado la auditoría local.",
      resultadosYLimites: "Las pruebas de backend usaron SQLite en memoria y datos sintéticos. Comprobé el rechazo de una segunda conversión secuencial. Quedaron fuera de la auditoría la concurrencia en PostgreSQL, los recorridos en navegador y el envío efectivo de mensajes. El impacto en tiempos de atención, conversión y rentabilidad sigue sin medirse.",
      aprendizajes: "Aprendí a definir qué significa cada estado y a comprobar las condiciones de cada transición. Los escenarios de oferta histórica me ayudaron a distinguir qué datos deben conservarse y cuándo la aplicación los reconstruye.",
      competencia: "Análisis funcional e ingeniería de requisitos",
      periodo: "2026",
      evidencias: ["rfm-e01-proceso", "rfm-e02-trazabilidad", "rfm-e03-decisiones", "rfm-e04-verificacion"]
    }
  ],
  evidencias: [
    {
      revision: "aprobado",
      id: "rfm-e01-proceso",
      titulo: "E01 — Proceso comercial",
      tipo: "Modelo de proceso",
      fuente: "Documento y diagrama E01 v1, con contraste documental parcial en la nota E01 v1.1 del 11 de noviembre de 2026. Modelo reconstruido a partir del código y de prácticas previamente descritas.",
      autoria: "Roberto Zamora",
      afirmacion: "Distingue la atención comercial del registro en RFM CORE, con una captura de la precotización con datos sintéticos.",
      recurso: { archivo: "rfm-core/e01-proceso.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e02-trazabilidad",
      titulo: "E02 — Trazabilidad funcional",
      tipo: "Artefacto de análisis y documentación",
      fuente: "Matriz de trazabilidad funcional E02, versión 1.0. Reconstrucción retrospectiva complementada por la auditoría histórica de E04 y las referencias a sus regresiones integradas.",
      autoria: "Roberto Zamora",
      afirmacion: "Vincula las nueve reglas con el código y las pruebas que las respaldan.",
      recurso: { archivo: "rfm-core/e02-trazabilidad.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e03-decisiones",
      titulo: "E03 — Decisiones de diseño funcional",
      tipo: "Decisiones documentadas",
      fuente: "Decisiones de diseño funcional E03, versión 1.0. Análisis retrospectivo del código.",
      autoria: "Roberto Zamora",
      afirmacion: "Explica la separación entre cotizaciones y contratos, las transiciones y el uso de ofertas históricas.",
      recurso: { archivo: "rfm-core/e03-decisiones.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e04-verificacion",
      titulo: "E04 — Pruebas y resultados",
      tipo: "Pruebas y resultados verificables",
      fuente: "Auditoría local E04 del 11 de noviembre de 2026 sobre d9fe5ae con ajustes de pruebas; regresiones integradas en el PR #2 y validación de a95ce07 en GitHub Actions.",
      autoria: "Roberto Zamora",
      afirmacion: "Documenta la auditoría local, enlaza las regresiones integradas y distingue los resultados de GitHub Actions.",
      recurso: { archivo: "rfm-core/e04-verificacion.html" }
    }
  ]
};
