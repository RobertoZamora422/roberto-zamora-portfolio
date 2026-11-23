# Implementación V1 del portafolio de Roberto Zamora

## Resumen

La portada `/` reúne Presentación, Mi trabajo, Cómo aporto valor, Sobre mí y Contacto. «Del análisis a la solución.» abre el sitio junto al retrato profesional. Las fichas de RFM CORE y Claridez aparecen en Mi trabajo como ejemplos del perfil presentado.

La portada se integra en la aplicación existente de React, TypeScript, React Router y Vite. El HTML prerenderizado contiene las cinco secciones, los enlaces por ancla, el menú móvil, el correo y los accesos al PDF. Wrangler sirve el mismo artefacto estático que utiliza el flujo de Cloudflare Pages.

## Correspondencia con la maqueta

| Elemento | Implementación |
| --- | --- |
| Sistema visual | Fondo marfil `#F7F6F1`, superficies `#FFFEFA`, texto `#202722`, verde principal `#294C3B`, verde claro `#EAF0E9`, texto secundario `#4F5C52` y divisores `#D7DED5`. Contenedor máximo de 1160 px con márgenes adaptativos. |
| Cabecera y presentación | Marca RZ, cabecera fija al desplazarse, enlaces por ancla y cabecera móvil desplegable. Se conservaron la jerarquía tipográfica, el énfasis en cursiva, la foto con pie y la banda de tres dimensiones. |
| Mi trabajo | Tarjetas asimétricas en escritorio, panel operativo auténtico de RFM CORE y composición de Claridez en CSS con el rótulo «Recurso conceptual». La precotización sigue en la ficha técnica y en E01. |
| Cómo aporto valor y Sobre mí | Cuadrícula de cuatro capacidades y bloque verde claro con texto sobre la UDLA y Rancho Flor María, seguido de los datos resumidos. |
| Contacto | Banda verde oscura con «Trabajemos juntos.», correo prioritario, acceso al CV y enlaces sociales en el pie. |

El titular de Contacto se ajusta al ancho móvil para sostener las dos líneas de la maqueta. El original excedía su columna a 390 y 320 px. Los controles principales tienen al menos 44 px de altura, el foco tiene un contorno visible y se reforzó el contraste de los rótulos de trayectoria. Se conserva el desplazamiento suave con la preferencia estándar y se desactiva al solicitar movimiento reducido.

