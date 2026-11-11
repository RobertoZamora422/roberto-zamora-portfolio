# RFM CORE · Revisión editorial local

**Estado · Borrador para revisión editorial, 11 de noviembre de 2026.**

## Páginas y recorrido

- `/proyectos/rfm-core/` presenta el producto completo. La ficha distingue su estado de despliegue del estado editorial de la documentación y enlaza al caso relacionado.
- `/casos-de-estudio/del-interes-comercial-al-contrato/` se centra en el aporte individual al proceso comercial. Usa los campos existentes de `Caso` para el contexto, alcance, decisiones, trabajo, validación, resultados, límites y aprendizajes. El índice y las fichas son los del incremento 3A. El proyecto y el caso aparecen como destacados en Inicio durante la revisión local.
- Las cuatro fichas enlazan extractos consultables con fuente, autoría y estado. Las páginas del portafolio conservan Archivo Black, Geist, la paleta, las plantillas y los componentes RZ.

## Evidencias integradas

| Evidencia | Fuente del paquete | Qué se puede revisar y en qué estado |
| --- | --- | --- |
| E01 · Proceso comercial | Documento de modelado, BPMN y diagrama E01 v1 | Recorrido textual y diagrama del paquete. El modelo deriva de la implementación y queda pendiente de contraste con la práctica operativa de Rancho Flor María. |
| E02 · Trazabilidad funcional | Matriz E02 v1.0 | Extracto de RN-01 a RN-09. La matriz se reconstruyó a partir del código y de las pruebas identificadas. E04 aporta evidencia local para RN-03 y RN-09. |
| E03 · Decisiones de diseño funcional | Documento E03 v1.0 | Selección de decisiones sobre entidades, estados, conversión, validaciones e instantáneas. El análisis de alternativas es retrospectivo. |
| E04 · Pruebas y resultados | Resumen editorial de E04 del 11 de noviembre de 2026 | Resultados documentados, escenarios QA-06 y QA-14, correcciones en pruebas y límites de la ejecución. El resumen sigue en borrador. |

E04 documenta 19 de 19 pruebas dirigidas, 149 de 149 en los módulos comercial, financiero y negocio, y 171 de 171 en el backend completo. Las cifras corresponden a SQLite en memoria, con datos sintéticos y ajustes locales de pruebas y documentación sobre `d9fe5ae`. La integración del portafolio verificó la presentación de esas cifras. La ejecución del backend pertenece al informe E04. Los logs, el lanzador y el parche bruto se custodian por separado.

El resultado cubre el rechazo de conversiones duplicadas secuenciales y los escenarios documentados de paquete y oferta histórica. La reutilización de la oferta depende de los datos disponibles y del paquete final. PostgreSQL, la concurrencia, la interfaz en navegador y el envío efectivo por WhatsApp quedaron fuera de la ejecución E04. La fecha tentativa se presenta como un dato de la solicitud. Las mejoras empresariales quedan sin medir.

## Separación editorial

El registro de RFM CORE se conserva en `.local/contenido-editorial/registro.json` con estado `borrador` en la ficha, la página, el caso y las cuatro evidencias. El cargador habilita una copia en memoria exclusivamente con `PORTFOLIO_PREVIEW=1` para reutilizar la selección, validación y generación de páginas existentes. Los originales extraídos se conservan bajo `.local/contenido-editorial/fuentes/`. Las fichas enlazan versiones de lectura local en `recursos-contenido/revision-editorial/rfm-core/`. Git ignora ambas ubicaciones y el validador reserva el directorio de recursos para la revisión. El catálogo público sigue vacío con el registro actual.

La publicación queda pendiente de la aprobación del texto, el contraste operativo de E01 y la autorización de las versiones de consulta. Las referencias a una ejecución posterior en el repositorio o en CI deberán corresponder a esa ejecución.

## Verificación y capturas

Pasaron `npm run typecheck`, las 21 pruebas del registro de `npm test` y las 4 pruebas de sitio de `npm run revision:editorial`. La compilación local entregó HTML, datos prerenderizados y los cuatro recursos. En la compilación pública, las rutas de RFM CORE, el caso, sus datos y sus recursos devolvieron 404.

Se revisó la composición a 1280, 390 y 320 px. En Chromium se comprobaron las fuentes, el reflujo, el recorrido por teclado, el salto a las evidencias y sus enlaces de ida y vuelta. Axe no detectó infracciones en el proyecto, el caso ni los documentos de evidencia en los anchos evaluados. `npm run revision:editorial` genera nueve capturas en `.local/revision-editorial-rfm-core/index.html`, con la página de proyecto, el caso completo y las cuatro fichas de evidencia agrupadas por ancho.

Para consultar la vista interactiva, ejecutar `npm run preview:prueba` desde el repositorio y usar los enlaces de la galería. Las capturas se pueden abrir directamente desde el archivo local.
