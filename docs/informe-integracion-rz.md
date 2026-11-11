# Integración de RZ. · Incremento 2

**Estado · Implementado y verificado en local, disponible para revisión visual.**

## Revisión visual

Se compararon Inicio, Proyectos y la ficha de Portafolio web a **1280, 390 y 320 px**. La galería reúne las 18 capturas en nueve pares. Se genera con `npm run revision:visual` y se abre en `.local/revision-rz/index.html`. Las capturas usan Archivo Black y Geist servidas desde la compilación local para ambas vistas. [Maqueta aprobada](referencias/incremento-2/portafolio-rz.html) · [Criterios de diseño](diseno-ux-ui.md#rz--dirección-vigente)

| Vista | Integración y diferencias respecto a la maqueta |
| --- | --- |
| Cabecera | Firma RZ. con punto verde, Inicio explícito, navegación activa y botón CV y contacto. En móvil, la firma y el botón pasan a la primera fila. El acceso directo a `#contacto` está en el pie compartido. |
| Inicio | Retrato secundario a la izquierda, nombre y presentación como foco, acciones, proyecto destacado y áreas de interés. El texto del proyecto viene del registro existente. La revisión local añade el caso destacado que ya formaba parte del recorrido. |
| Proyectos | Filas abiertas, divisores finos y primera posición para el proyecto destacado del registro. Se mantienen los resúmenes y estados existentes. Las fichas consultables muestran su estado además del enlace, por lo que la fila destacada tiene más altura. |
| Ficha individual | El título y la entradilla preceden a la franja de estado y tecnologías. El contexto y el propósito acompañan a las secciones de problema y solución. La longitud de los textos existentes y los enlaces a evidencias y casos relacionados amplían la ficha frente a la maqueta. |

El nombre, la presentación y las áreas de interés de la maqueta se usan en el registro de revisión local. La salida pública toma el perfil del registro autorizado o muestra la presentación base. El retrato es opcional y su archivo requiere aprobación propia y del perfil. La compilación local muestra un marco vacío mientras falta una fotografía aprobada. Los selectores de vista, tamaño y archivo pertenecen a la maqueta.

## Archivos modificados

| Área | Archivos |
| --- | --- |
| Fuentes y sistema visual | `package.json`, `package-lock.json`, `app/styles.css` |
| Cabecera, pie y elementos compartidos | `app/root.tsx`, `app/ui/cabecera.tsx`, `app/ui/elementos.tsx` |
| Vistas | `app/routes/inicio.tsx`, `app/routes/proyectos.tsx`, `app/routes/proyecto.tsx` |
| Modelo, selección de recursos y revisión local | `app/contenido/modelo.ts`, `app/contenido/registro.server.ts`, `app/contenido/validar.ts`, `app/pruebas/datos.ts` |
| Pruebas y capturas | `pruebas/contenido.test.mjs`, `pruebas/registro-fixture.mjs`, `pruebas/sitio.test.mjs`, `pruebas/capturas.mjs` |
| Documentación | `README.md`, `docs/diseno-ux-ui.md`, `docs/plan-tecnico-fase-3.md`, `docs/informe-incremento-2.md` y este informe |

## Verificaciones

Entorno local con Windows, Node.js 24.18.1, npm 11.16.0, Chromium 157.0.8103.39, Wrangler 4.160.0 y axe-core 4.14.0.

| Comprobación | Resultado |
| --- | --- |
| `npm ci` | Instalación limpia completada tras cerrar la vista previa anterior de Wrangler, que retenía `esbuild.exe`. npm informó cero vulnerabilidades y avisos sobre los scripts de instalación de esbuild y workerd. |
| `npm run typecheck` y `npm test` | Comprobación de tipos correcta y 20 pruebas de contenido superadas. La prueba del retrato comprueba la existencia del archivo y la aprobación de ambos registros. |
| `npm run revision:visual` | Compilación pública y de revisión correctas, tres pruebas de sitio superadas y nueve pares de capturas generados. |
| Desarrollo con Vite | Inicio, Proyectos, la ficha, las rutas de la cabecera y el recurso de evidencia local respondieron HTTP 200. |
| Artefacto público y recursos | La inspección excluyó el perfil de revisión, el marco de muestra, sus marcadores y los controles de la maqueta. Una compilación aislada sirvió un retrato sintético autorizado con HTTP 200 y devolvió HTTP 404 para un archivo de imagen sin autorización. |
| Rutas y navegación | Se comprobó HTML sin JavaScript, navegación interna con peticiones `_.data`, recarga, retroceso, rutas desconocidas con HTTP 404 real, estado activo de navegación y acceso con foco a `#contacto`. |
| Accesibilidad automatizada | Nueve auditorías de axe registraron cero infracciones. Se comprobó el orden de tabulación, el enlace de salto, el foco visible, la altura de 44 px en enlaces y la ausencia de desbordamiento horizontal a los tres anchos. Se verificó la carga de las fuentes con caracteres en español. |
| `git diff --check` | Sin errores de espacios. |

Casos de estudio, Sobre mí y CV conservan el alcance funcional del incremento 2 y reciben la cabecera y los estilos compartidos. El desarrollo de sus vistas completas sigue en el plan del incremento 3. La validación en Cloudflare Pages alojado y la revisión manual con lector de pantalla corresponden a la versión candidata. [Plan técnico](plan-tecnico-fase-3.md)
