# Portafolio profesional de Ingeniería en Software

**Comprender problemas. Diseñar soluciones. Generar valor.**

Portafolio personal para oportunidades de pasantías y posiciones junior. Reúne proyectos, casos de estudio y evidencias que permiten examinar aportes concretos.

## Estado del proyecto

**Fase 3 · Incremento 2 listo para revisión.** Inicio, el catálogo y la ficha de proyecto se generan a partir del registro tipado. La revisión local permite recorrer las tres vistas mientras se aprueba el contenido de publicación.

| Documento | Qué encontrarás |
| --- | --- |
| [Definición del producto](docs/definicion.md) | Audiencia, alcance, criterios de éxito, fases y decisiones. |
| [Arquitectura de información](docs/arquitectura-de-informacion.md) | Rutas, recorridos, modelo de contenido y plantilla de casos. |
| [Requisitos y validación](docs/requisitos.md) | Comportamiento esperado, estrategia técnica y criterios de aceptación. |
| [Cierre de diseño UX/UI](docs/diseno-ux-ui.md) | Identidad aprobada, reglas visuales y patrones por vista. |
| [Plan técnico de fase 3](docs/plan-tecnico-fase-3.md) | Orden de implementación y comprobaciones por incremento. |
| [Informe del incremento 1](docs/informe-incremento-1.md) | Archivos, decisiones, comandos, resultados y comprobaciones pendientes. |
| [Informe del incremento 2](docs/informe-incremento-2.md) | Revisión visual, flujo editorial y resultados de las pruebas. |

## Desarrollo local

Usa la versión de Node indicada en `.node-version` y npm.

```text
npm ci
npm run dev
```

La vista de desarrollo incluye la ficha de Portafolio web y un resumen de caso para revisión. Para servir la compilación estática local con Wrangler, ejecuta lo siguiente.

```text
npm run typecheck
npm run build:prueba
npm run preview:prueba
```

Abre `http://127.0.0.1:8788/` y recorre Inicio → Proyectos → Portafolio web. Las fichas breves de RFM CORE y Claridez muestran sus descripciones confirmadas. La salida de revisión queda en `.local/prerender/client`. `npm run build` genera el artefacto público en `build/client` a partir del registro aprobado.

## Pruebas y capturas

```text
npm test
npx playwright-core install chromium
npm run revision:visual
```

`npm test` verifica el registro. `npm run test:sitio` verifica ambas compilaciones y los recorridos en Chromium y Wrangler. `npm run revision:visual` también genera una galería comparativa en `.local/revision-incremento-2/index.html`. Si usas un Chromium instalado, define `CHROMIUM_PATH` con la ruta a su ejecutable antes de ejecutar las pruebas de sitio.

## Registro de contenido

El modelo vive en `app/contenido/modelo.ts` y las entradas para publicación se incorporan a `app/contenido/publico.ts`. Aprueba la ficha y la página individual por separado. Inicio, catálogo y ficha toman sus textos de campos distintos de la misma entrada. Para adjuntar una evidencia local, referencia el archivo relativo a `recursos-contenido/` desde una evidencia aprobada. La compilación copia los archivos aprobados bajo `/recursos/` y valida los identificadores, las referencias y los archivos.

La preparación de RFM CORE y Claridez y la ficha de Portafolio web para revisión usan `app/pruebas/datos.ts`. El registro público se reserva para material autorizado. Los originales de negocio y los borradores sensibles se custodian fuera del repositorio.

El repositorio utiliza la rama `main`. El titular del portafolio gestiona los commits y el push. La configuración del despliegue se definirá al preparar la publicación.

La publicación pública requiere un caso de negocio aprobado, con evidencia verificable de un aporte personal, y la aprobación del perfil, el CV y el contacto.
