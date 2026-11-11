# Informe del incremento 1

**Estado · Implementado, verificado en local y aprobado**

## Archivos

| Área | Archivos creados |
| --- | --- |
| Entorno y compilación | `.node-version`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `react-router.config.ts`. |
| Aplicación y estilos | `app/root.tsx`, `app/routes.ts`, `app/rutas.ts`, `app/styles.css`. |
| Elementos compartidos | `app/ui/cabecera.tsx`, `app/ui/elementos.tsx`. |
| Páginas base | `app/routes/inicio.tsx`, `app/routes/proyectos.tsx`, `app/routes/casos.tsx`, `app/routes/perfil.tsx`, `app/routes/cv.tsx`, `app/routes/no-encontrada.tsx`. |
| Prueba estática aislada | `app/pruebas/datos.ts`, `app/pruebas/proyectos.tsx`, `app/pruebas/proyecto.tsx`, `app/pruebas/casos.tsx`, `app/pruebas/caso.tsx`. |
| Documentación | `docs/informe-incremento-1.md`. |

También se actualizaron `.gitignore`, el [README](../README.md) y el [plan técnico](plan-tecnico-fase-3.md).

## Decisiones técnicas

- Node.js 24.18.1 y npm 11.16.0 en local. El lockfile fija React 19.3.1, React Router 8.5.1, Vite 8.3.8, TypeScript 7.0.2 y Wrangler 4.160.0. `isbot` queda declarado para que la entrada de renderizado predeterminada de React Router tenga disponible su dependencia desde la instalación reproducible.
- React Router en modo framework con `ssr: false`, prerenderizado en compilación y manifiesto inicial de rutas. El build mueve el HTML de recuperación a `404.html` y elimina el fallback SPA. Cloudflare Pages sirve las rutas estáticas y el estado 404. [Prerenderizado de React Router](https://reactrouter.com/how-to/pre-rendering) · [Rutas y 404 en Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- La compilación de prueba activa los módulos sintéticos y produce `.local/prerender/client`. La compilación base produce `build/client` con las rutas principales y excluye esos módulos. Ambas se construyen con la misma configuración.
- Las tres fuentes aprobadas se sirven desde el artefacto con Fontsource. Los estilos compartidos aplican la paleta, la escala editorial, los módulos, los indicadores de foco y el cambio de cabecera a dos filas a 620 px. El enlace de salto y el foco tras la navegación permiten llegar al contenido o al ancla de contacto con teclado.

## Comandos y resultados

| Comando o comprobación | Resultado |
| --- | --- |
| `npm install --include=dev`, `npm ci`, `npm ls --depth=0` | Instalación y reinstalación limpia correctas. El reporte de npm indicó 0 vulnerabilidades durante la instalación. |
| `npm run typecheck` | TypeScript pasó sin errores. |
| `npm run dev -- --port 5178 --strictPort` | La ruta dinámica del proyecto de prueba respondió HTTP 200 en Vite. |
| `npm run build:prueba` y `npm run build` | Ambas compilaciones terminaron correctamente. Se inspeccionaron HTML, JavaScript, CSS y archivos de navegación de la salida base para confirmar la exclusión de las rutas y textos de prueba. |
| `npm run preview:prueba -- --port 8788` | Wrangler sirvió la compilación estática de prueba en loopback. Los dos documentos prerenderizados y sus archivos `_.data` respondieron HTTP 200. Tres URLs desconocidas respondieron HTTP 404 con la página de recuperación. |
| `node .local/qa/verificar-incremento-1.mjs` | La prueba local en Chrome 157.0.8103.39 comprobó contenido y recuperación sin JavaScript, navegación interna con peticiones a `_.data`, retroceso, recarga y acceso a contacto mediante ancla. |
| Chrome y axe en ocho rutas | Sin desbordamiento a 1280, 390 y 320 px. Orden de tabulación, enlace de salto, foco visible, estado activo y altura de objetivos en cabecera comprobados. Las tres fuentes cargaron con caracteres en español. Dieciséis pasadas de axe con reglas WCAG A/AA detectaron 0 infracciones. |
| `git diff --check` | Sin errores de espacios. |

Para la prueba automatizada se instalaron `playwright-core@1.65.0` y `axe-core@4.14.0` en `.local/qa`. El script y las capturas pertenecen a esa carpeta ignorada por Git. Se pueden recorrer las mismas rutas manualmente con los comandos del README.

## Pendientes

- Repetir la prueba de rutas, `_.data` y HTTP 404 en una vista previa alojada de Cloudflare Pages cuando exista material autorizado. Wrangler verifica la salida local.
- El nombre profesional, la propuesta de valor definitiva y el correo quedan pendientes de contenido aprobado. Las páginas completas y el registro de contenido se abordarán después de revisar este incremento.
- La auditoría manual con lector de pantalla y las mediciones de rendimiento de la aplicación completa corresponden a la versión candidata. La prueba con axe cubre las reglas automatizadas de las rutas de este incremento.
