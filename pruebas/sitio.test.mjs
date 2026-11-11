import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { appendFile, cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { chromium } from "playwright-core";
import { registroPublico } from "../app/contenido/publico.ts";
import { anchos, capturarCasos, capturarEditorial, capturarRevision, vistas, vistasCasos } from "./capturas.mjs";
import { perfilAprobado, registroFixture } from "./registro-fixture.mjs";
import { conPages } from "./servidor.mjs";

const ejecutar = promisify(execFile);
const axe = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const preview = ".local/prerender/client";
const publico = "build/client";
const proyecto = vistas[2].ruta;
const [catalogoCasos, caso] = vistasCasos.map(({ ruta }) => ruta);
const recurso = "/recursos/pruebas/decision-portafolio-revision.txt";
const tituloCaso = "Separar el proyecto del caso de estudio";
const desconocidas = ["/proyectos/slug-desconocido/", "/casos-de-estudio/slug-desconocido/", "/ruta-desconocida/"];
const marcasRevision = /decision-portafolio-revision|separar-proyecto-y-caso|revision-editorial|Vista local de revisión|Recurso de revisión local|Registro sintético|Datos de prueba|Tu nombre|Tu foto|Probar con mi foto|data-planned/iu;
const rutaRfm = "/proyectos/rfm-core/";
const slugCasoRfm = "del-interes-comercial-al-contrato";
const rutaCasoRfm = `/casos-de-estudio/${slugCasoRfm}/`;
const tituloCasoRfm = "Del interés comercial al contrato";
const evidenciasRfm = ["e01-proceso", "e02-trazabilidad", "e03-decisiones", "e04-verificacion"];
const rutaEvidencia = (nombre) => `/recursos/revision-editorial/rfm-core/${nombre}.html`;
const borradorEditorial = await readFile(".local/contenido-editorial/registro.json", "utf8").then(JSON.parse, (error) => {
  if (error.code !== "ENOENT") throw error;
});
const casoRfm = borradorEditorial?.casos.find(({ slug }) => slug === slugCasoRfm);

if (process.env.PORTFOLIO_CAPTURAS_EDITORIAL === "1" && !casoRfm) {
  throw new Error("Falta el borrador local de RFM CORE para generar la galería editorial");
}

async function comprobarArtefacto(carpeta, marcas) {
  const archivos = await readdir(carpeta, { recursive: true, withFileTypes: true });
  for (const archivo of archivos.filter((entrada) => entrada.isFile())) {
    assert.doesNotMatch(archivo.name, marcas);
    assert.doesNotMatch(await readFile(join(archivo.parentPath, archivo.name), "utf8"), marcas, archivo.name);
  }
}

async function comprobar404(origin, rutas) {
  for (const ruta of rutas) {
    const respuesta = await fetch(origin + ruta, { redirect: "manual" });
    assert.equal(respuesta.status, 404, ruta);
    const html = await respuesta.text();
    assert.match(html, /<h1>Página no encontrada<\/h1>/);
    assert.match(html, /<meta name="robots" content="noindex"/);
    assert.doesNotMatch(html, /<script\b/);
  }
}

async function comprobarAccesibilidad(page, vista) {
  const infracciones = await page.evaluate(async () => (await window.axe.run({
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  })).violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)]));
  assert.deepEqual(infracciones, [], vista);
}

