# Informe del incremento 2

**Estado · Implementado para revisión local**

## Revisión visual

Ejecuta `npm run build:prueba` y `npm run preview:prueba`. En `http://127.0.0.1:8788/`, recorre Inicio → Proyectos → Portafolio web. Inicio incluye el acceso al caso destacado de revisión y al CV. El contacto se mantiene en la cabecera. En Proyectos, cada fila resume el propósito y el estado. La ficha individual añade contexto, problema, propósito, solución, participación, tecnologías y enlaces a la documentación y al caso disponible.

`npm run revision:visual` genera `.local/revision-incremento-2/index.html` con el prototipo y la implementación en paralelo a 1280, 390 y 320 px. Las tres vistas conservan la tipografía, la paleta, la jerarquía y el reflujo de la referencia. La aplicación usa el marco de 1120 px de la base aprobada en el incremento 1. Los objetivos de interacción de 44 px y la longitud del contenido documentado aumentan la altura de algunos bloques.

Se archivó el HTML original de fase 2. Su SHA-256 coincide con el artefacto del chat y es `ccb211da19058ef9473e6d269249fbef11aa5c20eab461ab49374cf24f4e3b9b`. Para generar las capturas comparativas, el script carga las fuentes locales de la aplicación en ambas vistas. [Prototipo aprobado](referencias/fase-2/editorial-revision-final.html)

## Contenido y publicación

| Contenido | Estado en el incremento |
| --- | --- |
| Perfil | Inicio usa la formación, las oportunidades buscadas y el posicionamiento acordados. El modelo admite el nombre público, la formación detallada, la trayectoria, el correo y los perfiles cuando se aprueben. |
| RFM CORE | El catálogo local muestra el nombre y la descripción confirmada del sistema de gestión comercial y operativa. La ficha y sus aportes esperan revisión de texto y evidencia. RFM CORE tendrá prioridad en Inicio al disponer de una página aprobada. |
| Claridez | El catálogo local muestra el nombre y la descripción confirmada de la plataforma SaaS B2B para gestión de salones de eventos. La ficha y sus aportes esperan revisión de texto y evidencia. |
| Portafolio web | La ficha, el resumen de caso y el recurso documental de revisión se sirven en local. La participación descrita se limita a la aprobación del diseño y a la revisión técnica que realizó el titular. |
| Compilación pública | El catálogo presenta su estado vacío mientras se autoriza el contenido de los proyectos. El índice y la plantilla pública de casos, el perfil y el CV completos corresponden al incremento 3. |

El registro separa la aprobación de la ficha y la página de cada proyecto. Los slugs aprobados generan el prerenderizado y los enlaces. La portada, el catálogo y la ficha leen campos editoriales distintos. La compilación valida identificadores, campos obligatorios, referencias y aprobaciones entre entidades. Copia bajo `/recursos/` los archivos que pasan la validación de evidencia. El directorio `public/` está deshabilitado en Vite y el artefacto de revisión se genera en `.local/prerender/client` con `noindex`. [Modelo de contenido](../app/contenido/modelo.ts) · [Registro público](../app/contenido/publico.ts) · [Registro de revisión local](../app/pruebas/datos.ts)

## Verificaciones

Entorno local con Windows, Node.js 24.18.1, npm 11.16.0, Chromium 157.0.8103.39, Playwright Core 1.65.0, axe-core 4.14.0 y Wrangler 4.160.0. Los scripts están en `pruebas/` y las dependencias en el archivo de bloqueo. [Instrucciones de ejecución](../README.md#pruebas-y-capturas)

| Comando o recorrido | Resultado |
| --- | --- |
| `npm ci` y `npm run typecheck` | Reinstalación reproducible y comprobación de tipos correctas. npm informó 0 vulnerabilidades y avisó sobre scripts de instalación de esbuild y workerd. La compilación y Wrangler funcionaron en el entorno verificado. |
| `npm test` | 19 pruebas del registro pasaron. Cubren slugs duplicados e inválidos, aprobaciones independientes, prioridad de RFM CORE, referencias rotas o en borrador, textos requeridos y recursos ausentes o reservados a revisión local. |
| `npm run revision:visual` | Compilación pública y de revisión correctas. Pasaron las tres pruebas de sitio. La inspección del artefacto público y las peticiones a Wrangler confirmaron la exclusión de los datos, marcadores y recursos locales. |
| Vista de desarrollo de Vite | La ficha de Portafolio web y su recurso documental respondieron HTTP 200. |
| Compilación pública de un registro sintético en un directorio temporal | Un solo proyecto aprobado apareció en catálogo, con textos distintos en Inicio, catálogo y ficha. La ficha, su `_.data` y el recurso autorizado respondieron 200. El borrador, su recurso y un archivo colocado directamente en `public/` respondieron 404. Al retirar el recurso aprobado, la compilación falló con el diagnóstico esperado. |
| Recorridos y accesibilidad local | El catálogo, la ficha y el resumen del caso se recorrieron sin JavaScript. Con JavaScript se verificaron la navegación interna y sus peticiones `_.data`, el retroceso y la recarga. Se comprobaron el teclado, el enlace de salto, el foco, el ancla de contacto, las fuentes, los objetivos de 44 px y el reflujo a 1280, 390 y 320 px. Nueve auditorías de axe en las tres vistas dieron 0 infracciones. |
| `git diff --check` | Sin errores de espacios. |

La prueba de alojamiento en Cloudflare Pages, la revisión manual con lector de pantalla y las mediciones de rendimiento siguen programadas para la versión candidata. La publicación queda sujeta a la aprobación editorial prevista en los requisitos. [Plan técnico de fase 3](plan-tecnico-fase-3.md) · [Condiciones de publicación](requisitos.md#condiciones-de-publicación)
