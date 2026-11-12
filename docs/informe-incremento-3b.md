# Incremento 3B · Identidad profesional, Sobre mí, CV y contacto

El perfil de Roberto Zamora se puede revisar localmente en Inicio, Sobre mí y CV. Presenta su formación como estudiante de Ingeniería en Software y su interés en pasantías o posiciones junior en tecnología. El perfil reutiliza el registro tipado y permanece en estado `borrador`. El compilador de revisión habilita una copia para recorrer las páginas con la misma selección de contenido que usa el sitio.

## Contenido y respaldo

| Vista | Contenido y procedencia |
| --- | --- |
| Inicio | Nombre documentado en la maqueta RZ. y en la autoría de E01–E04. La condición de estudiante, las oportunidades y la propuesta de valor proceden de la [definición del portafolio](definicion.md). La foto se muestra solo si el retrato tiene aprobación propia. |
| Sobre mí | Ingeniería en Software como formación documentada. Los intereses se presentan como intereses. Las competencias se expresan mediante aportes concretos y cada aporte enlaza su evidencia. |
| CV | CV HTML con identidad, formación y experiencia en proyectos. Se alimenta del mismo registro que Sobre mí. La hoja de impresión conserva el contenido del CV y los datos de contacto cuando existen. |
| Contacto | Mantiene el acceso desde la cabecera y el pie. El modelo admite un correo visible con `mailto:` y perfiles HTTPS cuando se confirman e incorporan al perfil. En la revisión actual aparece la disponibilidad real del canal. |

El modelado del proceso y la documentación de requisitos se respaldan con E01 y E02. El diseño y la comunicación escrita de decisiones se respaldan con E03. La validación funcional se respalda con E04 y con el caso «Del interés comercial al contrato». Estos enlaces conservan el alcance de cada evidencia. No se atribuye experiencia laboral ni impacto empresarial a partir de los resultados de pruebas.

## Revisión local

Desde la raíz del repositorio, ejecuta `npm run revision:perfil` para compilar, verificar y generar la galería en `.local/revision-incremento-3b/index.html`. Abre esa galería para comparar los anchos de 1280, 390 y 320 px y consultar la impresión de control. Para recorrer las páginas, ejecuta `npm run preview:prueba`.

| Vista | Dirección |
| --- | --- |
| Inicio | [http://127.0.0.1:8788/](http://127.0.0.1:8788/) |
| Sobre mí | [http://127.0.0.1:8788/sobre-mi/](http://127.0.0.1:8788/sobre-mi/) |
| CV | [http://127.0.0.1:8788/cv/](http://127.0.0.1:8788/cv/) |
| Contacto | [http://127.0.0.1:8788/cv/#contacto](http://127.0.0.1:8788/cv/#contacto) |

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Tipos y contenido | `npm run typecheck` aprobado y 22 de 22 pruebas de contenido aprobadas. |
| Compilaciones y sitio | `npm run revision:perfil` completó las compilaciones pública y de revisión y aprobó 5 de 5 pruebas de sitio en Wrangler y Chromium. |
| Navegación y accesibilidad | Inicio, Sobre mí y CV respondieron HTTP 200 con HTML prerenderizado y datos de navegación. Se comprobó el recorrido por teclado hasta el ancla de contacto y el acceso al caso y a E01–E04. Las nueve auditorías de axe de estas tres vistas a 1280, 390 y 320 px no detectaron infracciones en las reglas WCAG A y AA evaluadas. La revisión manual con lector de pantalla queda pendiente para el lanzamiento. |
| Tipografía y composición | Archivo Black y Geist cargaron localmente. Las tres páginas se adaptaron a los anchos revisados. Se cotejó Inicio a 1280 y 320 px con las capturas `inicio-*-maqueta.png` del directorio `.local/revision-rz/`, generadas desde la [referencia aprobada](referencias/incremento-2/portafolio-rz.html). Se conservaron la jerarquía del nombre, la cabecera, los botones y la composición de los módulos. El nombre ocupa el espacio de la composición sin retrato. |
| Impresión | El botón Imprimir CV invoca la impresión del navegador. Se generó una hoja A4 con texto seleccionable y se inspeccionó su renderizado con Poppler. La página muestra el nombre, la formación y los aportes, sin controles de navegación ni aviso de contacto pendiente. |
| Contacto y separación editorial | La revisión actual no contiene direcciones ni enlaces de contacto. Un registro aislado verificó la generación de `mailto:` y de un enlace HTTPS al aprobar el perfil. El perfil en borrador queda fuera de la compilación pública y sus rutas de revisión llevan `noindex`. |
| RFM CORE | El registro público, las rutas del proyecto y del caso y los cuatro HTML de evidencia conservan sus archivos fuente. Los datos prerenderizados del proyecto y el caso y los recursos E01–E04 coinciden byte por byte con la candidata aprobada. |

## Decisiones editoriales pendientes

- Aprobar el uso público de «Roberto Zamora» como nombre profesional, los textos de Inicio y Sobre mí y la versión HTML del CV.
- Confirmar institución y periodo de formación. Incorporar otra formación, certificaciones o experiencias solo si se aportan datos verificables y se autoriza su inclusión.
- Confirmar el correo profesional y qué perfiles externos pueden aparecer como canales de contacto.
- Decidir si se añadirá un retrato y si el lanzamiento ofrecerá un PDF descargable. La impresión de control sirve para revisar el CV HTML.
- Autorizar por separado la publicación del portafolio y confirmar su URL pública.
