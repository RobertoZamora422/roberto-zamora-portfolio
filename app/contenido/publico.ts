import type { Registro } from "./modelo.ts";
import { perfilPublico } from "./perfil-publico.ts";

// Contexto y posicionamiento acordados en docs/definicion.md.
export const presentacionBase = {
  presentacion: "Estudiante de Ingeniería en Software",
  propuesta: "Comprender problemas. Diseñar soluciones. Generar valor.",
  oportunidades: "Pasantías y posiciones junior",
};

export const registroPublico: Registro = {
  perfil: perfilPublico,
  proyectos: [
    {
      slug: "rfm-core",
      ficha: {
        revision: "aprobado",
        nombre: "RFM CORE",
        resumen: "Sistema web para gestionar consultas, cotizaciones, contratos y análisis financiero de un negocio de eventos.",
        estado: "Solución desplegada"
      },
      pagina: {
        revision: "aprobado",
        entradilla: "Solución web que integra el recorrido comercial de un negocio de eventos, desde la primera consulta hasta el contrato y los indicadores de rentabilidad.",
        destacado: "Desarrollé un sistema web que conecta las consultas, cotizaciones y contratos de un negocio de eventos con su gestión financiera.",
        problema: "Las consultas, cotizaciones, acuerdos, costos y gastos pertenecen a etapas diferentes y requieren reglas coherentes para distinguir las oportunidades de las ventas.",
        contexto: "Rancho Flor María es un negocio de eventos y catering de Esmeraldas. Desarrollé el proyecto para apoyar sus actividades comerciales y administrativas.",
        proposito: "Organizar y conectar el seguimiento comercial con la gestión contractual y los datos financieros del negocio.",
        solucion: "RFM CORE integra precotización pública, gestión de personas y cotizaciones, formalización de contratos, costos, gastos y reportes. El backend aplica las validaciones y los cálculos críticos.",
        participacion: "Desarrollé el proyecto de manera individual. Asumí el análisis, el diseño, la implementación, la validación, la documentación y el despliegue.",
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
            descripcion: "La solicitud de servicio completo admite un paquete pendiente. La captura de E01 muestra ese punto de entrada con un evento e importes sintéticos. El canal de WhatsApp quedó sin configurar en la demostración.",
            ancho: 1088,
            alto: 725,
          },
        ],
      }
    }
  ],
  casos: [
    {
      revision: "aprobado",
      slug: "del-interes-comercial-al-contrato",
      proyecto: "rfm-core",
      titulo: "Del interés comercial al contrato",
      resumen: "Diseñé el flujo comercial de Rancho Flor María para que una consulta pueda avanzar a cotización y llegar a contrato cuando se cumplan las reglas de formalización.",
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
            descripcion: "La persona puede enviar una solicitud de servicio completo con el paquete pendiente. El personal puede confirmarla en ese estado."
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
      contexto: "En Rancho Flor María, una consulta podía empezar con una fecha tentativa, un número estimado de invitados y una modalidad por decidir. El sistema debía conservar esa información durante el seguimiento y distinguirla de las condiciones acordadas al contratar. La fecha tentativa se registra como dato de la solicitud.",
      alcance: "Definí los datos, las reglas y las transiciones del proceso comercial. Implementé el flujo en React y las validaciones de negocio en Django REST Framework.",
      decisiones: "Separé la cotización del contrato para distinguir una oportunidad de una operación formalizada. Reservé la conversión para cotizaciones confirmadas e incorporé instantáneas para recuperar las condiciones de la oferta cuando son compatibles con los términos finales.",
      trabajo: "Modelé las etapas del proceso y las traduje en entidades, servicios y validaciones. Después documenté la relación entre las reglas, el código y las pruebas, y preparé escenarios para comprobar la conversión y el uso de ofertas históricas.",
      validacion: "La auditoría local E04 del 11 de noviembre de 2026 partió de d9fe5ae con ajustes de pruebas. QA-06 comprueba el rechazo de la conversión sin paquete y QA-14 distingue cuándo se reutiliza o reconstruye la oferta histórica. Las regresiones se integraron mediante el PR #2. Después, GitHub Actions validó por separado el commit a95ce07 de main: 171/171 pruebas de backend y 25/25 de frontend. La ficha E04 enlaza las pruebas y la ejecución de CI.",
      resultadosYLimites: "Las pruebas del backend usaron SQLite en memoria y datos sintéticos. El rechazo de una segunda conversión se comprobó de forma secuencial; queda sin validar la concurrencia con PostgreSQL. E04 no cubrió recorridos de interfaz en navegador ni el envío efectivo de mensajes. La captura de E01 ilustra el alta pública y los resultados de CI no acreditan recorridos de extremo a extremo. El impacto en tiempos de atención, conversión y rentabilidad sigue sin medir.",
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
  ],
  casoDestacado: "del-interes-comercial-al-contrato"
};
