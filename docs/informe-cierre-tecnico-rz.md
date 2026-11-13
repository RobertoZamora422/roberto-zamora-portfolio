# Cierre técnico del portafolio RZ.

Base `c6e95a56f72ad9b1d937ee77c688964f58003b2b`, confirmada en `main` y `origin/main` al iniciar el trabajo. La corrección está en el checkout local. Las consultas al dominio público corresponden al despliegue que aún sirve el PNG de 5B.

## Retrato y control de versiones

| Recurso | Dimensiones | Bytes |
| --- | --- | ---: |
| PNG de 5B | 1122 × 1402 | 1.987.717 |
| WebP | 700 × 875 | 29.604 |

El WebP reduce el peso un **98,51 %**. Se obtuvo del PNG aprobado con Pillow 12.0.0 y libwebp 1.6.0, remuestreo Lanczos, calidad 89 y método 6. El marco de escritorio mide 184 px CSS. Con el escalado de 1,24 de la imagen y un DPR de 3, requiere aproximadamente 685 px de ancho. Se revisaron comparaciones a 1280, 390 y 320 px en DPR 1 y 3. La foto conserva el encuadre y el texto alternativo. Inicio carga el WebP con HTTP 200 y `image/webp`.

- `app/contenido/perfil-publico.ts` referencia `recursos-contenido/perfil/roberto-zamora.webp`. La compilación contiene el WebP y el PDF oficial. El PNG de `recursos-contenido/perfil/` sigue versionado como solicitó el titular al limitar la retirada a `Recursos/`.
- Las dos entradas de `Recursos/` se retiraron del índice con `git rm --cached`. `.gitignore` excluye esa carpeta. Ambas copias locales conservan sus bytes.
- El PDF público conserva su URL y su SHA-256 `7d3b5e3a695ee204fd9e6e1d343588dae13aa9ae245551f018410309636adca7`. El WebP tiene SHA-256 `0d604523ea71946c956e344c7d9160a3118cc8d4ba90e5002f274ae3c1138088`. El commit base y el historial se preservaron.

## Validación

Pasaron `npm run typecheck`, 24 de 24 pruebas de contenido y 5 de 5 pruebas de sitio. La suite compiló las versiones pública y de revisión. Chromium 157 y Wrangler comprobaron navegación, tabulación, accesibilidad automatizada, favicon, foco de contacto y E01–E04.

El artefacto local y los dos hosts publicados entregaron el PDF oficial byte por byte con HTTP 200, `application/pdf` y `Content-Disposition: inline`. Se comprobaron los diez enlaces «Ver CV» de las siete páginas. En Chrome con JavaScript bloqueado para el sitio, los diez abrieron una pestaña nueva en el visor nativo tanto en Wrangler como en el dominio personalizado, con acceso a impresión y descarga.

El correo se mostró como `mailto:` con JavaScript desactivado y `Cache-Control: no-transform`. El favicon coincidió con el archivo del repositorio. Los cuerpos de E01–E04 coincidieron con sus fuentes tras normalizar finales de línea, y las 33 referencias externas devolvieron HTTP 200. «Aprobadas» ocupó una línea a los tres anchos. En `roberto-zamora-portfolio.pages.dev` se observó `X-Robots-Tag: noindex` en las páginas, evidencias y recursos muestreados.

### Lighthouse móvil

Tres corridas por fila con Lighthouse 13.6.0 y Chrome 157, perfil móvil simulado de 412 × 823 px, CPU 4×, latencia de 150 ms y caudal de 1.638,4 kbit/s. Base y candidata locales se midieron en Wrangler. Las filas publicadas corresponden al despliegue vigente con PNG.

| Entorno y ruta | LCP mediano | CLS mediano | Rendimiento mediano |
| --- | ---: | ---: | ---: |
| Base local `c6e95a5` · Inicio | 0,851 s | 0,002427 | 100/100 |
| WebP local · Inicio | 0,815 s | 0,002427 | 100/100 |
| WebP local · Caso de estudio | 0,849 s | 0,000340 | 100/100 |
| Producción vigente · Inicio | 1,069 s | 0 | 100/100 |
| Producción vigente · Caso de estudio | 1,084 s | 0 | 100/100 |

Todas las medianas cumplen los umbrales del proyecto de LCP ≤ 2,5 s y CLS ≤ 0,1. La diferencia local de LCP es pequeña frente a la variación entre corridas. La reducción de transferencia sí se verificó en las solicitudes de Lighthouse, de 1.987.717 a 29.604 bytes en las tres corridas de Inicio. Las cifras son de laboratorio.

Las capturas, el diff binario, los resultados HTTP y los 15 informes de Lighthouse están en `.local/cierre-tecnico-rz/`. La galería `index.html` enlaza las comparaciones a tamaño real, las capturas 3× y los resúmenes JSON.

## Auditoría después del despliegue

El check público **Cloudflare Pages** de `c6e95a5` figura como exitoso. El dominio público y `pages.dev` todavía solicitan el PNG de 5B. La auditoría del WebP en el borde requiere el despliegue que contenga esta corrección. [Checks del commit base](https://github.com/RobertoZamora422/roberto-zamora-portfolio/commit/c6e95a56f72ad9b1d937ee77c688964f58003b2b/checks)

1. Obtener el SHA completo del commit publicado. En Cloudflare, abrir **Workers & Pages → roberto-zamora-portfolio → Deployments** y cotejar el SHA con el despliegue marcado como producción. Registrar el ID y la URL única del despliegue. Con la API de lectura, contrastar `canonical_deployment.deployment_trigger.metadata.commit_hash`. El check de GitHub permite corroborar el resultado de la compilación. [Despliegues Git de Pages](https://developers.cloudflare.com/pages/get-started/git-integration/) · [API del proyecto de Pages](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/get/)
2. Ejecutar la auditoría HTTP y Chromium sin JavaScript en ambos hosts. Comprueba el WebP y sus bytes a los tres anchos, los diez destinos de CV y el PDF inline, `mailto:` y `no-transform`, favicon, integridad de E01–E04 y `X-Robots-Tag: noindex` de `pages.dev`.
3. Activar con Enter los diez enlaces en Chrome con JavaScript bloqueado para el sitio. Confirmar que se abre el visor con el PDF definitivo y los controles nativos. Conservar una captura.
4. Ejecutar Lighthouse móvil tres veces en Inicio y el caso público del dominio personalizado. Guardar los JSON y comprobar las medianas contra los umbrales anteriores. Confirmar en el informe de red de Inicio que se solicitó el WebP.

Desde la raíz del checkout, los verificadores de `.local/cierre-tecnico-rz/` ejecutan los pasos 2–4. Usan Playwright, Chrome y Lighthouse 13.6.0. `CHROMIUM_PATH` permite elegir el ejecutable para los verificadores de navegador.

```powershell
node .local/cierre-tecnico-rz/auditar.mjs --produccion
node .local/cierre-tecnico-rz/verificar-visor.mjs https://robertozamora.claridez.com
node .local/cierre-tecnico-rz/medir.mjs https://robertozamora.claridez.com
```
