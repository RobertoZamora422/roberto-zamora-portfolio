# RFM CORE · Actualización editorial de E04

**Estado: borrador para revisión local.** El caso «Del interés comercial al contrato» y sus cuatro evidencias siguen pendientes de aprobación. Esta actualización mantiene el diseño y la plantilla del incremento 3A.

## Qué acredita cada fuente

| Etapa | Evidencia y alcance |
| --- | --- |
| Auditoría local de E04, 11 de noviembre de 2026 | Sobre [el corte histórico `d9fe5ae`](https://github.com/RobertoZamora422/rfm-core---django-react/commit/d9fe5ae53d2a3de2ca4d516db71bb5c3d02fd902), con ajustes locales de pruebas: 19/19 en regresión dirigida, 149/149 en los módulos comercial, financiero y negocio, y 171/171 en la suite completa del backend. Las ejecuciones se solapan. El expediente de auditoría conserva el informe original de Roberto Zamora, el lanzador, los registros y el parche. |
| Integración en RFM CORE | El [PR #2](https://github.com/RobertoZamora422/rfm-core---django-react/pull/2) incorporó las regresiones y el aislamiento de CI. El [PR #3](https://github.com/RobertoZamora422/rfm-core---django-react/pull/3) actualizó dependencias del frontend. El [commit `a95ce07`](https://github.com/RobertoZamora422/rfm-core---django-react/commit/a95ce07fbf26023a70ddfbd3e52512ae58b3796f) permite consultar el [resumen técnico publicado de E04](https://github.com/RobertoZamora422/rfm-core---django-react/blob/a95ce07fbf26023a70ddfbd3e52512ae58b3796f/docs/evidencias/E04/informe.md), el [código de conversión](https://github.com/RobertoZamora422/rfm-core---django-react/blob/a95ce07fbf26023a70ddfbd3e52512ae58b3796f/backend/comercial/services.py#L338-L444) y las regresiones de [QA-06](https://github.com/RobertoZamora422/rfm-core---django-react/blob/a95ce07fbf26023a70ddfbd3e52512ae58b3796f/backend/comercial/test_servicios_paquetes.py#L275-L308) y [QA-14](https://github.com/RobertoZamora422/rfm-core---django-react/blob/a95ce07fbf26023a70ddfbd3e52512ae58b3796f/backend/comercial/test_servicios_paquetes.py#L401-L677). |
| Validación independiente de CI | La [ejecución 43156998249](https://github.com/RobertoZamora422/rfm-core---django-react/actions/runs/43156998249) terminó con éxito sobre `a95ce07` en `main`: 171/171 pruebas de backend, 25/25 de frontend y 0 vulnerabilidades detectadas por `npm audit` en esa ejecución. Pasaron las comprobaciones de configuración, lint, compilación y Wrangler en modo seco. El [ejecutor del backend](https://github.com/RobertoZamora422/rfm-core---django-react/blob/a95ce07fbf26023a70ddfbd3e52512ae58b3796f/backend/run_ci_checks.py) verifica el aislamiento en SQLite en memoria. |

El backend se comprobó con SQLite en memoria y datos sintéticos. La repetición de una conversión se verificó de forma secuencial. PostgreSQL, la concurrencia y la entrega real de mensajes por WhatsApp quedan fuera del alcance. E04 no incluye pruebas de interfaz en navegador, y las 25 pruebas automatizadas del frontend en CI no acreditan recorridos de extremo a extremo. La captura histórica de E01 documenta solo el alta pública. El impacto en tiempos de atención, conversión y rentabilidad sigue sin medir.

## Cambios y referencias conservadas

| Archivo | Cambio |
| --- | --- |
| `.local/contenido-editorial/registro.json` | Actualiza la síntesis, la validación, los límites y las fichas de E02 y E04. Conserva el estado `borrador` en el caso, el proyecto y las evidencias. |
| `recursos-contenido/revision-editorial/rfm-core/e04-verificacion.html` | Distingue la auditoría local, las regresiones integradas y CI. Enlaza los dos commits, los PR, el resumen técnico, el código, las pruebas y la ejecución. |
| `recursos-contenido/revision-editorial/rfm-core/e02-trazabilidad.html` y `e03-decisiones.html` | Aclaran las referencias cruzadas a E04. Se conservan las reglas, las decisiones, las conclusiones y los enlaces históricos a `d9fe5ae`. |
| `README.md`, `docs/informe-revision-editorial-rfm-core.md` y `docs/informe-revision-editorial-rfm-core-v2.md` | Enlazan esta actualización y sitúan en su momento los resultados y las referencias de las revisiones anteriores. |
| `docs/informe-revision-editorial-rfm-core-v3.md` | Registra el alcance, las fuentes, los cambios, la verificación y los pendientes de esta revisión. |
| `pruebas/sitio.test.mjs` | Ajusta las expectativas del recorrido editorial a la síntesis actualizada y al texto del enlace a QA-06. |

El commit `d9fe5ae` sigue identificando la base de la auditoría de E04, el código analizado en E02 y E03 y la demostración de E01. El recurso de E01 conserva su captura y su atribución. Las fuentes extraídas de `rfm_rz_paquete_integracion` se mantienen intactas como documentos de origen. En particular, las indicaciones del borrador inicial, del mapeo RZ y del resumen preliminar de E04 sobre una futura integración describen el estado de aquel paquete. Para el estado actual se consultan el registro y las fichas de revisión de esta actualización.

## Verificación del portafolio

| Comprobación | Resultado |
| --- | --- |
| `npm run typecheck` | Aprobada. |
| `npm test` | 21/21 pruebas de contenido aprobadas. |
| `npm run revision:editorial` | Compilaciones pública y de revisión aprobadas; 4/4 pruebas de sitio en Wrangler y Chromium. Sin infracciones de axe en los recorridos evaluados a 1280, 390 y 320 px. |
| Enlaces externos | Los 9 nuevos destinos de E04 y el enlace histórico al commit base respondieron HTTP 200. Se comprobó el contenido de las líneas citadas, la fusión de ambos PR y los registros de las tareas de CI. GitHub permite ver el resumen de CI sin iniciar sesión; solicita sesión para consultar sus logs. |
| Recursos locales | Las cuatro fichas respondieron HTTP 200 en revisión y conservan `noindex`. Se comprobaron las anclas de sus enlaces internos y la carga de las dos imágenes de E01. Las huellas de E01 y de los documentos de origen no cambiaron. |
| Exclusión pública | El proyecto, el caso, sus datos prerenderizados y los cuatro recursos devolvieron HTTP 404. La salida pública tampoco contiene el identificador de la ejecución de CI ni el hash completo del commit de integración. |

La galería actualizada está en `.local/revision-editorial-rfm-core-v2/index.html`. Con `npm run preview:prueba`, el caso se puede recorrer en `http://127.0.0.1:8788/casos-de-estudio/del-interes-comercial-al-contrato/`. Los resultados de RFM CORE se verificaron en sus fuentes y en los logs de GitHub Actions; las pruebas ejecutadas durante esta revisión corresponden al portafolio.

## Antes de autorizar la publicación

- Completar el contraste de E01 con el procedimiento operativo real de Rancho Flor María.
- Aprobar el texto del caso, la ficha del proyecto, la captura de producto y las versiones de consulta de E01 a E04. El expediente bruto de auditoría permanece bajo custodia local.
- Tras la aprobación, incorporar el contenido y los recursos autorizados al registro público y verificar el artefacto resultante. Para el lanzamiento del portafolio también queda la aprobación del perfil, el CV y el contacto.

## Estado de Git

El portafolio está en `main` sobre `023d08c`, sin divergencia con `origin/main`. Hay cuatro archivos rastreados modificados y este informe nuevo, todos sin preparar. El registro y los tres recursos HTML actualizados están en rutas ignoradas. No se hizo commit, push ni despliegue.