test("Artefacto público real sin datos locales y recuperación HTTP 404", async () => {
  await comprobarArtefacto(publico, marcasRevision);
  const rutasExcluidas = evidenciasRfm.map(rutaEvidencia);
  if (!registroPublico.proyectos.some(({ slug, pagina }) => slug === "rfm-core" && pagina?.revision === "aprobado")) {
    rutasExcluidas.push(rutaRfm, rutaRfm + "_.data");
  }
  if (!registroPublico.casos.some(({ slug, revision }) => slug === slugCasoRfm && revision === "aprobado")) {
    rutasExcluidas.push(rutaCasoRfm, rutaCasoRfm + "_.data");
    await comprobarArtefacto(publico, /del-interes-comercial-al-contrato|Del interés comercial al contrato|rfm-e0[1-4]/iu);
  }
  const html = await readFile(join(publico, "index.html"), "utf8");
  assert.doesNotMatch(html, /noindex/);
  assert.doesNotMatch(html, /<input[^>]+type="file"/);
  if (registroPublico.perfil?.revision !== "aprobado") {
    assert.doesNotMatch(html, /Roberto Zamora|Me interesa entender cómo funciona un negocio/);
  }
  await assert.rejects(readFile(join(publico, "__spa-fallback.html")), { code: "ENOENT" });
  await conPages(publico, async (origin) => {
    const catalogo = await fetch(origin + catalogoCasos);
    assert.equal(catalogo.status, 200);
    const htmlCasos = await catalogo.text();
    assert.match(htmlCasos, /<h1>Casos de estudio<\/h1>/);
    if (!registroPublico.casos.some(({ revision }) => revision === "aprobado")) {
      assert.match(htmlCasos, /Por ahora no hay casos de estudio publicados/);
    }
    await comprobar404(origin, [...desconocidas, caso, caso + "_.data", recurso, ...rutasExcluidas]);
  });
});

