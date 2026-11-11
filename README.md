# Portafolio profesional de Ingeniería en Software

**Comprender problemas. Diseñar soluciones. Generar valor.**

Portafolio personal para oportunidades de pasantías y posiciones junior. Reúne proyectos, casos de estudio y evidencias que permiten examinar aportes concretos.

## Estado del proyecto

**Fase 3 · Incremento 1 listo para revisión.** La configuración, el sistema de diseño base, la navegación y la prueba local de prerenderizado están implementados. La dirección visual combina Editorial contemporánea, la estructura modular de Estudio de producto y los componentes técnicos de Cuaderno de ingeniería.

| Documento | Qué encontrarás |
| --- | --- |
| [Definición del producto](docs/definicion.md) | Audiencia, alcance, criterios de éxito, fases y decisiones. |
| [Arquitectura de información](docs/arquitectura-de-informacion.md) | Rutas, recorridos, modelo de contenido y plantilla de casos. |
| [Requisitos y validación](docs/requisitos.md) | Comportamiento esperado, estrategia técnica y criterios de aceptación. |
| [Cierre de diseño UX/UI](docs/diseno-ux-ui.md) | Identidad aprobada, reglas visuales y patrones por vista. |
| [Plan técnico de fase 3](docs/plan-tecnico-fase-3.md) | Orden de implementación y comprobaciones por incremento. |
| [Informe del incremento 1](docs/informe-incremento-1.md) | Archivos, decisiones, comandos, resultados y comprobaciones pendientes. |

## Desarrollo local

Usa la versión de Node indicada en `.node-version` y npm.

```text
npm ci
npm run dev
```

La vista de desarrollo incluye un proyecto y un caso identificados como datos de prueba. Para servir la compilación estática de prueba con Wrangler, ejecuta:

```text
npm run typecheck
npm run build:prueba
npm run preview:prueba
```

Abre `http://127.0.0.1:8788/` y recorre Proyectos → Abrir proyecto de prueba → Abrir caso de prueba. La salida local queda en `.local/prerender/client`. `npm run build` genera la estructura base en `build/client`, con las rutas y los datos de prueba excluidos.

El repositorio utiliza la rama `main`. El titular del portafolio gestiona los commits y el push. La configuración del despliegue se definirá al preparar la publicación.

La documentación de RFM CORE y Claridez avanza en paralelo. La publicación pública requiere un caso de negocio aprobado, con evidencia verificable de un aporte personal, y la aprobación del perfil, el CV y el contacto. Los originales de negocio y los borradores sensibles se custodian fuera del repositorio.
