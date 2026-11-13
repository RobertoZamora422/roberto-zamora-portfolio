# Incremento 5B · Portafolio RZ.

**Entrega local.** Base `824fd98a68f05929d3a40ca2a06b947ab7693c59`, confirmada en `main` y `origin/main` al iniciar.

## Cambios locales

| Archivo | Cambio |
| --- | --- |
| `recursos-contenido/perfil/roberto-zamora-cv.pdf` | Copia íntegra de `Recursos/Zamora Alcivar Roberto - CV.pdf`, el PDF oficial entregado. |
| `recursos-contenido/perfil/roberto-zamora.png` | Copia íntegra de la fotografía entregada en `Recursos/fotografia 11122026.png`. Resolución de 1122 × 1402 px. |
| `app/contenido/perfil-publico.ts` | Registra los dos archivos aprobados y el texto alternativo «Retrato profesional de Roberto Zamora». |
| `app/routes/cv.tsx` | Actualiza la descripción de la página de contacto para el PDF oficial disponible. El registro activa los enlaces «Ver CV» y retira el aviso provisional de la página. |
| `app/styles.css` | Acerca el encuadre en el marco RZ. de Inicio, manteniendo las proporciones de la imagen y el nombre como elemento principal. |
| `app/contenido/publico.ts` | Añade al pie de la captura de precotización que WhatsApp quedó sin configurar en la demostración. E01 ya documentaba esa condición. |
| `pruebas/sitio.test.mjs` | Actualiza la secuencia de teclado y comprueba las acciones, los encabezados HTTP y los bytes del PDF servido. |

Las copias originales se conservan en `Recursos/`. Los archivos integrados en `recursos-contenido/perfil/` son los que consume el registro y copia la compilación.

## Verificación de producción

Se comprobó el 12 de noviembre de 2026 en `robertozamora.claridez.com` y `roberto-zamora-portfolio.pages.dev`.

| Comprobación | Resultado |
| --- | --- |
| Correo sin JavaScript | `/cv/#contacto` abre el ancla y muestra un enlace `mailto:` con la dirección visible en Chrome. La variante `/cv` lleva al mismo destino. Ambas devuelven HTTP 200 y `Cache-Control: public, max-age=0, must-revalidate, no-transform`. El HTML servido conserva el correo y carece de marcadores de ofuscación. El comportamiento observado cumple la condición documentada por Cloudflare. [Documentación de Cloudflare](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#troubleshoot-email-obfuscation) |
| Favicon | HTTP 200 y `image/vnd.microsoft.icon`. El SHA-256 coincide con el recurso del repositorio en ambos hosts. |
| E01–E04 | HTTP 200 para las cuatro evidencias en ambos hosts. El cuerpo HTML coincide con cada fuente tras normalizar finales de línea. Los 33 destinos externos distintos devolvieron HTTP 200. |
| Tabla de E04 | «Aprobadas» ocupa una línea a 1280, 390 y 320 px. Se conservan los recuentos 19 de 19, 149 de 149 y 171 de 171, sin desborde horizontal. |

## Validación local y capturas

`npm run typecheck` y ambas compilaciones completaron correctamente. Pasaron 24 de 24 pruebas de contenido y 5 de 5 pruebas de sitio con Chrome 157 y Wrangler. La suite comprobó el orden de tabulación con el enlace al PDF, el foco de contacto, las rutas públicas y las evidencias.

La compilación entrega el retrato con HTTP 200 y `image/png`, con los mismos bytes de la fotografía entregada. Chrome mostró la imagen con el texto alternativo previsto. Se revisó el encuadre a 1280, 390 y 320 px, sin desborde ni errores de ejecución. Axe no detectó infracciones en las reglas A/AA evaluadas en Inicio.

La [galería local](../.local/revision-incremento-5b/index.html) reúne Inicio, CV y contacto, el pie actualizado de la precotización y la tabla de E04 publicada a 1280, 390 y 320 px. Incluye una captura del visor nativo. Los resultados HTTP de producción están en `.local/revision-incremento-5b/produccion.json`.

## PDF oficial

- Wrangler entrega directamente `/recursos/perfil/roberto-zamora-cv.pdf` con HTTP 200, `Content-Type: application/pdf` y `Content-Disposition: inline`. SHA-256 del original, la copia y la respuesta servida: `7d3b5e3a695ee204fd9e6e1d343588dae13aa9ae245551f018410309636adca7`.
- Las diez acciones «Ver CV» en las siete páginas públicas se activaron con Enter en Chrome con JavaScript bloqueado para el sitio. Cada acción abrió la URL directa en una pestaña nueva. El visor nativo mostró la página y presentó los controles de impresión y descarga. Los enlaces carecen del atributo `download`.
- Poppler identificó una página tamaño carta sin cifrado y la renderizó. Reportó advertencias sobre las fuentes Symbol y ArialUnicode en su entorno. Chrome mostró el documento en su visor. Se conservó el PDF entregado byte por byte.

## Pendientes tras el despliegue

- Repetir en el dominio público las comprobaciones del PDF, la fotografía y el correo cuando 5B esté desplegado. El titular del portafolio gestiona el commit y el push.
