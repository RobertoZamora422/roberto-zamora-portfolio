# Requisitos y validación

## Comportamiento del portafolio

- La presentación y las cuatro secciones numeradas de Inicio se pueden leer en HTML y abrir directamente por ancla. La cabecera compartida enlaza con la raíz, las secciones y el PDF.
- Desde Mi trabajo se llega a la ficha de RFM CORE, a la aplicación y al repositorio. La tarjeta de Claridez conduce a su repositorio.
- Cada caso publicado requiere un proyecto con ficha aprobada. La invitación aparece al final de esa ficha. El caso enlaza al proyecto, sus cuatro evidencias documentales y las anclas de ejemplos concretos.
- El CV se abre como PDF. WhatsApp, correo y los perfiles públicos funcionan mediante enlaces. Si el navegador permite copiar al portapapeles, cada control de copia anuncia el resultado.
- Las rutas antiguas se resuelven con HTTP 301. Una dirección inexistente devuelve HTTP 404 y ofrece un enlace a Inicio.
- Las pruebas inspeccionan el artefacto, el HTML inicial, los datos de navegación, las fuentes locales, los encabezados, la selección de contenido aprobado y la configuración con indexación habilitada o deshabilitada. El navegador recorre las tres páginas en 1440, 1280, 1024, 768, 390 y 320 píxeles.

El registro, sus relaciones y el prerenderizado se describen en [Arquitectura de información](arquitectura-de-informacion.md). Los comandos de validación están en el [README](../README.md).

## Criterios de calidad

| Área | Criterio y verificación |
| --- | --- |
| Accesibilidad | Objetivo WCAG 2.2 AA. Probar teclado, orden y visibilidad del foco, contraste, semántica, alternativas textuales, movimiento reducido donde aplique y redistribución a 320 px. Combinar auditoría automatizada y recorrido manual con lector de pantalla. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| Rendimiento | En Inicio y el caso más pesado, ejecutar Lighthouse tres veces con el mismo perfil móvil. Exigir medianas de LCP ≤ 2,5 s y CLS ≤ 0,1. Evaluar INP ≤ 200 ms al percentil 75 cuando haya suficientes datos de campo. [Core Web Vitals](https://web.dev/articles/vitals) |
| Navegación y usabilidad | Desde Inicio y desde una URL de caso compartida, identificar el perfil y un aporte, abrir su evidencia y encontrar el CV y el correo. Comprobar en móvil y escritorio, también con un solo proyecto y un solo caso publicados. Buscar revisores externos si hay disponibilidad. En su ausencia, realizar la revisión guiada con las mismas tareas y registrar método, fallos, correcciones y repetición de las comprobaciones afectadas. |
| Indexación y enlaces compartidos | Revisar que cada URL pública tenga HTML con su título, descripción, URL canónica y metadatos para compartir. El sitemap incluye solo URLs públicas canónicas y el documento indica el idioma español. |
| Privacidad y publicación | Inspeccionar los archivos reales de la compilación candidata, incluidos los archivos aprobados que se copian desde `recursos-contenido/`. Revisar HTML, datos de navegación, imágenes, PDF, metadatos, enlaces y acceso por URL directa a los recursos. Las vistas previas alojadas se limitan a material aprobado porque son públicas por defecto. [Recursos estáticos de Vite](https://vite.dev/guide/assets#the-public-directory) · [Vistas previas de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) |

## Condiciones de publicación

- Revisar la compilación candidata y sus recursos antes de autorizar la publicación. Confirmar un caso de negocio aprobado con al menos una evidencia autorizada que respalde un aporte personal. Confirmar el origen canónico y revisar el PDF oficial y los canales del perfil antes de publicar cambios.
- Tras publicar, verificar en producción los recorridos, las rutas y el 404, los enlaces a evidencias sin autenticación, HTTPS, los metadatos y el sitemap.
- Registrar la versión publicada y, cuando exista, identificar una versión anterior aprobada a la que se pueda volver si hay una regresión. [Reversión de despliegues en Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)
