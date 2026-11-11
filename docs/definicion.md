# Definición del producto

**Estado · Fase 1 cerrada a nivel documental**

## Propósito y audiencia

El portafolio facilitará la evaluación de un estudiante de Ingeniería en Software para pasantías y posiciones junior. Su propuesta es mostrar cómo comprende problemas, diseña soluciones y genera valor a partir de contribuciones que se puedan examinar.

- **Reclutamiento.** Entender el perfil, reconocer un aporte relevante y encontrar el CV y el correo profesional.
- **Equipos técnicos.** Comprender el alcance del trabajo, revisar una decisión o una validación y consultar la evidencia que la respalda.

El posicionamiento público será **«Comprender problemas. Diseñar soluciones. Generar valor.»** La portada presentará tu nombre profesional y una propuesta de valor breve, junto con tu formación, las oportunidades que buscas y un aporte que el lector pueda examinar. El acceso al CV y al contacto será directo desde las páginas principales y desde un caso compartido.

El perfil tendrá un enfoque transversal. Las afirmaciones sustanciales sobre competencias, aportes y resultados deberán asociarse a evidencia pertinente y distinguir tu responsabilidad de la del equipo. Las descripciones generales pueden dar contexto con hechos confirmados.

## Alcance de la primera versión

Sitio estático en español con Inicio, Proyectos, Casos de estudio, Sobre mí y CV y contacto. Proyectos tendrá un catálogo y páginas individuales para presentar la solución completa. Los casos tendrán URLs propias y profundizarán en trabajos concretos, con sus decisiones, validación y evidencias. La disponibilidad y aprobación del contenido determinarán qué páginas de proyecto y qué casos se publican.

El CV será legible en la web e imprimible. Antes del lanzamiento se evaluará añadir un PDF descargable y se confirmarán los perfiles que se enlazarán. El correo profesional aprobado será el canal directo de contacto.

| Proyecto previsto | Descripción de trabajo | Qué confirmar |
| --- | --- | --- |
| RFM CORE | Sistema de gestión comercial y operativa de un negocio real. | Flujo que se puede describir, alcance personal y artefacto autorizado, como un proceso anonimizado o una prueba. |
| Claridez | Plataforma SaaS B2B para gestión de salones de eventos. | Etapa, aporte y prototipo, decisión o validación que lo respalde. |
| Portafolio | Proyecto de desarrollo web del perfil profesional. | Decisiones de diseño y arquitectura, y resultados de pruebas que se produzcan durante el trabajo. |

Estas descripciones orientan la recopilación de información. Cada ficha, página de proyecto y caso requieren una revisión de texto, estado, autoría y permisos antes de aparecer en el sitio.

## Éxito de la primera versión

- Desde Inicio y desde un caso compartido, una persona puede identificar el perfil y al menos un aporte personal, abrir la evidencia correspondiente y localizar el CV y el correo sin ayuda.
- El primer lanzamiento incluye un caso aprobado de RFM CORE o Claridez. Se prioriza el primero con problema documentado, responsabilidad personal delimitada y evidencia autorizada que respalde el aporte.
- RFM CORE es el proyecto destacado si su contenido está verificado y aprobado. Si queda pendiente y otro proyecto de negocio habilita el lanzamiento, se destaca ese proyecto aprobado. El caso destacado demuestra una competencia o un aporte con evidencia.
- El nombre público, la propuesta de valor, la formación, el perfil, el CV y el correo han sido confirmados. La versión pública cumple los [criterios de calidad y publicación](requisitos.md).

## Fases y revisiones

| Fase | Entrega y revisión |
| --- | --- |
| 1. Definición y organización | Cerrada a nivel documental con esta definición, el [mapa y modelo de contenido](arquitectura-de-informacion.md) y los [requisitos](requisitos.md). |
| 2. Diseño UX/UI | Cerrada con la [dirección visual aprobada](diseno-ux-ui.md) y los patrones de composición, navegación, evidencias y reflujo. |
| 3. Desarrollo | Empezar con configuración, sistema de diseño, navegación y prueba local de prerenderizado. Desarrollar páginas, casos y CV según el [plan técnico](plan-tecnico-fase-3.md). La preparación de evidencias avanza en paralelo. |
| 4. Publicación | Aprobar la versión, el caso y sus evidencias, el perfil, el CV, el contacto y la URL. Verificar la compilación en producción y registrar la versión publicada. |

Los ajustes menores se resuelven dentro de cada fase. La revisión se concentra en decisiones de producto, identidad, arquitectura y publicación.

## Registro de decisiones

| Decisión | Estado |
| --- | --- |
| Español, accesos separados para Proyectos y Casos de estudio, y correo profesional como canal de contacto. | Acordada. |
| Prioridad al perfil y al aporte personal, con acceso directo al CV y al contacto. | Aprobada. |
| Páginas individuales para presentar la solución completa y casos independientes para examinar trabajos concretos. Evidencia asociada a las afirmaciones sustanciales. | Aprobada. |
| Desarrollo independiente de la preparación de evidencias y primer lanzamiento con un caso de negocio aprobado. | Acordada. |
| React, TypeScript, Vite y Cloudflare Pages, con contenido versionado y sin backend inicial. | Acordada. |
| React Router con prerenderizado estático de las rutas públicas. | Recomendación provisional aprobada, sujeta a la prueba de fase 3. |
| Editorial contemporánea con estructura modular de Estudio de producto y documentación técnica de Cuaderno de ingeniería. | Aprobada al cerrar fase 2. |
| Nombre profesional y propuesta de valor en portada, con prioridad a RFM CORE si su contenido está aprobado. | Acordada. Los datos y materiales públicos se confirmarán antes de publicar. |
| Primer caso, materiales autorizados, CV, correo y URL pública. | Pendientes de confirmación antes de publicar. |
