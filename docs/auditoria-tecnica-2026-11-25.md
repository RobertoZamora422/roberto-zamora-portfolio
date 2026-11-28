# Auditoría técnica del portafolio · 25 de noviembre de 2026

La candidata local conserva las tres páginas prerenderizadas y reduce el artefacto en **257.193 bytes (10,17 %)**. La publicación y la decisión sobre páginas inexistentes siguen pendientes de autorización.

## Referencia y alcance

La rama `main` comenzó limpia, con 70 archivos versionados. HEAD, `origin/main` y la referencia consultada directamente en GitHub coincidían en `eb5dfb0926bf43807fd4a9e4f37814ca06ac1449`. Se revisaron la aplicación, los controles de contenido y despliegue, las pruebas, el lockfile, los documentos y las referencias históricas. El inventario incluyó los originales de `Recursos/`, la revisión editorial ignorada, compilaciones, cachés y herramientas de `.local/`. Se preservaron los originales, las capturas de revisión y el material con valor documental. [Commit de referencia](https://github.com/RobertoZamora422/roberto-zamora-portfolio/commit/eb5dfb0926bf43807fd4a9e4f37814ca06ac1449)

## Hallazgos y correcciones

Las ubicaciones corresponden a la candidata. Los defectos de gravedad media afectaban a los controles de publicación y verificación. Ninguno evidenció una filtración en el sitio publicado.

| Gravedad | Ubicación | Problema, impacto y corrección |
| --- | --- | --- |
| Media | `react-router.config.ts:12`, `app/contenido/publicacion.ts:4` | Al superar 99 exclusiones, el build descartaba rutas silenciosamente. Ahora valida el total de 100 reglas y la longitud de 100 caracteres antes del prerender. Una prueba cubre los límites exactos y sus excesos. El sitio actual utiliza una inclusión y 17 exclusiones. |
| Media | `vite.config.ts:15`, `app/contenido/validar.ts:73` | El servidor de desarrollo admitía rutas directas al directorio de originales. Vite limita los archivos servibles a sus módulos y a los recursos aprobados, con las mismas URLs públicas para el favicon y la tarjeta. El validador comprueba también el destino real de archivos en directorios reservados y rechaza credenciales en enlaces HTTPS antes de serializarlos. |
| Media | `.github/workflows/calidad.yml:1` | GitHub mostraba cero workflows y un check correcto de Cloudflare Pages. Se añadió CI de solo lectura para pull requests y cambios en `main`, con Node fijado por `.node-version`, instalación limpia, tipos, pruebas, auditoría npm y compilación de sitio con Chromium y Wrangler. Las dos acciones oficiales están fijadas por SHA. La primera ejecución en GitHub requiere publicar la revisión. |
| Baja | `app/root.tsx:3`, `app/inicio.css:1` | Se empaquetaban cinco WOFF2 de latín extendido y vietnamita ajenos al contenido. Se conservaron los archivos latinos originales de DM Sans y Newsreader, sus pesos, la cursiva y el eje óptico, además de Archivo Black. Los cinco archivos sumaban 255.528 bytes. |
| Baja | `app/routes/inicio.tsx:11`, `app/contenido/perfil-publico.ts:3` | El título HTML y Open Graph de Inicio estaba en inglés. Ahora usa «Roberto Zamora · Estudiante de Ingeniería de Software». Una sola constante alimenta las dos apariciones del semestre con la misma redacción visible. El CV concuerda en identidad, formación, etapa y canales. |
| Baja | `react-router.config.ts:26–54` | El build repetía la selección de perfil y evidencias. Ahora reutiliza la selección aprobada del registro. Las evidencias en revisión incluyen `noindex` también en el HTML. Se mantiene la aprobación independiente de cada documento. |
| Baja | `recursos-contenido/rfm-core/e01-proceso.html:60` | El diagrama reservaba 1400 × 2400 px para un PNG de 1400 × 2392. Se corrigió la altura y Chrome compara las dimensiones declaradas y naturales de las imágenes de E01. Los PNG incrustados y los textos se conservaron. |
| Baja | `pruebas/sitio.test.mjs:69`, `:456` | La prueba de recursos solo excluía algunas extensiones. Ahora comprueba el conjunto exacto de archivos públicos de la vista previa. El test de contacto también deniega el portapapeles y verifica el aviso accesible con el dato que se puede copiar manualmente. |
| Mantenimiento | `tsconfig.json:11`, `app/contenido/modelo.ts`, `pruebas/registro-fixture.mjs`, `app/styles.css`, `docs/informe-incremento-2.md` | Se activaron los dos controles de elementos sin uso de TypeScript, se retiraron cuatro exportaciones de tipos, tres exportaciones de datos de prueba y una declaración CSS redundante. Un enlace documental vuelve a abrir la fuente de su revisión histórica. |

La inconsistencia de redirección señalada en la revisión externa ya estaba resuelta en el commit inicial. `app/rutas.ts:15` y `pruebas/sitio.test.mjs:31` apuntan al caso. Las seis rutas antiguas, con y sin barra, devolvieron **12/12 HTTP 301** con sus destinos exactos en el dominio público y en Wrangler. [Matriz de redirecciones](propuesta-cloudflare-pages.md#compatibilidad-de-enlaces)

## Artefacto y rendimiento

Comparación de dos compilaciones limpias, sin origen ni indexación, sobre `build/client`. Los JS de la tabla son los archivos del navegador en `assets/`. La suma gzip comprime cada archivo individualmente.

| Medida | Antes | Después |
| --- | ---: | ---: |
| Archivos y bytes totales | 45 · 2.529.180 B | 40 · 2.271.987 B |
| Fuentes en disco | 10 · 602.940 B | 5 · 347.412 B |
| JS cliente, bruto / gzip | 382.240 / 122.287 B | 382.249 / 122.291 B |
| CSS, bruto / gzip | 26.868 / 5.800 B | 25.020 / 5.531 B |
| Datos de navegación | 18.408 B | 18.408 B |

Lighthouse 13.6.0, Chrome 158, Wrangler en loopback, caché fría y tres pasadas por página y versión. Perfil móvil simulado de 412 × 823, RTT de 150 ms, 1.638,4 kb/s y CPU ×4. Las métricas siguientes son medianas de laboratorio.

| Página | LCP antes → después | CLS antes → después | Rendimiento /100 antes → después | Solicitudes antes → después |
| --- | ---: | ---: | ---: | ---: |
| Inicio | 1.187 → 1.186 ms | 0 → 0 | 97 → 93 | 18 → 18 |
| RFM CORE | 1.122 → 1.088 ms | 0 → 0 | 98 → 99 | 18 → 18 |
| Caso | 1.145 → 1.132 ms | 0 → 0 | 99 → 97 | 15 → 15 |

Todas las medianas cumplen LCP ≤ 2,5 s y CLS ≤ 0,1. Las puntuaciones variaron en ambos sentidos y las diferencias de LCP son pequeñas frente a la dispersión entre pasadas. Inicio ya solicitaba únicamente las cuatro caras WOFF2 latinas. El ahorro principal corresponde al artefacto. Se conservaron la carga diferida de capturas, el espacio reservado al retrato, los nombres de assets con hash y la revalidación de Pages. Los datos de campo de LCP e INP quedan sin medir. Los 18 JSON originales están en `.local/auditoria-20261125/`.

## Limpieza y recursos

| Directorio bajo `.local/` | Motivo | Archivos | Bytes |
| --- | --- | ---: | ---: |
| `favicon-rz/perfil-{chrome,edge}-{antes,despues}`, variantes normal y `-1x` | Ocho perfiles temporales creados para capturar pestañas | 1.598 | 220.827.957 |
| `auditoria-final-rz/chrome-pdf-HmXAbw` y `chrome-pdf-I0dOnM` | Perfiles temporales del visor PDF | 348 | 39.839.587 |
| `chrome-visor-5b-UFGSrU` | Perfil generado por la prueba de visor del incremento 5B | 192 | 17.033.527 |
| `repro-incremento-4/{node_modules,build,.react-router}` | Dependencias instaladas y salidas regenerables de una reproducción histórica cuyo código y lockfile se conservaron | 6.580 | 298.018.241 |
| **Total retirado** | **14 directorios identificados individualmente** | **8.718** | **575.719.312** |

El inventario por archivo está en `.local/auditoria-20261125/eliminados.csv`. No hubo bajas de archivos versionados ni cambios en dependencias, lockfile o reglas de Git. Las maquetas versionadas documentan aprobaciones previas. El PNG original del retrato permanece como fuente. El artefacto de revisión incluye únicamente el PDF, el retrato WebP, las dos capturas y E01–E04 bajo `recursos/`. El modo con origen añade la tarjeta social. El PDF servido coincide con los bytes del original. Se revisaron la navegación, los retornos, las anclas y los 31 rangos de líneas citados en 13 combinaciones de archivo y commit. Los enlaces de aplicación y repositorios respondieron correctamente. LinkedIn respondió 999 a la consulta automatizada.

## Verificación, indexación y decisiones

| Comprobación | Línea base | Candidata |
| --- | --- | --- |
| `npm ci`, `npm run typecheck`, `npm run build` | Correctas | Correctas con Node 24.18.1 y npm 11.16.0 |
| `npm test` | 30/30 | 32/32 |
| `npm run test:sitio` | 5/5 grupos | 5/5 grupos en 122,6 s, sin omisiones |
| `npm audit`, incluidas dependencias de desarrollo | 0 vulnerabilidades reportadas | 0 vulnerabilidades reportadas |
| Comparación visual en Chromium | 3 páginas × 6 anchos | 18/18 capturas de página completa con idénticos píxeles |

La suite recorrió Inicio, proyecto, caso y E01–E04 en 1440, 1280, 1024, 768, 390 y 320 px. Axe no detectó infracciones en los criterios automatizados WCAG hasta 2.2 AA que cubren las pruebas. Se revisaron capturas, teclado y foco, menú, índice, anclas, navegación hidratada, enlaces con JavaScript desactivado, PDF, correo, WhatsApp y copia con permiso concedido y denegado. En producción tampoco se observó desbordamiento horizontal en las siete páginas. No se realizó una sesión con lector de pantalla ni se enviaron mensajes. Una ejecución intermedia detectó que E01 había cambiado después de compilar. La reconstrucción completa pasó su comparación de integridad. La salida final y las capturas quedan en `.local/auditoria-20261125/`.

Knip 6.48.0 se ejecutó desde la caché de npm. Tras retirar las tres exportaciones de prueba, quedaron cuatro avisos contrastados con los consumidores reales. Dos paquetes suministran las fuentes referenciadas por CSS, axe se resuelve dinámicamente en Playwright y el export por defecto del Worker es la entrada de Cloudflare. El prerender usa también `isbot` y `@react-router/node` a través de la plantilla oficial de React Router. La instalación npm avisó sobre los scripts de esbuild y workerd pendientes de declaración en `allowScripts`; la compilación y Wrangler funcionaron con la configuración actual. El escaneo del artefacto y las pruebas con borradores sintéticos no encontraron material interno publicado.

El 25 de noviembre, el dominio canónico sirvió las tres páginas y cuatro evidencias con HTTP 200, canonical y Open Graph propios, tarjeta PNG accesible y `X-Robots-Tag: noindex`. Las tres páginas incluían además el meta robots. `robots.txt` permitía rastreo y `/sitemap.xml` respondía 404. El CV abrió inline y recibió `noindex, noindex`, redundancia de efecto equivalente a `noindex`. Tanto el alias público de Pages como la URL específica del despliegue devolvieron `noindex`. El origen efectivo se identifica en los canonical. El valor efectivo de indexación corresponde al modo desactivado. La configuración privada del panel no se inspeccionó. [Dominio público](https://robertozamora.claridez.com/) · [Despliegue comprobado](https://39d7c943.roberto-zamora-portfolio.pages.dev/)

1. **Indexación pendiente de autorización.** En una compilación solo local, `PORTFOLIO_ORIGEN=https://robertozamora.claridez.com` y `PORTFOLIO_INDEXAR=1` produjeron siete entradas distintas, canonical y OG concordantes, tarjeta de 1200 × 630 y CV con `noindex`. Las instrucciones de Production y Preview están en la guía de Cloudflare. [Configuración de publicación](propuesta-cloudflare-pages.md)
2. **404 pendiente de aprobación.** Se recomienda una página estática breve, con un encabezado y un enlace a Inicio. Una copia aislada sin `_worker.js` ni `_routes.json` devolvió 404 reales, mantuvo los doce 301, las tres páginas, los tres `_.data` y la navegación cliente. Las solicitudes de recursos o datos ausentes también recibieron cuerpo HTML, aspecto que cambiaría el contrato actual de respuesta vacía. Si se aprueba, se podrían retirar el Worker, su manifiesto y la clasificación de solicitudes de navegación en Vite, manteniendo la paridad de desarrollo y ajustando sus pruebas. La candidata conserva el 302 vigente. [Comportamiento de Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) · [Límites de reglas](https://developers.cloudflare.com/pages/functions/routing/)

En la comprobación de cierre se recorrieron las siete páginas con Chrome y emulación táctil local a 320, 390 y 768 px. Las 21 visitas respondieron 200 sin desbordamiento. Se activaron por toque el menú cuando estaba visible y el índice del caso. La prueba en un teléfono o tableta físicos y el recorrido manual con lector de pantalla siguen sin verificar. Wrangler informó que carecía de sesión autenticada para consultar los valores guardados en Cloudflare. Al abrir el perfil de LinkedIn en Chrome sin sesión, el servicio volvió a responder 999.

**Estado final de Git.** `main` continúa en el commit de referencia, con 0 commits de adelanto y 0 de retraso respecto de `origin/main`. Hay 17 archivos versionados modificados y dos nuevos, el workflow y este informe. El área de preparación está vacía. Los cambios permanecen locales, pendientes de revisión. La publicación remota conserva su configuración anterior.
