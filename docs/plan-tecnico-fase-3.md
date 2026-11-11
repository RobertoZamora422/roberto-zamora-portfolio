# Plan técnico de fase 3

**Estado · Incremento 1 aprobado. Integración de RZ. en el incremento 2 disponible para revisión.**

La fase desarrolla la [dirección visual aprobada](diseno-ux-ui.md) con React, TypeScript y Vite sobre Cloudflare Pages. La preparación de contenido de negocio avanza en paralelo. Los [requisitos de fase 1](requisitos.md) y sus condiciones de publicación son los criterios de aceptación.

## Incremento 1 · Configuración, estilos base y navegación

1. **Configuración reproducible.** Usar el repositorio existente, Node.js 24 y npm con archivo de bloqueo. Confirmar la compatibilidad de las versiones estables al instalarlas y registrar la versión de Node usada localmente y en Pages. Habilitar instalación reproducible, servidor de desarrollo, verificación de tipos y compilación estática. [Requisitos de Vite](https://vite.dev/guide/) · [Entorno de compilación de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-image/)
2. **Sistema de diseño base.** Implementar los estilos compartidos de tipografía, color, espaciado, foco y reflujo. Preparar los bloques y acciones reutilizables que necesita la estructura inicial. Aplicar las familias aprobadas y comprobar caracteres en español, contraste y nombres largos.
3. **Estructura principal.** Preparar cabecera, enlace para saltar al contenido, navegación y área principal. Conectar las rutas principales del [mapa del sitio](arquitectura-de-informacion.md) en la vista de desarrollo, incluidos los accesos separados a CV y contacto y la recuperación desde 404. Usar una estructura mínima en las rutas hasta que les corresponda su incremento de contenido.
4. **Prueba de prerenderizado.** Probar React Router en modo framework con `ssr: false`. Prerenderizar un proyecto y un caso con slugs dinámicos y carga de datos en compilación. Usar datos de prueba aislados del registro público y una salida de prueba separada del artefacto de publicación. Servir la salida con `wrangler pages dev` y un `404.html` en la raíz. [React Router](https://reactrouter.com/how-to/pre-rendering) · [Cloudflare Pages en local](https://developers.cloudflare.com/pages/functions/local-development/) · [Rutas y 404 en Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)

**Salida verificable.** Una instalación con `npm ci` puede verificar tipos y compilar. La cabecera y la navegación se recorren con teclado y funcionan a 320 px y en escritorio. La prueba local confirma HTML legible sin JavaScript, acceso directo, recarga, navegación interna y retroceso, respuestas a las peticiones de los archivos de navegación `.data` y HTTP 404 real para un slug desconocido. Registrar la comprobación y cualquier desviación antes de ampliar las páginas.

La prueba en el alojamiento real se hará cuando haya contenido autorizado para una vista previa. Si la prueba local o la alojada requiere un servidor en ejecución o una capa adicional de enrutamiento, revisar Vite multipágina antes de continuar con esa estrategia. La prueba alojada sigue siendo necesaria antes de aprobar una versión pública.

El [informe del incremento 1](informe-incremento-1.md) registra las pruebas ejecutadas y sus resultados.

## Incremento 2 · Contenido, Inicio y Proyectos

- Implementar el registro TypeScript de perfil, proyectos, casos y evidencias según el [modelo acordado](arquitectura-de-informacion.md). Generar rutas y listados desde las entradas aprobadas. Detectar slugs duplicados por entidad, referencias inválidas y archivos requeridos ausentes.
- Construir Inicio, el catálogo y la plantilla de proyecto. Preparar los espacios para nombre y propuesta de valor, caso destacado y proyecto principal. Priorizar RFM CORE al disponer de contenido verificado y aprobado.
- Aplicar la dirección RZ. a Inicio, el catálogo, la ficha y la cabecera compartida. Comparar la integración con la maqueta aprobada en escritorio, 390 px y 320 px. [Dirección vigente](diseno-ux-ui.md#rz--dirección-vigente)

**Salida verificable.** Un proyecto aprobado aparece en el catálogo y se puede abrir por enlace directo. Una página en borrador queda fuera de rutas, enlaces y compilación pública. Con un solo proyecto, Inicio, catálogo y ficha presentan información distinta. La compilación pública excluye los datos de prueba, sus recursos y los marcadores.

El [informe del incremento 2](informe-incremento-2.md) registra el contenido y las pruebas iniciales. El [informe de integración de RZ.](informe-integracion-rz.md) documenta la implementación vigente y su comparación visual.

## Incremento 3 · Casos, evidencias, perfil y CV

- Construir el índice y la plantilla completa de casos. Integrar el resumen con competencia, el índice lateral con estado activo, su versión móvil plegable y las fichas de evidencia con fuente y consulta. Distinguir evidencia documental de resultados verificados y de comprobaciones pendientes.
- Completar Sobre mí y el CV HTML imprimible. Conectar el correo y los perfiles cuando se aprueben. Generar títulos, descripciones, URL canónica, metadatos para compartir y sitemap a partir de las rutas públicas.

**Salida verificable.** Desde Inicio y desde un caso compartido se puede identificar un aporte, abrir su evidencia y acceder al CV y al contacto. Los recorridos funcionan en escritorio, 390 px y 320 px, incluso con un solo caso. El índice es navegable por teclado y los saltos y estados activos coinciden con las secciones. El CV se imprime correctamente y los metadatos están en el HTML inicial.

## Incremento 4 · Verificación y versión candidata

- Ejecutar la auditoría de accesibilidad, los recorridos manuales y con lector de pantalla, y las mediciones de rendimiento previstas en los requisitos. Registrar el entorno de Lighthouse y comprobar LCP y CLS con el perfil móvil acordado. Evaluar INP cuando existan datos de campo suficientes.
- Inspeccionar el artefacto público, incluidos HTML, `.data` y recursos copiados desde `public/`. Comprobar que rutas, enlaces, sitemap y recursos corresponden al contenido aprobado. Repetir las pruebas de prerenderizado, navegación, recarga y HTTP 404 en una vista previa de Cloudflare Pages con material autorizado.

**Salida verificable.** La versión candidata supera los controles de fase 1 en la aplicación implementada. Quedan identificados el caso de negocio con evidencia autorizada, el perfil, CV, correo, decisión sobre el PDF y URL pública para la aprobación de publicación. La verificación en producción corresponde a la fase 4.

El titular del portafolio conserva el control de los commits y del push. El incremento 3 se abre tras la revisión del incremento 2.
