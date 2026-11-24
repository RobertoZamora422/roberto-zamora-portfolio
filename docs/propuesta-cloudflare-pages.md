# Despliegue en Cloudflare Pages

| Ajuste | Valor |
| --- | --- |
| Directorio raíz | Raíz del repositorio |
| Node.js | Versión de `.node-version` |
| Compilación | `npm ci && npm run build` con `SKIP_DEPENDENCY_INSTALL=1` si la instalación se gestiona en ese comando |
| Salida | `build/client`, incluidos `_headers`, `_redirects`, `_routes.json` y `_worker.js` |
| Origen canónico | `PORTFOLIO_ORIGEN` debe contener el origen HTTPS del dominio aprobado |
| Indexación | `PORTFOLIO_INDEXAR=1` en la compilación destinada a indexarse. El valor predeterminado es `0`. |

El prerender genera tres páginas y sus datos de navegación. La compilación incorpora el PDF oficial y cuatro documentos de evidencia. Con un origen configurado se emiten canonical, Open Graph y la tarjeta social. Con indexación habilitada, el sitemap contiene las tres páginas y las cuatro evidencias en sus URLs canónicas. El PDF lleva `X-Robots-Tag: noindex`. Las compilaciones de revisión permiten a los rastreadores leer la directiva `noindex`. [Configuración de compilación](https://developers.cloudflare.com/pages/configuration/build-configuration/) · [Encabezados](https://developers.cloudflare.com/pages/configuration/headers/)

El 24 de noviembre de 2026, el dominio `robertozamora.claridez.com` servía Inicio con canonical a su propia raíz y `noindex` en HTML y en la respuesta HTTP. En ese estado `/sitemap.xml` respondía 404.

## Compatibilidad de enlaces

| Ruta anterior, con o sin barra final | Destino del 301 |
| --- | --- |
| `/proyectos/` | `/#trabajo` |
| `/sobre-mi/` | `/#sobre-mi` |
| `/cv/` | `/#contacto` |
| `/casos-de-estudio/` | `/casos-de-estudio/del-interes-comercial-al-contrato/` |

Las reglas coinciden con rutas exactas. Un navegador que abre `/cv/#contacto` solicita `/cv/`, recibe el fragmento explícito en `Location` y sitúa al visitante en Contacto. Pages conserva su normalización de las evidencias de `.html` a la URL sin extensión. [Redirecciones de Pages](https://developers.cloudflare.com/pages/configuration/redirects/)

El comportamiento predeterminado de Pages al faltar `404.html` es servir Inicio con HTTP 200 en rutas desconocidas. El pequeño manejador de `cloudflare/respuesta.js` permite recuperar un enlace perdido con HTTP 404 y un acceso a Inicio. El archivo `_routes.json` deja las páginas, evidencias y redirecciones en el servicio estático. [Servicio de páginas](https://developers.cloudflare.com/pages/configuration/serving-pages/) · [Modo avanzado de Pages Functions](https://developers.cloudflare.com/pages/functions/advanced-mode/)

## Comprobación de la versión publicada

Desde el dominio canónico, comprobar los destinos 301, un enlace desconocido, el PDF, los cuatro documentos, canonical, Open Graph, sitemap y los encabezados de las vistas previas. Las tres páginas con correo en el pie llevan `Cache-Control: no-transform` para conservar el enlace `mailto:` con JavaScript desactivado. Revisar también el encabezado en el dominio real, donde pueden intervenir reglas de zona. [Ofuscación de correo](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)
