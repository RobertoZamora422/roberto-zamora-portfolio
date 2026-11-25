# Portafolio de Roberto Zamora

Portafolio en español de Roberto Zamora, estudiante de Ingeniería de Software. Reúne proyectos, decisiones de diseño y evidencias de validación.

| Página | Contenido |
| --- | --- |
| `/` | Presentación, Mi trabajo, Cómo aporto, Sobre mí y Contacto. Incluye el acceso al repositorio de Claridez. |
| `/rfm-core/` | Contexto de Rancho Flor María, producto, tecnologías, participación personal y accesos a la aplicación y al repositorio. |
| `/rfm-core/caso-de-estudio/` | Decisiones, validación, resultados y cuatro evidencias del flujo comercial de RFM CORE. |

La cabecera de las tres páginas enlaza con las secciones de Inicio y con el CV oficial en PDF. El pie reúne los perfiles profesionales y el correo.

## Desarrollo y comprobación

Usa Node.js 24 según `.node-version`. Desde la raíz del repositorio ejecuta `npm ci` y `npm run dev`. Para comprobar la versión que recibirá un visitante de Cloudflare Pages, usa Wrangler sobre el artefacto compilado.

```sh
npm run typecheck
npm run build
npm test
npm run test:sitio
npm run preview
```

`npm run preview` sirve `build/client` en `http://127.0.0.1:8789/`. Las pruebas de sitio usan Chromium, Playwright, axe y Wrangler. Puedes instalar el navegador con `npx playwright-core install chromium` o indicar el ejecutable de Chrome o Chromium mediante `CHROMIUM_PATH`. Ejecuta `npm run revision:visual` para generar las 18 capturas y su galería en `.local/revision-editorial-rutas/index.html`.

## Contenido, evidencias y publicación

El registro de proyectos, casos y evidencias vive en `app/contenido/publico.ts`. Los textos de perfil y los recursos personales aprobados están en `app/contenido/perfil-publico.ts`. Cada proyecto con ficha aprobada puede publicar un solo caso de estudio en `/:proyecto/caso-de-estudio/`. La relación `caso.proyecto` determina su URL y el enlace de regreso. La compilación valida esa relación y copia desde `recursos-contenido/` los archivos aprobados. El PNG original del retrato queda como fuente editorial y el sitio entrega su versión WebP.

La arquitectura, los criterios de verificación y las variables de despliegue se documentan en [Arquitectura de información](docs/arquitectura-de-informacion.md), [Requisitos y validación](docs/requisitos.md) y [Cloudflare Pages](docs/propuesta-cloudflare-pages.md). Los informes de incrementos y las maquetas en `docs/` conservan el historial de diseño y de revisión de RFM CORE.
