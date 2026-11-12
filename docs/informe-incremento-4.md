# Incremento 4 · Candidata del portafolio RZ.

La compilación candidata integra el perfil aprobado en `be9a3e3`, el proyecto RFM CORE, su caso y las evidencias E01–E04. El perfil público conserva «Tecnología · Procesos · Análisis funcional», los cuatro párrafos de Sobre mí, los tres del CV, la formación y el correo confirmado. El registro tiene una sola entrada de perfil. La galería y los archivos de revisión quedan fuera de la salida pública.

| Entregable | Ruta local |
| --- | --- |
| Compilación estática | `build/client` |
| Vista de la candidata | `npm run preview:candidata` y `http://127.0.0.1:8789/` |
| Galería e impresión de control | `.local/revision-incremento-4/index.html` |
| Informes Lighthouse | `.local/calidad-incremento-4/lighthouse/` |
| Configuración propuesta | [Cloudflare Pages](propuesta-cloudflare-pages.md) |

## Metadatos e indexación

Las siete páginas principales y los cuatro documentos de evidencia tienen títulos, descripciones y metadatos Open Graph. En E01–E04 se añadieron etiquetas solo en la cabecera del HTML generado. El cuerpo, imágenes y enlaces de las evidencias conservan su contenido original.

La candidata local tiene `noindex` en el HTML y `X-Robots-Tag` en las respuestas. El origen HTTPS se configura con `PORTFOLIO_ORIGEN`. Sin ese valor, la candidata omite las URLs absolutas y el sitemap. El modo de lanzamiento, probado con un origen de ejemplo en una compilación aislada, genera las canónicas, las URLs e imagen Open Graph y el sitemap solo para rutas públicas aprobadas. El sitemap y su anuncio en `robots.txt` requieren `PORTFOLIO_INDEXAR=1`. [Requisitos de URLs en sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## Resultados de calidad

| Comprobación | Resultado |
| --- | --- |
| Tipos, contenido y sitio | `npm run typecheck` aprobado. Pasaron 23 de 23 pruebas de contenido y 5 de 5 pruebas de sitio con `npm run revision:candidata`. |
| Reproducibilidad | `npm ci` en una copia aislada y compilación con Node 24.18.1. Los 46 archivos de `build/client` coinciden por SHA-256. El inventario está en `.local/calidad-incremento-4/sha256-candidata.json`. |
| Navegación y HTTP | Acceso directo y navegación entre proyecto, caso, evidencias y CV comprobados en Wrangler. Las rutas desconocidas y los recursos privados devuelven HTTP 404. Se comprobaron también las peticiones de datos durante la navegación. |
| Accesibilidad y reflujo | Se recorrieron las páginas con teclado y se revisaron foco, encabezados y enlaces. Desde el caso se abrió E04, se volvió al caso y se llegó al correo del CV con teclado y movimiento reducido en los tres anchos. El árbol de accesibilidad expone los encabezados del CV. Axe no reportó infracciones en las reglas A y AA evaluadas. La galería contiene las siete vistas a 1280, 390 y 320 px. Queda pendiente un recorrido manual con lector de pantalla y la revisión con una persona externa. |
| CV | Impresión de control en una página A4, con texto seleccionable y el correo visible. Se comprobó que el enlace del CV apunta al `mailto:` confirmado. |
| Evidencias y artefacto | Los 33 enlaces externos distintos de E01–E04 respondieron HTTP 200. La inspección confirmó que el cuerpo HTML de los cuatro recursos y los datos propios del proyecto y del caso coinciden con su candidata aprobada. Se verificó la exclusión de materiales de revisión, muestras, archivos ZIP y PDF en `build/client`. |
| Indexación y enlaces compartidos | El modo de lanzamiento simulado sirvió las 11 rutas de su sitemap con HTTP 200. Cada una contiene canónica, `og:url` y `og:image`. Se comprobó la tarjeta PNG a 1200 × 630 px. La indexación y la representación de tarjetas en servicios externos quedan pendientes del dominio definitivo. |

En la primera corrida, el índice de un caso de revisión podía anunciar la sección siguiente al abrir un ancla a 320 px, aunque el navegador hubiera llegado al encabezado correcto. El índice compartido ahora conserva la sección del ancla mientras el encabezado permanece alineado. La corrida final verificó el ancla, el desplazamiento posterior y el resto de la navegación.

## Lighthouse móvil

Se ejecutó Lighthouse 13.6.0 tres veces por ruta sobre la compilación candidata en Wrangler local, con Chrome 157 en Windows. Se usó el perfil móvil simulado de 412 × 823 px con CPU 4×, latencia de 150 ms y caudal de 1638,4 kbps. Se eligieron Inicio y el caso «Del interés comercial al contrato», el único caso público. [Perfil de simulación de Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)

| Ruta | LCP mediano | CLS mediano | Umbrales de `docs/requisitos.md` |
| --- | ---: | ---: | --- |
| Inicio | 0,867 s | 0,00096 | Cumple en laboratorio local |
| Del interés comercial al contrato | 0,945 s | 0,00068 | Cumple en laboratorio local |

Los límites son LCP ≤ 2,5 s y CLS ≤ 0,1. Los seis informes JSON y `resumen.json` están en `.local/calidad-incremento-4/lighthouse/`. Para repetir una corrida, con la candidata en servicio, usa `npx lighthouse@13.6.0 http://127.0.0.1:8789/ --only-categories=performance --form-factor=mobile --throttling-method=simulate --output=json` y cambia la ruta para medir el caso. INP al percentil 75 queda pendiente de datos de campo suficientes. Las mediciones locales no incluyen la red del alojamiento real.

## Decisiones antes de autorizar el lanzamiento

- Elegir el dominio HTTPS y el host canónico, y autorizar la activación de indexación.
- Revisar la candidata y aprobar la [tarjeta social tipográfica RZ.](../recursos-contenido/sitio/rz-social.png) para compartir enlaces.
- Decidir si se ofrece un PDF descargable además del CV HTML imprimible. La impresión de control se conserva en la galería local.
- Autorizar la configuración de Cloudflare Pages y el primer despliegue. La comprobación de HTTPS, dominio y comportamiento real de Pages queda para ese momento.
