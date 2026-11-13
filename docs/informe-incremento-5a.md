# Incremento 5A · Portafolio RZ.

**Base de comparación** · `ea5108bb98cc8bd16cfafd9a8c8853579375a472`, verificado contra `origin/main` al iniciar el trabajo. La entrega es local. El titular gestiona commits, push y despliegue.

## Cambios

- Inicio conserva la identidad RZ., el nombre, la línea profesional, el lema, la paleta y las fuentes. Explica el aporte con acciones de RFM CORE y lleva directamente a la ficha, al caso y a sus evidencias. Las competencias aplicadas enlazan a E01–E04. Los intereses quedan en Sobre mí.
- Con un único proyecto publicado y hasta un caso, la cabecera lleva a la ficha con **Proyecto** y ofrece **Sobre mí** y **Contacto**. La marca lleva a Inicio. Con más entradas, reaparecen los enlaces a los catálogos. Se conservan las rutas de catálogos, fichas, caso y evidencias.
- **Contacto** abre `/cv/#contacto` desde la cabecera. **CV** en el pie lleva a `/cv/`, que contiene contacto y una síntesis del trabajo. Se evaluó `/contacto/` y se conservó el ancla existente para ofrecer un solo destino de contacto. Sobre mí y el contacto enlazan a GitHub y LinkedIn.
- La ficha de RFM CORE muestra dos pantallas auténticas con una explicación y acceso a cada imagen completa. El caso abre con problema, responsabilidad, decisiones, resultados verificables y acceso a evidencias. El detalle conserva reglas, escenarios, metodología, condiciones, commits, límites y atribuciones de E01–E04.
- El favicon RZ. usa Archivo Black y la paleta vigente. La tabla de E04 reserva el espacio necesario para el encabezado y los recuentos de la segunda columna. La compilación añade una corrección acotada a `/cv/` y `/cv` para el correo en Cloudflare. [Diagnóstico, verificación y regla condicional](propuesta-cloudflare-pages.md#correo-sin-javascript)

## Procedencia de las capturas

| Imagen | Fuente y alcance |
| --- | --- |
| [Panel operativo](../recursos-contenido/rfm-core/panel-operativo.webp) | React y API de Django de `a95ce07`, ejecutados en localhost desde una exportación de Git. Se desactivó la carga de `.env` y se comprobó el motor y la ubicación de una base SQLite nueva antes de migrar. Se sembraron dos cotizaciones y un contrato sintéticos. Chrome inició sesión con una cuenta local de demostración y la API del panel respondió 200. La captura se recortó a 1440 × 910 px y se guardó en WebP sin pérdida. Muestra el resumen y los accesos rápidos con datos de demostración. [Commit de RFM CORE](https://github.com/RobertoZamora422/rfm-core---django-react/commit/a95ce07fbf26023a70ddfbd3e52512ae58b3796f) |
| [Precotización pública](../recursos-contenido/rfm-core/precotizacion.png) | PNG de 1088 × 725 px extraído de E01 y comprobado byte por byte. La captura previa documenta el alta pública de servicio completo con paquete pendiente en una copia local con datos sintéticos. [Procedencia de E01](informe-revision-editorial-rfm-core-v2.md) |

La captura nueva se hizo con solicitudes de navegador limitadas al origen local y un backend de correo sin envío. Se revisaron ambas imágenes y los recursos del artefacto. El recorte contiene el alias visible de demostración, indicadores, navegación y acciones. Las credenciales, bases de datos y archivos de trabajo de la demostración quedan fuera de Git y del artefacto.

## Archivos modificados

| Archivos | Justificación |
| --- | --- |
| `app/contenido/modelo.ts`, `validar.ts`, `perfil-publico.ts`, `perfil.server.ts`, `publico.ts` | Registro tipado y aprobación de archivos, propuesta de valor, perfiles públicos, capturas y síntesis del caso. |
| `app/root.tsx`, `app/ui/cabecera.tsx`, `perfil.tsx`, `evidencias.tsx` | Navegación según el volumen de contenido, foco en anclas, enlace común al PDF y atribuciones en las evidencias. |
| `app/routes/inicio.tsx`, `perfil.tsx`, `cv.tsx`, `proyecto.tsx`, `caso.tsx`, `app/styles.css` | Composición y jerarquía de las cinco vistas con los estilos RZ. y reflujo responsivo. |
| `react-router.config.ts`, `recursos-contenido/sitio/favicon.ico` | Favicon estático, encabezado acotado para el correo y entrega en línea del PDF aprobado. |
| `recursos-contenido/rfm-core/panel-operativo.webp`, `precotizacion.png`, `e04-verificacion.html` | Imágenes de producto y corrección CSS de la tabla. |
| `package.json`, `pruebas/capturas.mjs`, `contenido.test.mjs`, `sitio.test.mjs` | Capturas comparativas y comprobaciones de navegación, recursos y contrato de publicación del PDF. |
| `README.md`, `docs/arquitectura-de-informacion.md`, `propuesta-cloudflare-pages.md`, `informe-incremento-5a.md` | Rutas vigentes, reproducción, Cloudflare y entrega. |

## Pruebas y revisión visual

| Comprobación | Resultado |
| --- | --- |
| TypeScript y compilación | `npm run typecheck` y compilaciones pública y de revisión aprobadas en Node 24.18.1. |
| Contenido y sitio | 24/24 pruebas de contenido y 5/5 de sitio. Chromium 157 y Wrangler local. |
| Navegación, teclado y accesibilidad | Tabulación y foco, saltos al contacto y evidencias, navegación hidratada, HTML con JavaScript desactivado, carga de fuentes y reflujo a 1280, 390 y 320 px. Axe no detectó infracciones en las reglas WCAG A/AA evaluadas. |
| Evidencias y artefacto | E01–E03 coinciden con la base Git. E04 conserva el cuerpo y las fuentes, con una regla CSS añadida a la cabecera. 33/33 URLs externas de evidencia respondieron 200. Las rutas privadas de revisión devuelven 404. Se comprobó la ausencia de PDF, ZIP, bases de datos y recursos locales de revisión en la salida 5A. |
| Favicon, capturas y tabla | Favicon y las dos imágenes responden 200 con tipo de imagen. Se verificaron dimensiones de las capturas y una sola línea para «Aprobadas» en los tres anchos. |
| Metadatos y sitemap | En una compilación aislada con el dominio vigente e indexación activada se comprobaron las 11 URLs del sitemap con HTTP 200, canónicas y Open Graph. Se verificaron 34 destinos internos y sus anclas, además de la tarjeta social. La candidata local conserva `noindex` y omite el sitemap sin origen de publicación. |
| Correo y enlaces externos | `mailto:` comprobado sin JavaScript en Wrangler. La respuesta vigente del dominio público reproduce la ofuscación. GitHub respondió 200. LinkedIn devolvió 999 a la consulta automatizada y se comprobó el destino exacto en el HTML. |

La galería local `.local/revision-incremento-5a/index.html` reúne 36 capturas. Compara Inicio, RFM CORE, caso, Sobre mí, CV y tabla de E04 a 1280, 390 y 320 px. Para reproducirla en otro entorno, compilar `ea5108b` con `npm ci` y `npm run build` en un checkout separado. Copiar el `build/client` resultante a `.local/incremento-5a-base/client` en el checkout de 5A o indicar su ubicación con `PORTFOLIO_BASE_5A`. Ejecutar `npm run revision:5a` con Chromium instalado o con `CHROMIUM_PATH` apuntando a Chrome.

## Decisiones pendientes e incremento 5B

- Revisar la comparación visual de 5A y la nueva captura del panel operativo.
- Entregar y aprobar el PDF oficial y el retrato. Registrar los archivos bajo `recursos-contenido/` mediante `perfil.cvPdf` y `perfil.retrato` en `app/contenido/perfil-publico.ts`. El retrato usa el marco existente, recorte proporcional y texto alternativo. En 5B se ajustará el encuadre a la foto entregada.
- Verificar con el PDF definitivo la apertura de todas las acciones **Ver CV** en una pestaña nueva con JavaScript desactivado, respuesta HTTP 200, `application/pdf`, disposición `inline` y controles nativos de impresión y descarga. Revisar también el retrato aprobado y la composición a los tres anchos. Entregar el informe y la galería de 5B con esos resultados.
- Tras desplegar 5A, verificar el correo sin JavaScript y el favicon en el dominio vigente. La regla de Cloudflare se reserva para el caso en que el borde siga reescribiendo el correo tras recibir `no-transform`. [Procedimiento para Cloudflare](propuesta-cloudflare-pages.md#correo-sin-javascript)