La tarjeta de RFM CORE ofrece la ficha local y un enlace independiente al repositorio. La fila de evidencia lleva a la sección correspondiente del caso real. Las nueve reglas son las documentadas en E02. Las 171/171 pruebas pertenecen al backend de RFM CORE en una ejecución específica de GitHub Actions sobre `a95ce07`, con SQLite en memoria y datos sintéticos. La ficha E04 permite consultar sus fuentes. [Ejecución documentada de RFM CORE](https://github.com/RobertoZamora422/rfm-core---django-react/actions/runs/43156998249)

Claridez tiene una ficha breve de proyecto en desarrollo y un enlace a su repositorio público. La aprobación alcanza el resumen y la composición conceptual de la maqueta. El recorrido técnico de RFM CORE conserva su alcance y documentación.

## Decisiones técnicas

- El registro tipado vincula la portada con el perfil aprobado, las tarjetas con sus fichas aprobadas y los indicadores con el caso aprobado. La validación comprueba la aprobación de la captura y la URL HTTPS de cada repositorio.
- Newsreader y DM Sans se instalan con Fontsource y versiones fijas. La portada carga sus fuentes locales. Las rutas interiores conservan sus estilos y fuentes.
- El menú móvil usa `details` y `summary`. Con JavaScript se cierra al elegir un enlace o pulsar Escape. Sin JavaScript se abre y cierra con el control nativo y los enlaces por ancla siguen disponibles.
- Los enlaces al CV llegan directamente al PDF publicado por el propio sitio. El correo usa un enlace `mailto:` desde el HTML. La portada y `/cv/` se sirven localmente con `Cache-Control: no-transform`, la excepción documentada para la ofuscación de Cloudflare. [Documentación de Cloudflare](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)
- WhatsApp solo aparece cuando el registro del perfil contiene un número profesional aprobado en formato internacional E.164. La V1 mantiene ese dato sin configurar.
- Los metadatos de Inicio reflejan el nuevo titular y la presentación. El control de indexación sigue a cargo de `PORTFOLIO_INDEXAR` y `PORTFOLIO_ORIGEN`. El artefacto local de revisión se generó con la indexación desactivada.

## Rutas y recursos preservados

| Acceso | Rutas y recursos |
| --- | --- |
| Navegación principal | `/#inicio`, `/#trabajo`, `/#aportacion`, `/#sobre-mi`, `/#contacto`. |
| Proyectos | `/proyectos/` y `/proyectos/rfm-core/`. |
| Casos | `/casos-de-estudio/` y `/casos-de-estudio/del-interes-comercial-al-contrato/`. La portada enlaza a su ancla `#evidencias`. |
| Evidencias | `/recursos/rfm-core/e01-proceso.html`, `e02-trazabilidad.html`, `e03-decisiones.html` y `e04-verificacion.html` en el mismo directorio. |
| Perfil y CV | `/sobre-mi/`, `/cv/`, `/cv/#contacto`, `/recursos/perfil/roberto-zamora-cv.pdf` y el retrato `roberto-zamora.webp` en el mismo directorio. |
| Recursos del sitio | `/favicon-rz-v2.ico` y `/favicon.ico`. La tarjeta social se copia al configurar un origen público. |
| Recuperación | `404.html` para servir el estado HTTP 404 en rutas desconocidas. |

## Archivos de la implementación

| Estado | Archivos |
| --- | --- |
| Creados | `app/inicio.css`, `app/ui/cabecera-inicio.tsx`, `docs/informe-implementacion-v1.md`. |
| Modificados | `app/routes/inicio.tsx`, `app/root.tsx`, `app/styles.css`, `app/ui/perfil.tsx`. |
| Modificados | `app/contenido/modelo.ts`, `app/contenido/perfil-publico.ts`, `app/contenido/publico.ts`, `app/contenido/seleccion.ts`, `app/contenido/validar.ts`. |
| Modificados | `package.json`, `package-lock.json`, `react-router.config.ts`, `pruebas/contenido.test.mjs`, `pruebas/sitio.test.mjs`, `pruebas/capturas.mjs`. |
| Eliminados | Ninguno. Los estilos de la portada anterior se retiraron de `app/styles.css`. |

## Resultados de verificación

| Comprobación | Resultado |
| --- | --- |
| `npm run typecheck` | Correcto. |
| `npm run build` | Correcto. HTML y datos de React Router generados en `build/client`. |
| `npm test` | 26 de 26 pruebas aprobadas. |
| `npm run test:sitio` | 6 de 6 pruebas aprobadas con Chromium 157.0.8103.79 y Wrangler 4.160.0. Incluye las compilaciones pública y de revisión. |
| Responsive y teclado | 1440, 1280, 768, 390 y 320 px sin desbordamiento horizontal. Se verificaron el foco, el salto al contenido, los enlaces por ancla bajo la cabecera, el cierre del menú con Escape y al elegir una sección, y los accesos sin JavaScript. También se comprobó el desplazamiento suave con la preferencia estándar. |
| Accesibilidad | axe sin infracciones en las reglas WCAG 2.2 A/AA ejecutadas a los cinco anchos y con el menú móvil abierto. La muestra de contraste dio 6,50 a 1 para texto secundario sobre marfil, 5,00 a 1 para rótulos sobre verde claro y 8,87 a 1 para texto secundario en Contacto. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| Metadatos y publicación | Portada, rutas interiores y evidencias verificadas en Wrangler. Una compilación aislada con origen canónico e indexación activada sirvió la imagen social, las 11 URL canónicas del sitemap y las etiquetas Open Graph de Inicio. La compilación entregada usa `noindex`. |
| Recursos y enlaces | PDF con publicación en línea y bytes idénticos al original, ambos favicon, dos capturas de RFM CORE y cuatro evidencias verificados. GitHub confirmó la disponibilidad pública de los repositorios y el perfil. El enlace de LinkedIn conserva el destino registrado. |

## Revisión local

La galería contiene 21 capturas. Incluye las páginas completas a 1440, 1280, 768, 390 y 320 px, las cinco secciones a 1440, 768 y 390 px y el menú abierto a 390 px. La carpeta `.local/revision-v1/` está ignorada por Git y queda fuera de `build/client`. [Galería de revisión](../.local/revision-v1/index.html)

Para revisar el sitio interactivo en la raíz del repositorio, ejecuta `npm run preview:candidata` y abre [la vista local en Wrangler](http://127.0.0.1:8789/). El artefacto local está en `build/client`. Para regenerar la galería, ejecuta `npm run revision:v1` con `CHROMIUM_PATH` apuntando a un Chromium instalado cuando corresponda.

## Problemas encontrados y pendientes

- En la validación inicial, axe detectó que los nombres accesibles de los enlaces de marca omitían las letras «RZ» visibles. Se incorporaron a los nombres de cabecera y pie.
- LinkedIn conserva la URL aprobada. El destino redirigió al muro de autenticación en la comprobación anónima, por lo que la vista del perfil quedó pendiente de verificación con sesión.
- Se verificaron el correo y la cabecera HTTP en Wrangler local. La comprobación de la respuesta en el dominio canónico queda para después de la publicación gestionada por el propietario.
- La revisión utilizó Chromium. Quedan para la siguiente etapa el contraste visual en otros motores y la evaluación conjunta de ajustes para V2.

## Estado de Git

Se partió de `main` con el árbol limpio, a la altura de `origin/main` y de la referencia anunciada por GitHub. Los cambios quedaron en `codex/rediseño-v1`, sobre `7a106a5c0aa8fa82e33d4b48117a59d5b538dfb2`. El cierre registró cero commits exclusivos a cada lado de `origin/main`. Quedaron 15 archivos modificados y 3 nuevos en el árbol de trabajo, todos pendientes de commit. La entrega fue local, sin push ni despliegue.
