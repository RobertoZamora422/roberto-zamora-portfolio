# Arquitectura de información

**Estado · Fase 1 cerrada a nivel documental**

## Mapa del sitio

| Ruta | Función |
| --- | --- |
| `/` | Presentación en español, perfil y oportunidades buscadas, caso destacado y accesos directos al CV y al contacto. |
| `/proyectos/` | Catálogo breve de fichas autorizadas. Resume el propósito y el estado confirmado de cada proyecto y enlaza a su página individual cuando está publicada. |
| `/proyectos/<slug>/` | Página individual con identidad propia. Presenta problema, contexto, propósito, solución, participación personal, tecnologías cuando aporten contexto, estado verificable y enlaces a los casos publicados. |
| `/casos-de-estudio/` | Índice de trabajos concretos. Cada entrada adelanta el aporte y la decisión, validación o evidencia que se puede examinar. |
| `/casos-de-estudio/<slug>/` | Caso compartible sobre competencias, decisiones o procesos concretos, con la evidencia pertinente y enlace a su proyecto cuando la página esté publicada. |
| `/sobre-mi/` | Formación e intereses, con enlaces a ejemplos de competencias demostradas cuando estén disponibles. |
| `/cv/` | CV en HTML imprimible, perfiles autorizados y PDF descargable si se aprueba una versión pública. |
| `/cv/#contacto` | Correo profesional visible y seleccionable, con enlace directo mediante `mailto:`. |
| `404.html` | Página de recuperación con enlaces a Inicio y Casos de estudio. El alojamiento la sirve con estado HTTP 404 para rutas desconocidas. |

Las rutas de proyecto previstas son `/proyectos/rfm-core/`, `/proyectos/claridez/` y `/proyectos/portafolio-web/`. Cada ruta se generará cuando su contenido esté disponible y aprobado.

La navegación principal mostrará **Inicio**, **Proyectos**, **Casos de estudio**, **Sobre mí** y **CV y contacto**. Desde las páginas principales y desde los casos compartidos habrá accesos directos a `/cv/` y `/cv/#contacto`.

La ficha del catálogo orienta la exploración. La página individual explica qué resuelve el proyecto en su conjunto y cuál fue tu participación. Cada caso desarrolla cómo realizaste o validaste un trabajo concreto. El enlace entre ambos permite ampliar el contexto o examinar el aporte sin repetir la narración completa.

## Recorridos principales

- **Evaluación rápida.** Inicio → perfil y aporte destacado → caso → evidencia del aporte.
- **Exploración de un proyecto.** Proyectos → página individual → casos publicados, cuando existan → decisión, validación y evidencia.
- **Enlace compartido.** Abrir el caso directamente y encontrar contexto, alcance personal y evidencia. Desde allí se puede acceder al CV, al contacto y a la página del proyecto si está publicada.
- **CV y contacto.** Desde Inicio, las demás páginas principales o un caso, abrir directamente el CV o ir al correo visible para copiarlo o abrirlo en un cliente de correo.

## Modelo de contenido

| Entidad | Datos mínimos |
| --- | --- |
| Proyecto | Slug estable, nombre autorizado, resumen para el catálogo, problema, contexto, propósito, solución, participación personal y estado verificable. Las tecnologías se incluyen cuando aportan contexto. |
| Caso | Slug estable, referencia al proyecto, título, resumen, contexto, alcance personal, decisiones, trabajo, validación, resultados o límites y referencias a evidencias. El periodo se incluye cuando está confirmado. |
| Evidencia | Identificador, título, tipo, fuente o versión, autoría, afirmación que respalda y archivo o enlace público autorizado. |
| Perfil y CV | Nombre público, formación y fechas confirmadas, trayectoria verificable, correo, perfiles autorizados y referencias a casos cuando correspondan. |

Un proyecto puede tener varios casos. El catálogo referencia la página individual por su slug y el índice de casos referencia cada caso por el suyo. La portada puede enlazar al caso destacado. El registro privado de evidencias conserva quién autorizó la publicación, cuándo y para qué texto, archivos y usos.

En el perfil, CV, proyectos y casos, las afirmaciones sustanciales sobre competencias, aportes o resultados se asocian con la evidencia que las respalda. El contexto general se describe con hechos confirmados. Se diferencia el trabajo realizado, lo que se validó y los resultados observados.

## Plantilla reutilizable de caso

1. **Resumen.** ¿Qué problema se abordó, cuál fue tu aporte y qué puede examinar el lector?
2. **Contexto y alcance.** ¿Quién necesitaba la solución, qué restricciones había y qué responsabilidades fueron tuyas y del equipo?
3. **Análisis y decisiones.** ¿Qué observaste, qué opciones consideraste y por qué se eligió la solución?
4. **Trabajo y validación.** ¿Qué se entregó, cómo se comprobó y qué evidencia permite revisar esa comprobación?
5. **Resultados y límites.** ¿Qué se observó y bajo qué condiciones? Para cada cifra, registrar fuente, periodo y método. Si no hubo medición, describir los resultados cualitativos verificables o el límite de la validación.
6. **Evidencias y aprendizajes.** Enlazar las versiones autorizadas y explicar brevemente qué aprendiste o qué cambiarías.

Si una captura utiliza datos de demostración, el pie lo indicará. Su alcance se limita al comportamiento que muestra.

## Visibilidad y contenido incompleto

- Los datos locales de prueba permiten revisar listados, recorridos y estados vacíos. Se identifican como datos de prueba y quedan fuera de la compilación pública.
- Rutas, listados y sitemap públicos se generan a partir del contenido aprobado. Las páginas de proyecto y los casos que sigan en borrador quedan fuera de la compilación pública, al igual que los recursos sin aprobar.
- Una ficha aprobada puede mostrarse mientras se prepara la página individual. Una página individual aprobada puede publicarse mientras se prepara su caso. Se omiten los enlaces y bloques opcionales que no tengan contenido aprobado.
- Los originales sensibles se conservan fuera del repositorio. Para el sitio se usan versiones aprobadas tras revisar texto, capturas, documentos, metadatos y enlaces.
