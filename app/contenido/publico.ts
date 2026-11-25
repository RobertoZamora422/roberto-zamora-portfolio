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
        entradilla: "Sistema web de gestión comercial y financiera desarrollado para un negocio de eventos. Integra el seguimiento de oportunidades comerciales, la gestión de cotizaciones y contratos y el análisis de rentabilidad.",
        contexto: [
          "Rancho Flor María es una empresa de eventos y catering ubicada en Esmeraldas, Ecuador. Su actividad comercial abarca desde la atención de una primera consulta hasta la contratación de un servicio y la evaluación de sus resultados financieros.",
          "El desafío consistía en integrar estas etapas en un mismo sistema, respetar las particularidades del proceso comercial y relacionar las oportunidades de venta con los servicios contratados y la información financiera.",
        ],
        solucion: [
          "RFM CORE centraliza la gestión de clientes e interesados, precotizaciones, cotizaciones, contratos, costos y gastos. Así conecta la actividad comercial con el análisis financiero del negocio.",
          "El sistema incorpora reglas de negocio que regulan la evolución de cada oportunidad comercial, validan las condiciones de contratación y permiten calcular indicadores de rentabilidad a partir de la información registrada.",
        ],
        participacion: [
          "Desarrollé el proyecto de manera individual, desde el análisis de las necesidades del negocio hasta la implementación y el despliegue de la aplicación.",
          "Mi trabajo comprendió el modelado de procesos, la definición de requisitos y reglas de negocio, el diseño de la solución, el desarrollo de la interfaz y la API, así como la validación y documentación del sistema.",
        ],
        tecnologias: ["React", "Vite", "Django", "Django REST Framework", "PostgreSQL"],
        evidencias: ["rfm-e03-decisiones"],
        capturas: [
          {
            revision: "aprobado",
            archivo: "rfm-core/panel-operativo.webp",
            titulo: "Panel operativo",
            alt: "Panel de RFM CORE con indicadores de cotizaciones y eventos, y accesos a contratos y finanzas.",
            descripcion: "Proporciona una visión general de la actividad comercial, los próximos eventos y las operaciones pendientes. Desde el panel se accede a las principales funciones administrativas y financieras.",
            nota: "Captura con datos de demostración.",
            ancho: 1440,
            alto: 910,
          },
          {
            revision: "aprobado",
            archivo: "rfm-core/precotizacion.png",
            titulo: "Precotización pública",
            alt: "Resultado de una precotización de servicio completo con la opción de elegir un paquete después.",
            descripcion: "Permite a los interesados consultar las alternativas de servicio y registrar una solicitud según las características de su evento, sin necesidad de definir todos los detalles desde el primer contacto.",
            nota: "Captura con datos de demostración.",
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
      proyecto: "rfm-core",
      titulo: "Del interés comercial al contrato",
      resumen: "Un análisis de las decisiones que permitieron transformar un proceso comercial flexible en un flujo de software con reglas de negocio definidas, condiciones de contratación y mecanismos de validación.",
      pregunta: "¿Cómo trasladar la flexibilidad de un proceso comercial a un sistema de software sin comprometer la integridad de las operaciones?",
      introduccion: "Este caso de estudio aborda el análisis, diseño e implementación del flujo comercial de Rancho Flor María, desde el registro de una primera consulta hasta la formalización de un contrato, así como la validación de las reglas que gobiernan ese recorrido.",
      resumenVisual: [
        { titulo: "Desafío", descripcion: "Gestionar información comercial preliminar sin confundirla con las condiciones definitivas de contratación." },
        { titulo: "Responsabilidad", descripcion: "Análisis funcional, diseño, implementación y validación del proceso comercial." },
        { titulo: "Decisiones de diseño", descripcion: "Separación entre cotizaciones y contratos, validación progresiva de requisitos y conservación de las condiciones de las ofertas." },
        { titulo: "Resultados verificables", descripcion: "Nueve reglas de negocio documentadas y vinculadas con su implementación y sus pruebas. Una auditoría técnica y una ejecución de integración continua respaldan los resultados." },
      ],
      competencias: "Análisis funcional, ingeniería de requisitos, diseño y validación de software.",
      periodo: "2026",
      contexto: [
        "La contratación de un evento no comienza necesariamente con condiciones definitivas. En Rancho Flor María, una consulta puede originarse con una fecha tentativa, una cantidad estimada de invitados o una modalidad de servicio todavía por definir.",
        "Esta flexibilidad es necesaria durante la atención comercial, pero debe coexistir con condiciones más estrictas al formalizar un contrato.",
        "El desafío consistía en diseñar un sistema capaz de acompañar la negociación, conservar la información relevante y garantizar que cada operación cumpliera los requisitos correspondientes a su etapa.",
      ],
      alcance: [
        "Definí el modelo de información, los estados del proceso comercial, sus transiciones y las condiciones necesarias para avanzar de un estado a otro.",
        "Implementé el flujo en React y las reglas de negocio en los servicios y las validaciones de Django REST Framework. El backend controla la formalización de las operaciones.",
      ],
      decisiones: [
        {
          titulo: "Separación entre cotización y contrato",
          parrafos: [
            "Una cotización representa una oportunidad comercial cuyas condiciones todavía pueden evolucionar. Un contrato representa una operación formalizada.",
            "Separar ambos conceptos permite conservar el historial comercial y establecer requisitos específicos para la contratación. Solo se pueden convertir en contratos las cotizaciones confirmadas.",
          ],
        },
        {
          titulo: "Validación según la etapa del proceso",
          parrafos: [
            "No toda la información debe ser obligatoria desde el primer contacto. Definí condiciones de validación diferenciadas para permitir el registro de solicitudes preliminares y exigir los datos necesarios al formalizar el servicio.",
          ],
        },
        {
          titulo: "Conservación de las condiciones de la oferta",
          parrafos: [
            "Los paquetes y sus condiciones comerciales pueden modificarse con el tiempo. Para evitar que esos cambios alteren las condiciones de una negociación anterior, incorporé instantáneas de las ofertas.",
            "El sistema reutiliza las condiciones de la oferta cuando son compatibles con la contratación. Cuando resulta necesario reconstruirlas, utiliza los datos vigentes y mantiene explícito el valor acordado.",
          ],
        },
      ],
      ejemplo: {
        situaciones: [
          {
            titulo: "Registrar una solicitud",
            parrafos: ["Un interesado puede solicitar un servicio completo sin haber seleccionado todavía un paquete. La solicitud puede registrarse y la cotización de origen público puede confirmarse en esas condiciones."],
          },
          {
            titulo: "Formalizar el contrato",
            parrafos: [
              "La selección del paquete se convierte en un requisito obligatorio al formalizar la contratación de un servicio completo.",
              "Si este requisito no se cumple, el sistema rechaza la conversión y conserva la cotización confirmada sin generar un contrato.",
            ],
          },
        ],
        conclusion: "Esta decisión permite mantener la flexibilidad durante la atención comercial sin comprometer la consistencia de las operaciones formalizadas.",
        referencias: [
          { evidencia: "rfm-e02-trazabilidad", texto: "RN-03 · Regla de negocio", ancla: "rn-03" },
          { evidencia: "rfm-e04-verificacion", texto: "QA-06 · Prueba de conversión", ancla: "qa-06" },
          { evidencia: "rfm-e01-proceso", texto: "Consultar pantalla de precotización", ancla: "pantalla-precotizacion" },
        ],
      },
      trazabilidad: [
        "Documenté nueve reglas de negocio y establecí su correspondencia con los componentes de software responsables de aplicarlas y las pruebas que permiten verificar su comportamiento.",
        "Esta trazabilidad facilita la revisión de las decisiones funcionales, la identificación de los elementos afectados ante un cambio y la comprobación de que la implementación responde a las condiciones definidas.",
        "Reconstruí la matriz de trazabilidad a partir de la implementación y la complementé con los resultados de la auditoría técnica.",
      ],
      validacion: {
        introduccion: "La validación se centró en comprobar que las transiciones del proceso comercial respetaran las reglas de negocio y conservaran correctamente la información de las operaciones. Entre los escenarios documentados se encuentran los siguientes.",
        escenarios: [
          { titulo: "QA-06", descripcion: "Rechazo de la conversión a contrato cuando falta el paquete requerido. La cotización permanece confirmada y el sistema no genera un contrato." },
          { titulo: "QA-14", descripcion: "Conservación de las condiciones históricas de una oferta cuando son compatibles y reconstrucción de sus datos cuando corresponde." },
        ],
        ejecucion: "Tras integrar las pruebas de regresión, una ejecución de GitHub Actions sobre el commit a95ce07 registró los siguientes resultados.",
        resultados: [
          { titulo: "Backend", descripcion: "171 de 171 pruebas aprobadas." },
          { titulo: "Frontend", descripcion: "25 de 25 pruebas aprobadas." },
        ],
        fuente: "La evidencia E04 documenta por separado la auditoría local y los resultados de integración continua, con referencias a las pruebas y ejecuciones correspondientes.",
        limites: [
          "Las pruebas de backend se ejecutaron con SQLite en memoria y datos sintéticos. También se verificó el rechazo de un segundo intento de conversión realizado de forma secuencial.",
          "La validación documentada no incluyó pruebas de concurrencia en PostgreSQL, recorridos de extremo a extremo en navegador ni el envío efectivo de mensajes.",
          "El impacto del sistema sobre los tiempos de atención, la conversión comercial y la rentabilidad del negocio todavía no se ha cuantificado.",
        ],
      },
      aprendizajes: [
        "El desarrollo de RFM CORE reforzó mi comprensión de que un proceso de negocio no debe trasladarse al software de manera mecánica.",
        "Es necesario interpretar sus particularidades, distinguir entre información preliminar y compromisos definitivos, y convertir esas diferencias en reglas claras y verificables.",
        "La combinación de análisis funcional, decisiones de diseño y validación permite construir soluciones que responden al contexto en el que serán utilizadas.",
      ],
      evidencias: ["rfm-e01-proceso", "rfm-e02-trazabilidad", "rfm-e03-decisiones", "rfm-e04-verificacion"]
    }
  ],
  evidencias: [
    {
      revision: "aprobado",
      id: "rfm-e01-proceso",
      titulo: "E01 — Proceso comercial",
      tipo: "Modelo de proceso",
      fuente: "Documento y diagrama v1, reconstruidos a partir de la implementación y las prácticas comerciales descritas, con contraste documental parcial en la revisión v1.1 del 11 de noviembre de 2026.",
      autoria: "Roberto Zamora",
      afirmacion: "Representa las etapas de atención comercial y su relación con las operaciones registradas en RFM CORE.",
      recurso: { archivo: "rfm-core/e01-proceso.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e02-trazabilidad",
      titulo: "E02 — Trazabilidad funcional",
      tipo: "Matriz de trazabilidad",
      fuente: "Matriz v1.0, elaborada retrospectivamente y complementada mediante la auditoría técnica documentada en E04.",
      autoria: "Roberto Zamora",
      afirmacion: "Establece la correspondencia entre nueve reglas de negocio, los componentes responsables de aplicarlas y las pruebas que respaldan su comportamiento.",
      recurso: { archivo: "rfm-core/e02-trazabilidad.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e03-decisiones",
      titulo: "E03 — Decisiones de diseño funcional",
      tipo: "Documentación de decisiones",
      fuente: "Documento v1.0, basado en el análisis retrospectivo de la implementación.",
      autoria: "Roberto Zamora",
      afirmacion: "Expone los criterios que fundamentan la separación entre cotizaciones y contratos, las condiciones de sus transiciones y la conservación de la información histórica.",
      recurso: { archivo: "rfm-core/e03-decisiones.html" }
    },
    {
      revision: "aprobado",
      id: "rfm-e04-verificacion",
      titulo: "E04 — Pruebas y resultados",
      tipo: "Informe de validación técnica",
      fuente: "Auditoría local E04 del 11 de noviembre de 2026 sobre d9fe5ae con ajustes de pruebas. Integración mediante el PR #2 y validación posterior del commit a95ce07 en GitHub Actions.",
      autoria: "Roberto Zamora",
      afirmacion: "Documenta los escenarios evaluados, las pruebas de regresión incorporadas, los resultados de integración continua y las limitaciones de la validación realizada.",
      recurso: { archivo: "rfm-core/e04-verificacion.html" }
    }
  ]
};