test("La compilación pública prerenderiza proyectos y casos aprobados de un registro aislado", { timeout: 90_000 }, async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-compilacion-"));
  t.after(() => rm(carpeta, { recursive: true, force: true, maxRetries: 3 }));
  const registro = registroFixture();
  registro.perfil = perfilAprobado;
  const [base] = registro.proyectos;
  const [casoBase] = registro.casos;
  Object.assign(casoBase, {
    competencia: "Análisis funcional QA",
    periodo: "Periodo QA",
    aprendizajes: "Aprendizajes QA",
    validacion: "Comprobación pendiente QA",
    resultadosYLimites: "Medición pendiente QA",
  });
  registro.casos.push({
    ...casoBase, slug: "caso-borrador-qa", revision: "borrador", titulo: "Caso sin aprobar QA",
    evidencias: ["archivo-borrador-qa"],
  }, {
    ...casoBase, slug: "caso-con-ficha-qa", proyecto: "solo-ficha-qa", titulo: "Caso con ficha QA",
    competencia: undefined, periodo: undefined, aprendizajes: undefined,
  });
  registro.proyectos.push({
    slug: "borrador-qa",
    ficha: { ...base.ficha, revision: "borrador", nombre: "Borrador aislado QA" },
    pagina: { ...base.pagina, revision: "borrador", evidencias: ["archivo-borrador-qa"] },
  }, { slug: "solo-ficha-qa", ficha: { ...base.ficha, nombre: "Proyecto con ficha QA" } });
  registro.evidencias.push({
    ...registro.evidencias[0], revision: "borrador", id: "archivo-borrador-qa",
    recurso: { archivo: "archivo-borrador-qa.txt" },
  });
  for (const [id, tipo] of [
    ["artefacto-qa", "Artefacto de análisis y documentación"],
    ["prueba-qa", "Prueba y resultado verificable"],
    ["tecnica-qa", "Evidencia técnica"],
  ]) {
    const url = `https://example.org/${id}`;
    registro.evidencias.push({ ...registro.evidencias[0], id, tipo, titulo: tipo, recurso: { url } });
    casoBase.evidencias.push(id);
  }
  const entradas = ["app", "package.json", "react-router.config.ts", "tsconfig.json", "vite.config.ts"];
  await Promise.all(entradas.map((entrada) => cp(entrada, join(carpeta, entrada), { recursive: true })));
  await symlink(resolve("node_modules"), join(carpeta, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  await appendFile(join(carpeta, "app/contenido/publico.ts"), `\nObject.assign(registroPublico, ${JSON.stringify(registro)});\n`);
  for (const directorio of ["recursos-contenido", "public"]) await mkdir(join(carpeta, directorio));
  const aprobado = join(carpeta, "recursos-contenido/archivo-aprobado-qa.txt");
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMxoAAAAASUVORK5CYII=", "base64");
  await writeFile(aprobado, "Recurso aprobado QA");
  await writeFile(join(carpeta, "recursos-contenido", perfilAprobado.retrato.archivo), png);
  await writeFile(join(carpeta, "recursos-contenido/retrato-no-autorizado-qa.png"), png);
  await writeFile(join(carpeta, "recursos-contenido/archivo-borrador-qa.txt"), "Borrador aislado QA");
  await writeFile(join(carpeta, "public/recurso-sin-revision-qa.txt"), "Copia directa QA");
  const compilar = () => ejecutar(process.execPath, ["node_modules/@react-router/dev/bin.cjs", "build"], {
    cwd: carpeta, env: { ...process.env, PORTFOLIO_PREVIEW: "0" }, timeout: 35_000,
  });
  await compilar();

  const salida = join(carpeta, publico);
  await comprobarArtefacto(salida, /borrador-qa|Borrador aislado QA|Caso sin aprobar QA|recurso-sin-revision-qa|Copia directa QA|retrato-no-autorizado-qa/iu);
  await comprobarArtefacto(salida, marcasRevision);
  const [inicio, catalogo, ficha, indice, detalle, soloFicha] = await Promise.all([
    "index.html", "proyectos/index.html", "proyectos/solucion-qa/index.html", "casos-de-estudio/index.html",
    "casos-de-estudio/caso-qa/index.html", "casos-de-estudio/caso-con-ficha-qa/index.html",
  ].map((archivo) => readFile(join(salida, archivo), "utf8")));
  assert.match(inicio, /Presentación de portada QA/);
  assert.match(inicio, /<h1>Perfil QA<\/h1>/);
  assert.match(inicio, /<img[^>]+src="\/recursos\/retrato-qa.png"[^>]+alt="Retrato QA"/);
  assert.doesNotMatch(inicio, /Resumen de catálogo QA|Presentación de ficha QA/);
  assert.match(catalogo, /Resumen de catálogo QA/);
  assert.doesNotMatch(catalogo, /Presentación de portada QA|Presentación de ficha QA/);
  assert.match(catalogo, /href="\/proyectos\/solucion-qa\/"/);
  assert.match(ficha, /Presentación de ficha QA/);
  assert.doesNotMatch(ficha, /Presentación de portada QA|Resumen de catálogo QA/);
  for (const html of [inicio, ficha, indice]) assert.match(html, /href="\/casos-de-estudio\/caso-qa\/"/);
  assert.match(indice, /Análisis funcional QA/);
  assert.match(indice, /Resumen QA/);
  assert.match(indice, /Solución QA/);
  assert.doesNotMatch(indice, /Por ahora no hay casos de estudio publicados/);
  assert.match(detalle, /<title>Caso QA · Casos de estudio<\/title>/);
  assert.match(detalle, /name="description" content="Resumen QA"/);
  assert.match(detalle, /href="\/proyectos\/solucion-qa\/"/);
  for (const texto of [
    "Periodo QA", "Aprendizajes QA", "Comprobación pendiente QA", "Medición pendiente QA",
    "Qué demuestra", "Fuente QA", "Autoría QA", "Decisión documentada", "Artefacto de análisis y documentación",
    "Prueba y resultado verificable", "Evidencia técnica",
  ]) assert(detalle.includes(texto), texto);
  assert.match(detalle, /href="https:\/\/example.org\/tecnica-qa"/);
  assert.match(soloFicha, /Proyecto con ficha QA/);
  assert.doesNotMatch(soloFicha, /href="\/proyectos\/solo-ficha-qa\/"|href="#aprendizajes"/);

  await conPages(salida, async (origin) => {
    const [pagina, datos, evidencia, retrato, casoHtml, casoDatos] = await Promise.all([
      "/proyectos/solucion-qa/", "/proyectos/solucion-qa/_.data", "/recursos/archivo-aprobado-qa.txt",
      "/recursos/retrato-qa.png", "/casos-de-estudio/caso-qa/", "/casos-de-estudio/caso-qa/_.data",
    ].map((ruta) => fetch(origin + ruta)));
    for (const respuesta of [pagina, datos, evidencia, retrato, casoHtml, casoDatos]) assert.equal(respuesta.status, 200, respuesta.url);
    assert.match(await pagina.text(), /<h1>Solución QA<\/h1>/);
    assert.match(await datos.text(), /Participación documentada QA/);
    assert.equal(await evidencia.text(), "Recurso aprobado QA");
    assert.deepEqual(Buffer.from(await retrato.arrayBuffer()), png);
    assert.match(await casoHtml.text(), /<h1>Caso QA<\/h1>/);
    assert.match(await casoDatos.text(), /\/recursos\/archivo-aprobado-qa.txt/);
    await comprobar404(origin, [
      "/proyectos/borrador-qa/", "/proyectos/solo-ficha-qa/", "/casos-de-estudio/caso-borrador-qa/",
      "/casos-de-estudio/caso-borrador-qa/_.data", "/recursos/archivo-borrador-qa.txt",
      "/recurso-sin-revision-qa.txt", "/recursos/retrato-no-autorizado-qa.png",
    ]);
  });
  await rm(aprobado);
  await assert.rejects(compilar, /Falta el archivo «archivo-aprobado-qa.txt»/);
});

test("Vista local en Wrangler con HTML, navegación, teclado, fuentes y axe", { timeout: 150_000 }, async () => {
  await conPages(preview, async (origin) => {
    for (const [ruta, titulo] of [[proyecto, "Portafolio web"], [caso, tituloCaso]]) {
      const documento = await fetch(origin + ruta, { redirect: "manual" });
      assert.equal(documento.status, 200, ruta);
      const html = await documento.text();
      assert.match(html, new RegExp(`<h1>${titulo}</h1>`));
      assert.match(html, /<html lang="es">/);
      assert.match(html, /name="robots" content="noindex"/);
      const datos = await fetch(origin + ruta + "_.data");
      assert.equal(datos.status, 200, datos.url);
      assert.match(await datos.text(), new RegExp(titulo));
    }
    const evidencia = await fetch(origin + recurso);
    assert.equal(evidencia.status, 200);
    assert.match(await evidencia.text(), /Recurso de revisión local/);
    await comprobar404(origin, [...desconocidas, "/proyectos/claridez/"]);

    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    console.log(`Chromium ${browser.version()}`);
    try {
      const sinJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 840 } });
      const simple = await sinJs.newPage();
      await simple.goto(origin + "/proyectos/");
      await simple.getByRole("link", { name: "Ver ficha de Portafolio web" }).click();
      await simple.getByRole("heading", { name: "Portafolio web", exact: true }).waitFor();
      await simple.getByRole("link", { name: tituloCaso }).click();
      await simple.getByRole("heading", { name: tituloCaso, exact: true }).waitFor();
      await simple.locator(".case-index summary").press("Enter");
      await simple.getByRole("navigation", { name: "Secciones del caso" }).getByRole("link", { name: "Evidencias" }).press("Enter");
      assert.equal(new URL(simple.url()).hash, "#evidencias");
      assert.equal(await simple.evaluate(() => document.activeElement.id), "evidencias");
      const archivo = await simple.getByRole("link", { name: /Consultar evidencia/ }).getAttribute("href");
      assert.equal(archivo, recurso);
      await sinJs.close();

      const page = await browser.newPage();
      const errores = [];
      page.on("pageerror", (error) => errores.push(error.message));
      await page.goto(origin);
      await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Proyectos" }).click();
      await page.getByRole("heading", { name: "Proyectos", exact: true }).waitFor();
      assert.equal(await page.getByRole("link", { name: "Ver ficha de Portafolio web" }).count(), 1);
      const columnas = await page.locator(".project-row > p").evaluateAll((resumenes) => (
        resumenes.map((resumen) => resumen.getBoundingClientRect().left)
      ));
      assert(columnas.every((x) => Math.abs(x - columnas[0]) < 1), "Alineación de las filas del catálogo");
      await page.evaluate(() => { window.pruebaNavegacion = true; });
      for (const [ruta, enlace, titulo, seccion] of [
        [proyecto, "Ver ficha de Portafolio web", "Portafolio web", "Proyectos"],
        [caso, tituloCaso, tituloCaso, "Casos de estudio"],
      ]) {
        const datos = page.waitForResponse((response) => new URL(response.url()).pathname === ruta + "_.data");
        await page.getByRole("link", { name: enlace, exact: true }).click();
        assert.equal((await datos).status(), 200);
        await page.getByRole("heading", { name: titulo, exact: true }).waitFor();
        assert(await page.evaluate(() => window.pruebaNavegacion));
        const nav = page.getByRole("navigation", { name: "Principal" });
        assert.equal(await nav.getByRole("link", { name: seccion, exact: true }).getAttribute("aria-current"), "page");
      }
      await page.goBack();
      await page.getByRole("heading", { name: "Portafolio web", exact: true }).waitFor();
      assert.equal((await page.reload()).status(), 200);
      await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Casos de estudio" }).click();
      await page.getByRole("link", { name: `Leer caso «${tituloCaso}»` }).click();
      await page.getByRole("heading", { name: tituloCaso, exact: true }).waitFor();
      await page.getByRole("link", { name: "Portafolio web", exact: true }).click();
      await page.getByRole("heading", { name: "Portafolio web", exact: true }).waitFor();

      for (const width of anchos) {
        await page.setViewportSize({ width, height: 840 });
        await page.goto(origin);
        const secuencia = width > 735
          ? ["/", "/", "/proyectos/", "/casos-de-estudio/", "/sobre-mi/", "/cv/"]
          : ["/", "/cv/", "/", "/proyectos/", "/casos-de-estudio/", "/sobre-mi/"];
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "#contenido");
        assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
        for (const href of secuencia) {
          await page.keyboard.press("Tab");
          assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), href);
        }
        await page.goto(origin);
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");
        assert.equal(await page.evaluate(() => document.activeElement.id), "contenido");
        await page.getByRole("link", { name: "Contacto", exact: true }).click();
        await page.waitForFunction(() => location.hash === "#contacto" && document.activeElement.id === "contacto");
        assert.equal(await page.getByRole("link", { name: "Contacto", exact: true }).getAttribute("aria-current"), "location");

        for (const { ruta } of [...vistas, ...vistasCasos]) {
          await page.goto(origin + ruta);
          const resultado = await page.evaluate(async () => {
            const caracteres = "Ingeniería · ñ á é í ó ú ü";
            const fuentes = await Promise.all([
              '400 16px "Archivo Black"', '610 16px "Geist Variable"',
            ].map((fuente) => document.fonts.load(fuente, caracteres)));
            return {
              fuentes: fuentes.every((familia) => familia.some((fuente) => fuente.status === "loaded")),
              ancho: document.documentElement.scrollWidth,
              controles: [...document.querySelectorAll(".site-frame a, .case-index summary")]
                .map((control) => control.getBoundingClientRect().height).filter(Boolean),
            };
          });
          assert(resultado.fuentes, ruta);
          assert(resultado.ancho <= width, `${ruta} a ${width} px`);
          assert(resultado.controles.every((altura) => altura >= 44), `${ruta} controles a ${width} px`);
          await page.addScriptTag({ path: axe });
          await comprobarAccesibilidad(page, `${ruta} axe a ${width} px`);
        }

        const indice = page.getByRole("navigation", { name: "Secciones del caso" });
        const resumen = indice.locator("summary");
        const esMovil = width < 896;
        await page.getByRole("link", { name: "Portafolio web", exact: true }).focus();
        if (esMovil) {
          assert(await resumen.isVisible());
          await page.keyboard.press("Tab");
          assert(await resumen.evaluate((elemento) => elemento === document.activeElement));
          assert.equal(await resumen.evaluate((elemento) => getComputedStyle(elemento).outlineStyle), "solid");
          await page.keyboard.press("Space");
          await comprobarAccesibilidad(page, `Índice abierto a ${width} px`);
        } else {
          assert.equal(await indice.evaluate((elemento) => getComputedStyle(elemento).position), "sticky");
        }
        for (const href of ["#contexto", "#alcance", "#decisiones", "#trabajo", "#validacion", "#evidencias"]) {
          await page.keyboard.press("Tab");
          assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), href);
        }
        await page.keyboard.press("Enter");
        await page.waitForFunction(() => location.hash === "#evidencias" && document.activeElement.id === "evidencias");
        await page.locator('.case-index a[href="#evidencias"][aria-current="location"]').first().waitFor({ state: "attached" });
        if (esMovil) {
          assert.equal(await resumen.evaluate((elemento) => elemento.parentElement.open), false);
          assert.match(await resumen.textContent(), /Evidencias/);
        }
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), recurso);

        await page.goto(origin + catalogoCasos);
        await page.goto(origin + caso + "#decisiones");
        await page.locator('.case-index a[href="#decisiones"][aria-current="location"]').first().waitFor({ state: "attached" });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('.case-index a[href="#contexto"][aria-current="location"]').first().waitFor({ state: "attached" });
        await page.getByRole("link", { name: "Contacto", exact: true }).click();
        await page.waitForFunction(() => location.hash === "#contacto" && document.activeElement.id === "contacto");
        await page.goBack();
        await page.getByRole("heading", { name: tituloCaso, exact: true }).waitFor();
        await page.getByRole("link", { name: "CV y contacto", exact: true }).click();
        await page.waitForURL(origin + "/cv/");
      }
      await page.goto(origin);
      await page.locator(".main h1").evaluate((elemento) => {
        elemento.textContent = "Nombre profesional con apellidos extensos e ingeniería";
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errores, [], "Errores de ejecución e hidratación");
      await conPages(publico, async (originPublico) => {
        for (const width of anchos) {
          await page.setViewportSize({ width, height: 840 });
          await page.goto(originPublico + catalogoCasos);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          await page.addScriptTag({ path: axe });
          await comprobarAccesibilidad(page, `Catálogo público a ${width} px`);
        }
        if (process.env.PORTFOLIO_CAPTURAS === "1") {
          await capturarRevision(browser, origin);
          await capturarCasos(browser, origin, originPublico);
        }
      });
    } finally {
      await browser.close();
    }
  });
});

