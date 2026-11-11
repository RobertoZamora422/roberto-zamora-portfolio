# Incremento 3A · Casos de estudio y evidencias

## Implementación

- `/casos-de-estudio/` reutiliza las filas abiertas del catálogo de proyectos. Cada fila reúne título, proyecto, resumen y competencia cuando está documentada. El índice público presenta un estado vacío mientras el registro carezca de casos aprobados.
- `/casos-de-estudio/<slug>/` utiliza `contexto`, `alcance`, `decisiones`, `trabajo`, `validacion` y `resultadosYLimites`. El periodo, la competencia y los aprendizajes aparecen cuando constan en el registro. El caso enlaza a su ficha de proyecto cuando la página está aprobada, y la ficha enlaza a sus casos publicados.
- El índice lateral permanece visible durante la lectura a partir de 896 px. En anchos menores, un desplegable nativo presenta las mismas secciones. Los enlaces llevan al encabezado correspondiente y la sección activa se marca durante la lectura. El CV y el contacto siguen accesibles desde la cabecera y el pie.
- El catálogo, la cabecera del caso y las fichas de evidencia reutilizan las tipografías, los colores y los estilos de enlace de RZ. [Dirección visual y maqueta](diseno-ux-ui.md)

## Evidencias y aprobación

El componente de evidencia muestra el `tipo` del registro, la afirmación que respalda, la fuente o versión, la autoría y el enlace al recurso. El tipo permite distinguir una decisión documentada, un artefacto de análisis y documentación, una prueba o resultado verificable y una evidencia técnica. Las comprobaciones pendientes se describen en `validacion` o `resultadosYLimites` con su estado editorial explícito.

El catálogo, las rutas individuales, el caso destacado y los enlaces desde proyectos usan la misma selección de entradas aprobadas. El prerenderizado usa las URL con barra final para generar los datos `_.data` que solicita la navegación del sitio. Se conserva la validación del registro y la copia de recursos autorizados durante la compilación. El caso de Portafolio web y su evidencia documental se consultan en la vista de revisión local. La recopilación y aprobación de casos reales queda pendiente.

## Verificaciones

| Comando | Cobertura |
| --- | --- |
| `npm run typecheck` | Comprobación de tipos superada. |
| `npm test` | 20 pruebas del registro y la aprobación editorial superadas. |
| `npm run revision:visual` | Ambas compilaciones correctas y 3 pruebas de sitio superadas en Wrangler y Chromium. |

El registro aislado de pruebas verifica el HTML y los datos de casos aprobados, las referencias desde Inicio y Proyectos, el caso asociado a un proyecto con solo ficha de catálogo y la exclusión de borradores y recursos de revisión. La comprobación HTTP incluye las respuestas 404 de las rutas y los datos de los casos excluidos.

En Chromium se comprobaron fuentes, reflujo, objetivos táctiles, foco de teclado, navegación entre fichas y casos, saltos a secciones con y sin JavaScript, acceso a evidencias y a CV y contacto. Axe no detectó infracciones en los recorridos evaluados a 1280, 390 y 320 px, incluidos el estado vacío y el índice móvil desplegado.

La galería `.local/revision-incremento-3a/index.html` reúne los catálogos público y de revisión, el caso completo y el índice móvil desplegado. Se genera con `npm run revision:visual`.
