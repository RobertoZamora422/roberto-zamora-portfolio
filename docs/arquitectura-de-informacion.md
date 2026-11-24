# Arquitectura de información

Inicio reúne la presentación y las secciones numeradas Mi trabajo (`/#trabajo`), Cómo aporto (`/#aportacion`), Sobre mí (`/#sobre-mi`) y Contacto (`/#contacto`). El titular visible es «Del análisis a la solución.». RZ. vuelve a la raíz del sitio.

| Recorrido | Finalidad |
| --- | --- |
| Inicio → RFM CORE | Entender qué construyó Roberto, para qué negocio y qué parte asumió. La tarjeta y la ficha permiten abrir la aplicación y el repositorio. |
| RFM CORE → Del interés comercial al contrato | Profundizar en el proceso, una regla concreta, sus decisiones de diseño y sus pruebas. La invitación aparece al final de la ficha. |
| Caso → E01, E02, E03 o E04 | Consultar el documento que respalda una afirmación y volver a la sección de evidencias. |
| Inicio → Claridez | Consultar su repositorio desde la tarjeta del proyecto en desarrollo. |
| Cualquier página → CV o Hablemos | Abrir el PDF oficial o llegar a los canales de contacto de Inicio. |

## Modelo de contenido

Cada proyecto tiene un identificador, estado, descripción para Inicio, recurso visual y destino de repositorio. Puede incluir una aplicación desplegada y una página individual aprobada por separado. La ficha registra contexto, problema, solución, participación, tecnologías, capturas y referencias de respaldo.

Un caso identifica el proyecto al que pertenece. Para publicarlo se requiere que el proyecto tenga página aprobada y que se puedan resolver sus referencias a evidencias aprobadas. La ficha obtiene sus casos de esa relación. La dirección pública de cada caso conserva el patrón `/casos-de-estudio/:slug/`.

El resumen y el detalle técnico del caso contextualizan los resultados de pruebas. Los documentos de evidencia conservan autoría, fuente y alcance. El perfil, el PDF, el retrato y el número de WhatsApp se publican de acuerdo con sus aprobaciones.

Las rutas retiradas se resuelven mediante redirecciones permanentes. Los destinos, la respuesta a direcciones desconocidas y el sitemap se detallan en [Cloudflare Pages](propuesta-cloudflare-pages.md).
