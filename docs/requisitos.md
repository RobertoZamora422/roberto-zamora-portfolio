# Requisitos y validación

**Estado · Fase 1 cerrada a nivel documental**

## Requisitos funcionales

| Requisito | Aceptación |
| --- | --- |
| Navegación y recuperación | Desde Inicio y el índice se accede a los casos publicados. Desde el catálogo se accede a las páginas individuales publicadas y, desde estas, a sus casos disponibles. Funcionan el estado activo, el menú móvil, el acceso directo, la recarga y el retroceso. Una ruta desconocida devuelve HTTP 404 y ofrece un camino de regreso. |
| Proyectos, casos y evidencias | Cada página de proyecto aprobada presenta la solución, el estado y el alcance personal. Cada caso profundiza en un trabajo concreto y enlaza a su proyecto cuando la página está publicada. Las afirmaciones sustanciales sobre competencias, aportes y resultados se vinculan a evidencias accesibles sin iniciar sesión. |
| CV y contacto | Desde las páginas principales y desde cada caso se puede acceder directamente al CV y al contacto. El CV se puede leer e imprimir desde la web. El correo aprobado se puede seleccionar y abrir mediante un enlace. Antes del lanzamiento se evalúa un PDF descargable. Si se incorpora, debe abrir y coincidir con el contenido vigente. |
| Gestión de contenido | Un registro versionado genera rutas, listados y sitemap con el contenido aprobado. La compilación pública excluye pruebas, borradores y recursos sin aprobar. Falla ante slugs duplicados dentro de cada tipo de contenido, referencias inválidas o archivos requeridos ausentes. |

El [mapa del sitio y el modelo de contenido](arquitectura-de-informacion.md) detallan las rutas y sus relaciones.

## Estrategia técnica

React, TypeScript, Vite y Cloudflare Pages. El contenido se mantendrá en el repositorio y se publicará mediante compilaciones estáticas. El alcance inicial prescinde de un backend.

| Estrategia | Evaluación |
| --- | --- |
| SPA con renderizado en el navegador | Arranque sencillo. El contenido de cada caso depende de JavaScript y el fallback requiere cuidado para preservar un estado HTTP 404 real. [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) · [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) |
| Vite multipágina | Varias entradas HTML. Obtener contenido completo por caso requiere mantener entradas o añadir generación en compilación y sincronizar rutas y metadatos. [Vite](https://vite.dev/guide/build.html#multi-page-app) |
| React Router con prerenderizado estático | Genera HTML por ruta a partir del registro de contenido y permite compartir navegación y plantillas. Introduce convenciones de framework e hidratación. [React Router](https://reactrouter.com/how-to/pre-rendering) |

**Recomendación provisional aprobada.** React Router con `ssr: false` y prerenderizado de todas las rutas públicas. La compilación enumerará las rutas dinámicas de proyectos y casos a partir de los slugs aprobados. Cada página tendrá su contenido y metadatos en el HTML inicial. Se servirá el directorio cliente de la compilación en Cloudflare Pages con un `404.html` en la raíz. [React Router](https://reactrouter.com/how-to/pre-rendering) · [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)

**Primera comprobación de desarrollo**

1. Compilar una ruta dinámica de proyecto y una de caso. Inspeccionar el HTML generado y comprobar que el contenido y los metadatos estén presentes. Verificar que el contenido se pueda leer con JavaScript desactivado.
2. Probar acceso por URL directa, recarga, navegación interna entre catálogo, proyecto y caso, y retroceso. Verificar que los archivos estáticos de navegación que usa React Router, incluidos los archivos `.data` que genere, estén en el artefacto y se sirvan al navegar.
3. En Cloudflare Pages, comprobar que las rutas generadas respondan correctamente y que un slug desconocido devuelva HTTP 404 con la página de recuperación. Usar solo contenido autorizado en la comprobación alojada y datos de prueba en local.

Si cumplir esos criterios exige un servidor en ejecución o una capa de enrutamiento adicional, revisar la alternativa multipágina antes de ampliar la implementación.

## Criterios de calidad

| Área | Criterio y verificación |
| --- | --- |
| Accesibilidad | Objetivo WCAG 2.2 AA. Probar teclado, orden y visibilidad del foco, contraste, semántica, alternativas textuales, movimiento reducido donde aplique y redistribución a 320 px. Combinar auditoría automatizada y recorrido manual con lector de pantalla. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| Rendimiento | En Inicio y el caso más pesado, ejecutar Lighthouse tres veces con el mismo perfil móvil. Exigir medianas de LCP ≤ 2,5 s y CLS ≤ 0,1. Evaluar INP ≤ 200 ms al percentil 75 cuando haya suficientes datos de campo. [Core Web Vitals](https://web.dev/articles/vitals) |
| Navegación y usabilidad | Desde Inicio y desde una URL de caso compartida, identificar el perfil y un aporte, abrir su evidencia y encontrar el CV y el correo. Comprobar en móvil y escritorio, también con un solo proyecto y un solo caso publicados. Buscar revisores externos si hay disponibilidad. En su ausencia, realizar la revisión guiada con las mismas tareas y registrar método, fallos, correcciones y repetición de las comprobaciones afectadas. |
| Indexación y enlaces compartidos | Revisar que cada URL pública tenga HTML con su título, descripción, URL canónica y metadatos para compartir. El sitemap incluye solo URLs públicas canónicas y el documento indica el idioma español. |
| Privacidad y publicación | Inspeccionar los archivos reales de la compilación candidata, incluidos los recursos copiados desde `public/`. Revisar HTML, datos de navegación, imágenes, PDF, metadatos, enlaces y acceso por URL directa a los recursos. Las vistas previas alojadas se limitan a material aprobado porque son públicas por defecto. [Recursos estáticos de Vite](https://vite.dev/guide/assets#the-public-directory) · [Vistas previas de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) |

## Condiciones de publicación

- Revisar la compilación candidata y sus recursos antes de autorizar la publicación. Confirmar un caso de negocio aprobado con al menos una evidencia autorizada que respalde un aporte personal. Confirmar también perfil, CV, decisión sobre el PDF, correo y URL pública.
- Tras publicar, verificar en producción los recorridos, las rutas y el 404, los enlaces a evidencias sin autenticación, HTTPS, los metadatos y el sitemap.
- Registrar la versión publicada y, cuando exista, identificar una versión anterior aprobada a la que se pueda volver si hay una regresión. [Reversión de despliegues en Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)
