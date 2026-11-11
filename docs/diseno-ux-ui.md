# Cierre de diseño UX/UI

**Estado · RZ. aprobado como dirección visual del incremento 2. Integración pendiente.**

## RZ. · Dirección vigente

La aprobación cubre la cabecera compartida, Inicio, Proyectos y la ficha individual en escritorio y móvil. La referencia archivada conserva la maqueta aprobada. [Maqueta RZ.](referencias/incremento-2/portafolio-rz.html)

| Elemento | Criterio aprobado |
| --- | --- |
| Identidad visual | **RZ.** como firma y enlace a Inicio, con el punto en verde. **Archivo Black** en titulares y **Geist** en lectura y controles. Fondo `#F2F1E9`, texto `#191E19`, verde `#30503C` para acciones y verde oscuro `#1A2E26` para superficies destacadas. |
| Cabecera | Inicio, Proyectos, Casos de estudio y Sobre mí en la navegación principal. **CV y contacto** como acceso destacado. En móvil, la firma y ese acceso ocupan la primera fila y los demás enlaces pasan a la siguiente. |
| Inicio | El nombre y la presentación profesional llevan el peso visual. El retrato acompaña a la izquierda y ocupa aproximadamente una quinta parte del ancho en escritorio. En móvil se mantiene pequeño junto al nombre. Después de la presentación aparecen los accesos a Proyectos y al CV, el proyecto destacado y las áreas de interés. |
| Proyectos | Catálogo con filas abiertas y divisores finos. Cada entrada muestra nombre, alcance y estado de consulta. |
| Ficha individual | Nombre y entradilla al abrir. Una franja reúne estado y tecnologías. El cuerpo distingue problema, solución y participación personal. |

La fotografía, el nombre público y los textos de perfil se incorporan según la aprobación editorial de cada recurso. La maqueta representa las rutas de Casos de estudio, Sobre mí y CV y contacto en la cabecera. [Condiciones de publicación](requisitos.md#condiciones-de-publicación)

## Cierre histórico de fase 2

### Dirección original

**Editorial contemporánea** como identidad principal. La composición combina titulares serif, fondo marfil y azul profundo con la estructura modular de **Estudio de producto**. De **Cuaderno de ingeniería** se adoptan los metadatos, las fichas de evidencia y los estados de documentación y validación.

La revisión final cubrió Inicio, el catálogo, una página de proyecto de RFM CORE, un caso de estudio completo y CV y contacto en escritorio, 390 px y 320 px. El repositorio conserva la [visualización original aprobada](referencias/fase-2/editorial-revision-final.html) del chat. Las comprobaciones del prototipo se repiten sobre la aplicación con los [requisitos de fase 1](requisitos.md).

### Sistema visual original

| Elemento | Criterio de implementación |
| --- | --- |
| Tipografía | **Instrument Serif** para el nombre profesional, titulares principales y acentos editoriales. **Instrument Sans** para lectura, secciones de casos, navegación y controles. **IBM Plex Mono** para metadatos, rutas y estados técnicos. |
| Escala | Texto base de 16 px con interlineado de 1,55. Titular principal fluido de 41 a 69 px, secciones de casos de 23 a 31 px y metadatos en torno a 12 px. Mantener la lectura de titulares largos, con acentos y a 320 px. |
| Color | Fondo marfil `#F8F5EE`, panel `#FFFDFA`, texto `#252720`, texto secundario `#50534D` y azul `#25416A` para enlaces, acción principal y foco. Divisor neutro `#D9D3C7`. |
| Evidencias y estados | Superficie técnica `#ECF0F5` con borde `#C9D2DF`. Cada estado lleva un rótulo textual. El tratamiento ámbar del prototipo identifica material de muestra en revisión interna. |
| Composición | Márgenes fluidos de 16 a 53 px, módulos con 14 a 23 px de relleno y radio de 8 px. Separar secciones con espacio y divisores finos. Las fichas del catálogo, los comparativos y las evidencias comparten esa lógica. |
| Interacción | Acción principal rellena en azul, secundaria con borde y enlaces reconocibles por su tratamiento. Mostrar foco visible y estado activo mediante subrayado, peso o borde además del color. Mantener controles utilizables con teclado y objetivos táctiles de 44 px en navegación y acciones principales. |

Centralizar tipografía, color, espaciado y estados en estilos compartidos. Reutilizar las mismas reglas en las páginas, los índices, el CV y el 404. Comprobar contraste y foco sobre las superficies finales.

### Patrones del prototipo original

| Vista | Jerarquía y comportamiento |
| --- | --- |
| Inicio | Presentar el nombre profesional y una propuesta de valor breve y comprobable. La condición de estudiante y las oportunidades buscadas aportan contexto. Mostrar accesos directos al caso destacado, CV y contacto, y un bloque modular para el proyecto principal. |
| Catálogo y proyectos | Resumir propósito y alcance en el catálogo. La ficha individual explica la solución, participación y estado verificable, con enlaces a casos disponibles. |
| Caso de estudio | Abrir con el problema, la contribución, el estado y una competencia principal cuando la evidencia la sustente. Organizar contexto, alternativas, decisión, evidencias, validación y aprendizajes en secciones con anclas. |
| Ficha de evidencia | Indicar qué demuestra, tipo, fuente o versión y cómo consultarla. Usar extracto desplegable o enlace según el recurso autorizado. Distinguir «Decisión documentada», «Criterio documentado» y resultados efectivamente validados. Las comprobaciones pendientes se identifican como tales. |
| CV y contacto | Mantener el CV HTML legible e imprimible, con un acceso directo al correo aprobado. Evaluar el PDF descargable antes del lanzamiento. |

La cabecera vincula el nombre con Inicio y mantiene accesos separados al CV y al contacto. En escritorio, el índice lateral del caso permanece visible durante la lectura cuando hay espacio, con la sección activa marcada visualmente y mediante `aria-current="location"`. La navegación principal usa `aria-current="page"` en la página actual.

En la composición estrecha, como en 390 y 320 px, la identidad, el CV y Contacto ocupan la primera fila y los enlaces principales pasan a la segunda. Los bloques pasan a una columna. El índice del caso se vuelve un desplegable en el flujo del documento e indica la sección activa cuando está cerrado. El cambio de composición se produce en torno a 620 px de ancho disponible. Se comprobarán el reflujo y el foco en la aplicación.

### Contenido previsto para lanzamiento

- Sustituir «Tu nombre» y los demás marcadores tras confirmar el nombre profesional, la propuesta de valor, el CV y el contacto públicos.
- Priorizar **RFM CORE** como proyecto destacado si su contenido está verificado y aprobado. Si queda pendiente y otro proyecto de negocio habilita el lanzamiento, destacar ese proyecto aprobado.
- Elegir el caso destacado por la evidencia de una competencia o aporte concreto. El caso del portafolio usado en el prototipo sirvió para revisar el diseño. El contenido de prueba, los casos ficticios y los marcadores quedan fuera de cualquier compilación destinada a publicarse.
