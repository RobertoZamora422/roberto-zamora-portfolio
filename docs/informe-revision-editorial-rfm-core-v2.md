# RFM CORE · Segunda revisión editorial local

El caso **Del interés comercial al contrato** sigue en borrador. Esta revisión conserva la navegación, el índice de secciones y la identidad RZ. del incremento 3A. [Informe de integración inicial](informe-revision-editorial-rfm-core.md)

Este informe describe la segunda revisión. Consulta la [actualización de E04](informe-revision-editorial-rfm-core-v3.md) para las regresiones integradas y la validación posterior de CI.

## Cambios en el caso

- La cabecera resume la responsabilidad como único desarrollador, las nueve reglas de negocio documentadas y las 171/171 pruebas aprobadas del backend. El resultado identifica la ejecución local en SQLite en memoria con datos sintéticos y ajustes locales de pruebas.
- El primer bloque del relato compara el alta pública de servicio completo con la formalización del contrato. El primer paso admite un paquete pendiente. Para convertir la cotización confirmada, el sistema exige elegir un paquete. Los enlaces llevan directamente a RN-03 en E02, QA-06 en E04 y a la captura de la precotización en E01.
- Las cuatro fichas se reducen a título, una frase sobre su aporte y enlace de consulta. Los documentos conservan procedencia, autoría y límites. Los campos opcionales del modelo permiten usar la síntesis y el ejemplo dentro de la plantilla existente.

## Evidencias y fuentes

| Evidencia | Cambio y alcance |
| --- | --- |
| E01 · Proceso comercial | Lectura textual en tres etapas y visor desplazable del PNG a tamaño original, accesible por teclado. El modelo se reconstruyó a partir del código y sigue pendiente de contraste operativo. |
| E02 · Trazabilidad funcional | Cada regla enlaza a código o pruebas en el commit base. RN-03 enlaza a QA-06. RN-09 distingue las dos pruebas históricas ya presentes de las ampliaciones y regresiones de E04. |
| E03 · Decisiones | Cada decisión seleccionada enlaza a los modelos, servicios o funciones que la respaldan. Las justificaciones y alternativas se mantienen como análisis retrospectivo. |
| E04 · Pruebas y resultados | En esta revisión, las cifras correspondían a la auditoría del árbol local con ajustes de pruebas. Los logs, el lanzador y el parche de esa auditoría se conservan en el expediente local. |

Las referencias de esta revisión se fijaron a [d9fe5ae, commit base de RFM CORE](https://github.com/RobertoZamora422/rfm-core---django-react/commit/d9fe5ae53d2a3de2ca4d516db71bb5c3d02fd902).

## Captura de producto

Se incorporó el resultado de la **precotización pública** de servicio completo. Se ejecutó la interfaz y la API de una copia aislada de ese commit, en localhost, con una base SQLite nueva y un catálogo sintético. La API devolvió HTTP 201 y guardó la cotización con paquete nulo. La imagen muestra la opción de elegirlo después y excluye el formulario con los datos de contacto. Los importes y el evento son de demostración. Esta captura documenta el alta pública. El rechazo al formalizar se respalda con QA-06.

## Pendientes para publicación

- Contrastar E01 con el procedimiento operativo real y aprobar el texto, la imagen de producto y las versiones de consulta de E01 a E04.
- Conservar la atribución de las cifras históricas a la auditoría local de E04. PostgreSQL, la concurrencia, la interfaz en navegador y el envío efectivo de mensajes quedan fuera de esa suite. La captura independiente cubre el alta pública descrita arriba. El impacto empresarial sigue sin medir.

## Verificación de la revisión

Pasaron la comprobación de tipos, las compilaciones pública y de revisión, las 21 pruebas del registro y las 4 pruebas de sitio. Se comprobó que el caso y sus recursos editoriales devuelven 404 en la salida pública. En Chromium se verificaron los enlaces del ejemplo, el recorrido por teclado, el desplazamiento del visor ampliado y el reflujo. Axe no detectó infracciones en los anchos evaluados.

Se verificaron 24 enlaces distintos a GitHub. Los destinos respondieron correctamente y los archivos remotos coincidieron con los blobs del commit local. Se comprobaron las líneas y secciones que usan las referencias.

La galería `.local/revision-editorial-rfm-core-v2/index.html` reúne el caso, el ejemplo, las fichas y E01 en 1280, 390 y 320 px. Incluye el visor ampliado a 320 px y la captura original de la precotización. El comando de revisión actualiza la galería con el borrador local vigente. Para consultar las páginas con sus enlaces locales, usa `npm run preview:prueba` después de compilar la revisión.
