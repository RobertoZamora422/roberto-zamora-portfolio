# Propuesta de Cloudflare Pages · RZ.

La candidata se sirve localmente desde `build/client`. Esta propuesta deja lista la configuración para el lanzamiento cuando se autoricen el dominio y la publicación.

| Opción | Valor propuesto |
| --- | --- |
| Proyecto | Cloudflare Pages estático, sin Pages Functions. |
| Directorio raíz | Raíz del repositorio. |
| Node.js | `24.18.1`, fijado en `.node-version`. |
| Instalación y compilación | `npm ci && npm run build`, con `SKIP_DEPENDENCY_INSTALL=1` para hacer explícita la instalación desde el lockfile. |
| Directorio de salida | `build/client`. |
| Dominio | Asociar el dominio aprobado y verificar HTTPS antes de activar indexación. |
| Producción | Definir `PORTFOLIO_ORIGEN` con el origen HTTPS aprobado, sin ruta. Activar `PORTFOLIO_INDEXAR=1` al autorizar la indexación. |
| Vistas previas alojadas | Desactivar despliegues automáticos de ramas de revisión. Si se necesitan, restringir el acceso y dejar `PORTFOLIO_INDEXAR=0`. |

Referencias de configuración. [Compilación en Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/) · [Imagen de compilación y Node.js](https://developers.cloudflare.com/pages/configuration/build-image/) · [Controles de ramas](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) · [Acceso a vistas previas](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

`npm run build` integra solo el registro aprobado. `npm run build:prueba` sigue reservado a la revisión local y produce un directorio distinto. La compilación candidata aplica `noindex` mediante HTML y `X-Robots-Tag`. Su `robots.txt` permite leer esa directiva. La privacidad de una vista previa alojada requiere control de acceso. [Directiva noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) · [Encabezados de Pages](https://developers.cloudflare.com/pages/configuration/headers/)

Con el origen aprobado, la compilación genera canónicas absolutas y completa Open Graph con la tarjeta RZ. La activación de indexación añade `sitemap.xml` y lo anuncia en `robots.txt`. Las evidencias HTML usan las rutas sin extensión que sirve Pages. El archivo `404.html` permite responder HTTP 404 en las rutas desconocidas. La configuración de lanzamiento también aplica `noindex` a las URLs de `pages.dev`. [Rutas de Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) · [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Open Graph](https://ogp.me/)

Tras el primer despliegue autorizado, comprobar HTTPS y el host canónico, las respuestas 200 y 404, el correo, las evidencias, la entrega de la tarjeta social y las directivas de indexación en el dominio real. Conservar el identificador de la versión para poder revertirla. [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Reversión](https://developers.cloudflare.com/pages/configuration/rollbacks/)

## Correo sin JavaScript

En el despliegue consultado el 12 de noviembre de 2026, `/cv/#contacto` en `robertozamora.claridez.com` contenía `__cf_email__`, un enlace a `/cdn-cgi/l/email-protection` y el script `email-decode.min.js`. La misma ruta en `roberto-zamora-portfolio.pages.dev` entregaba el `mailto:` original. Cloudflare documenta que Email Address Obfuscation modifica el HTML y necesita el decodificador para recuperar el enlace. [Email Address Obfuscation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)

El incremento 5A añade `no-transform` al encabezado `Cache-Control` de `/cv/` y `/cv` en el archivo `_headers` generado. Cloudflare documenta que respeta esa directiva para la ofuscación. Después de desplegar, comprobar en el host público que `/cv/#contacto` entrega el encabezado, muestra el correo y conserva el `mailto:` con JavaScript desactivado. Revisar el HTML de respuesta para confirmar la ausencia del decodificador. [Encabezados de Pages](https://developers.cloudflare.com/pages/configuration/headers/) · [Condiciones de la ofuscación](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#troubleshoot-email-obfuscation)

Si el borde aún reescribe el correo tras esa comprobación, crear una **Configuration Rule** de la zona con **Email Obfuscation → Off** y este filtro exacto. El fragmento `#contacto` se resuelve en el navegador.

```text
(http.host eq "robertozamora.claridez.com" and http.request.uri.path in {"/cv" "/cv/"})
```

Verificar la prioridad si otras Configuration Rules coinciden con esas rutas y repetir la prueba sin JavaScript tras actualizar la versión servida. [Configuration Rules](https://developers.cloudflare.com/rules/configuration-rules/) · [Ajuste Email Obfuscation](https://developers.cloudflare.com/rules/configuration-rules/settings/#email-obfuscation)