test("RFM CORE se puede revisar con sus cuatro evidencias y sus límites", {
  skip: !casoRfm && "Sin borrador editorial local",
  timeout: 120_000,
}, async () => {
  assert.equal(casoRfm.revision, "borrador");
  const ficha = borradorEditorial.proyectos.find(({ slug }) => slug === "rfm-core");
  assert.equal(ficha.ficha.revision, "borrador");
  assert.equal(ficha.pagina.revision, "borrador");
  assert.equal(casoRfm.evidencias.length, 4);
  for (const id of casoRfm.evidencias) {
    assert.equal(borradorEditorial.evidencias.find((evidencia) => evidencia.id === id)?.revision, "borrador");
  }

  await conPages(preview, async (origin) => {
    for (const [ruta, titulo] of [[rutaRfm, "RFM CORE"], [rutaCasoRfm, tituloCasoRfm]]) {
      const documento = await fetch(origin + ruta, { redirect: "manual" });
      assert.equal(documento.status, 200, ruta);
      const html = await documento.text();
      assert(html.includes(`<h1>${titulo}</h1>`), ruta);
      assert.match(html, /name="robots" content="noindex"/);
      const datos = await fetch(origin + ruta + "_.data");
      assert.equal(datos.status, 200, datos.url);
      assert((await datos.text()).includes(titulo), datos.url);
    }

    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    try {
      const page = await browser.newPage();
      const errores = [];
      page.on("pageerror", (error) => errores.push(error.message));
      await page.goto(origin + "/proyectos/");
      await page.getByRole("link", { name: "Ver ficha de RFM CORE" }).press("Enter");
      await page.getByRole("heading", { name: "RFM CORE", exact: true }).waitFor();
      await page.getByRole("link", { name: tituloCasoRfm }).press("Enter");
      await page.getByRole("heading", { name: tituloCasoRfm, exact: true }).waitFor();
      await page.getByRole("link", { name: "RFM CORE", exact: true }).press("Enter");
      await page.getByRole("heading", { name: "RFM CORE", exact: true }).waitFor();

      for (const ancho of anchos) {
        await page.setViewportSize({ width: ancho, height: 840 });
        for (const ruta of [rutaRfm, rutaCasoRfm, ...evidenciasRfm.map(rutaEvidencia)]) {
          const respuesta = await page.goto(origin + ruta);
          assert.equal(respuesta.status(), 200, ruta);
          const medida = await page.evaluate(async () => {
            const fuentes = await Promise.all(['400 16px "Archivo Black"', '610 16px "Geist Variable"']
              .map((fuente) => document.fonts.load(fuente, "Análisis")));
            return {
              fuentes: fuentes.every((caras) => caras.some((cara) => cara.status === "loaded")),
              ancho: document.documentElement.scrollWidth,
            };
          });
          assert(medida.fuentes && medida.ancho <= ancho, `${ruta} a ${ancho} px`);
          await page.addScriptTag({ path: axe });
          await comprobarAccesibilidad(page, `${ruta} a ${ancho} px`);
        }

        await page.goto(origin + rutaCasoRfm);
        const sintesis = await page.locator('dl[aria-label="Aporte y validación"]').innerText();
        for (const texto of ["Único desarrollador", "9 reglas de negocio documentadas", "171/171", "SQLite", "datos sintéticos", "ajustes locales de pruebas"]) {
          assert(sintesis.includes(texto), texto);
        }
        const ejemplo = page.getByRole("region", { name: "Cuándo se exige un paquete", exact: true });
        for (const [enlace, archivo, ancla] of [
          ["RN-03 · Regla de negocio", "e02-trazabilidad", "rn-03"],
          ["QA-06 · Prueba local", "e04-verificacion", "qa-06"],
          ["Ver pantalla de precotización", "e01-proceso", "pantalla-precotizacion"],
        ]) {
          const href = await ejemplo.getByRole("link", { name: enlace }).getAttribute("href");
          assert.equal(href, rutaEvidencia(archivo) + "#" + ancla);
          const documento = await fetch(origin + href);
          assert.equal(documento.status, 200, href);
          assert((await documento.text()).includes(`id="${ancla}"`), href);
        }
        const indice = page.getByRole("navigation", { name: "Secciones del caso" });
        const resumen = indice.locator("summary");
        if (await resumen.isVisible()) await resumen.press("Space");
        await indice.getByRole("link", { name: "Evidencias", exact: true }).press("Enter");
        await page.waitForFunction(() => location.hash === "#evidencias" && document.activeElement.id === "evidencias");
        const fichas = page.getByRole("region", { name: "Evidencias", exact: true }).getByRole("article");
        assert.equal(await fichas.count(), 4);
        assert.doesNotMatch(await fichas.allTextContents().then((textos) => textos.join(" ")), /Autoría|Fuente o versión/);
        for (const [indice, evidencia] of evidenciasRfm.entries()) {
          const tarjeta = fichas.nth(indice);
          assert.match(await tarjeta.getByRole("heading").textContent(), new RegExp(`^E0${indice + 1} —`));
          assert.equal(await tarjeta.getByRole("link").getAttribute("href"), rutaEvidencia(evidencia));
        }
        await fichas.last().getByRole("link").press("Enter");
        await page.getByRole("heading", { name: "E04 — Pruebas y resultados" }).waitFor();
        const resultados = await page.getByRole("table").innerText();
        for (const total of ["19 de 19", "149 de 149", "171 de 171"]) assert(resultados.includes(total), total);
        await page.getByRole("link", { name: /Volver al caso/ }).press("Enter");
        await page.waitForURL(origin + rutaCasoRfm + "#evidencias");

        await page.goto(origin + rutaEvidencia("e01-proceso"));
        await page.getByText("Ampliar el diagrama completo", { exact: true }).press("Enter");
        const visor = page.getByRole("region", { name: "Visor del diagrama a tamaño original" });
        await visor.getByRole("img").waitFor();
        assert(await visor.evaluate((elemento) => elemento.scrollWidth > elemento.clientWidth && document.documentElement.scrollWidth <= innerWidth));
        await visor.press("ArrowRight");
        await page.waitForFunction(() => document.querySelector(".diagram-view").scrollLeft > 0);
        await page.addScriptTag({ path: axe });
        await comprobarAccesibilidad(page, `E01 ampliado a ${ancho} px`);
      }
      assert.deepEqual(errores, [], "Errores de ejecución e hidratación");
      if (process.env.PORTFOLIO_CAPTURAS_EDITORIAL === "1") {
        await capturarEditorial(browser, origin, { proyecto: rutaRfm, caso: rutaCasoRfm, e01: rutaEvidencia("e01-proceso") });
      }
    } finally {
      await browser.close();
    }
  });
});
