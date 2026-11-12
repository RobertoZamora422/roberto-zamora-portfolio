# Versión candidata de publicación · RFM CORE

La candidata incorpora a RFM CORE como proyecto destacado y a «Del interés comercial al contrato» como caso destacado de Inicio. El catálogo de Proyectos lleva a la ficha de RFM CORE y la ficha enlaza el caso. El caso reúne los enlaces a E01, E02, E03 y E04 y cada documento permite volver a la sección de evidencias.

## Revisión local

La compilación pública de la candidata está en `build/client`. Desde la raíz del portafolio se puede servir en el equipo local con este comando.

```powershell
npx wrangler pages dev build/client --ip 127.0.0.1 --port 8789
```

| Vista | Dirección local |
| --- | --- |
| Inicio | [http://127.0.0.1:8789/](http://127.0.0.1:8789/) |
| Proyectos | [http://127.0.0.1:8789/proyectos/](http://127.0.0.1:8789/proyectos/) |
| Proyecto RFM CORE | [http://127.0.0.1:8789/proyectos/rfm-core/](http://127.0.0.1:8789/proyectos/rfm-core/) |
| Catálogo de casos | [http://127.0.0.1:8789/casos-de-estudio/](http://127.0.0.1:8789/casos-de-estudio/) |
| Del interés comercial al contrato | [http://127.0.0.1:8789/casos-de-estudio/del-interes-comercial-al-contrato/](http://127.0.0.1:8789/casos-de-estudio/del-interes-comercial-al-contrato/) |
| E01 | [Proceso comercial](http://127.0.0.1:8789/recursos/rfm-core/e01-proceso.html) |
| E02 | [Trazabilidad funcional](http://127.0.0.1:8789/recursos/rfm-core/e02-trazabilidad.html) |
| E03 | [Decisiones de diseño funcional](http://127.0.0.1:8789/recursos/rfm-core/e03-decisiones.html) |
| E04 | [Pruebas y resultados](http://127.0.0.1:8789/recursos/rfm-core/e04-verificacion.html) |

La galería `.local/candidata-rfm-core/index.html` se genera con `npm run revision:editorial` y permite revisar las capturas sin iniciar el servidor.

## Contenido y procedencia

La candidata parte de la revisión v3 documentada en `1f02588`. Las entradas de proyecto, caso y evidencias conservan los textos y la atribución a Roberto Zamora. El valor `aprobado` habilita su inclusión en el artefacto según el registro tipado. La autorización para ponerlo en línea sigue pendiente.

La ficha muestra «Solución desplegada» como estado de RFM CORE. Los HTML de consulta usan las rutas públicas, corrigen la profundidad del enlace de vuelta y eliminan las etiquetas de revisión local y el `noindex` de los borradores. El diagrama y la captura sintética siguen incrustados como PNG en E01. Los dos PNG son idénticos a los de v3. El registro editorial y los HTML originales permanecen en sus rutas locales y coinciden byte por byte con el ZIP de auditoría v3.

E01 se incorpora como evidencia de modelado y análisis funcional. Distingue las funciones de RFM CORE de las prácticas comerciales previamente descritas y mantiene que el contraste fue documental y parcial. La observación presencial y la certificación del procedimiento quedan fuera de su alcance.

E04 conserva la auditoría histórica sobre `d9fe5ae`, los resultados locales en SQLite en memoria con datos sintéticos y los límites sobre concurrencia con PostgreSQL, recorridos de interfaz y envíos reales de mensajes. El impacto empresarial sigue sin medirse. La integración de las regresiones y su validación posterior conservan sus referencias. [Commit `a95ce07`](https://github.com/RobertoZamora422/rfm-core---django-react/commit/a95ce07fbf26023a70ddfbd3e52512ae58b3796f) · [GitHub Actions](https://github.com/RobertoZamora422/rfm-core---django-react/actions/runs/43156998249)

## Archivos incorporados o modificados

| Archivo | Cambio |
| --- | --- |
| `app/contenido/publico.ts` | Ficha, página de proyecto, caso destacado y cuatro entradas de evidencia. |
| `recursos-contenido/rfm-core/e01-proceso.html` | Copia para consulta con diagrama y captura incrustados. |
| `recursos-contenido/rfm-core/e02-trazabilidad.html` | Copia para consulta de la matriz retrospectiva. |
| `recursos-contenido/rfm-core/e03-decisiones.html` | Copia para consulta de las decisiones de diseño. |
| `recursos-contenido/rfm-core/e04-verificacion.html` | Copia para consulta de las pruebas y sus fuentes. |
| `pruebas/sitio.test.mjs` | Verificación del recorrido en la compilación pública, recursos, navegación por teclado y datos prerenderizados. |
| `pruebas/capturas.mjs` | Galería de la candidata en los tres anchos de revisión. |
| `README.md` | Estado del incremento e instrucciones de revisión local. |
| `docs/informe-candidata-rfm-core.md` | Informe de preparación para publicación. |

## Verificaciones

| Comprobación | Resultado |
| --- | --- |
| `npm run typecheck` | Aprobada. |
| `npm test` | 21 de 21 pruebas de contenido aprobadas. |
| `npm run revision:editorial` | Compilación pública, compilación de revisión y 4 de 4 pruebas de sitio aprobadas en Wrangler y Chromium. |
| HTTP y navegación | Inicio, catálogos, proyecto, caso, sus datos de navegación y las cuatro evidencias respondieron HTTP 200. Los destinos internos y sus anclas se comprobaron. Las rutas inexistentes y los recursos privados respondieron HTTP 404. |
| Revisión visual y teclado | A 1280, 390 y 320 px se comprobaron la carga de fuentes, el reflujo, la navegación por teclado, el índice, el retorno desde E01 a E04 y el visor desplazable de E01. Axe no detectó infracciones en las vistas evaluadas. La galería contiene 34 capturas de la candidata y la imagen sintética de referencia. |
| Integridad | Los cuatro HTML servidos coinciden byte por byte con los recursos candidatos. Chromium decodificó los dos PNG y se comprobó que sus hashes coinciden con v3. Ambos PNG carecen de metadatos de texto y EXIF. |
| Contenido del artefacto | Se inspeccionaron los HTML y `_.data` de Inicio, Proyectos, el catálogo de casos, el proyecto y el caso. El artefacto contiene los cuatro HTML previstos bajo `recursos/rfm-core/`. Las rutas de revisión, muestras, fuentes originales y paquetes de auditoría quedan fuera. |
| Privacidad | Se revisó el texto de los recursos y del registro junto con los HTML y los datos de navegación compilados. Las imágenes muestran roles genéricos y una precotización de demostración. La revisión no encontró datos reales de clientes, credenciales ni información de contacto de clientes. |

El trabajo queda local en `main` sobre `1f02588`. No se realizó commit, push ni despliegue. Las comprobaciones de esta entrega corresponden al portafolio.

## Autorización final

- Autorizar la ficha, la página del proyecto y el relato del caso tal como se muestran en la candidata, incluida la identificación del negocio en los textos.
- Autorizar la consulta de E01 a E04, con el diagrama de E01, la captura con datos sintéticos y los enlaces al código y a CI.
- Dar la autorización de publicación del portafolio. La revisión de perfil, CV y contacto corresponde al lanzamiento general.
