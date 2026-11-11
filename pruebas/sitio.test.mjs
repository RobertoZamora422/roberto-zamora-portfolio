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
import { anchos, capturarRevision, vistas } from "./capturas.mjs";
import { perfilAprobado, registroFixture } from "./registro-fixture.mjs";
import { conPages } from "./servidor.mjs";

const ejecutar = promisify(execFile);
const axe = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const preview = ".local/prerender/client";
const publico = "build/client";
const proyecto = vistas[2].ruta;
const caso = "/casos-de-estudio/separar-proyecto-y-caso/";
const recurso = "/recursos/pruebas/decision-portafolio-revision.txt";
const tituloCaso = "Separar el proyecto del caso de estudio";
const desconocidas = ["/proyectos/slug-desconocido/", "/casos-de-estudio/slug-desconocido/", "/ruta-desconocida/"];
const marcasRevision = /decision-portafolio-revision|Vista local de revisión|Recurso de revisión local|Registro sintético|Datos de prueba|Tu nombre|Tu foto|Probar con mi foto|data-planned/iu;

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

test("Artefacto público real sin datos locales y recuperación HTTP 404", async () => {
  await comprobarArtefacto(publico, marcasRevision);
  const html = await readFile(join(publico, "index.html"), "utf8");
  assert.doesNotMatch(html, /noindex/);
  assert.doesNotMatch(html, /<input[^>]+type="file"/);
  if (registroPublico.perfil?.revision !== "aprobado") {
    assert.doesNotMatch(html, /Roberto Zamora|Me interesa entender cómo funciona un negocio/);
  }
  await assert.rejects(readFile(join(publico, "__spa-fallback.html")), { code: "ENOENT" });
  await conPages(publico, (origin) => comprobar404(origin, [...desconocidas, recurso]));
});

test("La compilación pública usa un registro aislado con un único proyecto aprobado", { timeout: 90_000 }, async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-compilacion-"));
  t.after(() => rm(carpeta, { recursive: true, force: true, maxRetries: 3 }));
  const registro = registroFixture();
  registro.perfil = perfilAprobado;
  const [base] = registro.proyectos;
  registro.proyectos.push({
    slug: "borrador-qa",
    ficha: { ...base.ficha, revision: "borrador", nombre: "Borrador aislado QA" },
    pagina: { ...base.pagina, revision: "borrador", evidencias: ["archivo-borrador-qa"] },
  });
  registro.evidencias.push({
    ...registro.evidencias[0], revision: "borrador", id: "archivo-borrador-qa",
    recurso: { archivo: "archivo-borrador-qa.txt" },
  });
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
  await comprobarArtefacto(salida, /borrador-qa|Borrador aislado QA|recurso-sin-revision-qa|Copia directa QA|caso-qa|retrato-no-autorizado-qa/iu);
  const [inicio, catalogo, ficha] = await Promise.all([
    "index.html", "proyectos/index.html", "proyectos/solucion-qa/index.html",
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

  await conPages(salida, async (origin) => {
    const [pagina, datos, evidencia, retrato] = await Promise.all([
      "/proyectos/solucion-qa/", "/proyectos/solucion-qa/_.data", "/recursos/archivo-aprobado-qa.txt",
      "/recursos/retrato-qa.png",
    ].map((ruta) => fetch(origin + ruta)));
    for (const respuesta of [pagina, datos, evidencia, retrato]) assert.equal(respuesta.status, 200, respuesta.url);
    assert.match(await pagina.text(), /<h1>Solución QA<\/h1>/);
    assert.match(await datos.text(), /Participación documentada QA/);
    assert.equal(await evidencia.text(), "Recurso aprobado QA");
    assert.deepEqual(Buffer.from(await retrato.arrayBuffer()), png);
    await comprobar404(origin, ["/proyectos/borrador-qa/", "/recursos/archivo-borrador-qa.txt", "/recurso-sin-revision-qa.txt", "/recursos/retrato-no-autorizado-qa.png"]);
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
    await comprobar404(origin, [...desconocidas, "/proyectos/rfm-core/", "/proyectos/claridez/"]);

    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    console.log(`Chromium ${browser.version()}`);
    try {
      const sinJs = await browser.newContext({ javaScriptEnabled: false });
      const simple = await sinJs.newPage();
      await simple.goto(origin + "/proyectos/");
      await simple.getByRole("link", { name: "Ver ficha de Portafolio web" }).click();
      await simple.getByRole("heading", { name: "Portafolio web", exact: true }).waitFor();
      await simple.getByRole("link", { name: tituloCaso }).click();
      await simple.getByRole("heading", { name: tituloCaso, exact: true }).waitFor();
      await sinJs.close();

      const page = await browser.newPage();
      const errores = [];
      page.on("pageerror", (error) => errores.push(error.message));
      await page.goto(origin + "/proyectos/");
      assert.equal(await page.locator(".project-row a").count(), 1);
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

        for (const { ruta } of vistas) {
          await page.goto(origin + ruta);
          const resultado = await page.evaluate(async () => {
            const caracteres = "Ingeniería · ñ á é í ó ú ü";
            const fuentes = await Promise.all([
              '400 16px "Archivo Black"', '610 16px "Geist Variable"',
            ].map((fuente) => document.fonts.load(fuente, caracteres)));
            return {
              fuentes: fuentes.every((familia) => familia.some((fuente) => fuente.status === "loaded")),
              ancho: document.documentElement.scrollWidth,
              controles: [...document.querySelectorAll(".site-frame a")].map((a) => a.getBoundingClientRect().height).filter(Boolean),
            };
          });
          assert(resultado.fuentes, ruta);
          assert(resultado.ancho <= width, `${ruta} a ${width} px`);
          assert(resultado.controles.every((altura) => altura >= 44), `${ruta} controles a ${width} px`);
          await page.addScriptTag({ path: axe });
          const infracciones = await page.evaluate(async () => (await window.axe.run({
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
          })).violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)]));
          assert.deepEqual(infracciones, [], `${ruta} axe a ${width} px`);
        }
      }
      await page.goto(origin);
      await page.locator(".main h1").evaluate((elemento) => {
        elemento.textContent = "Nombre profesional con apellidos extensos e ingeniería";
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errores, [], "Errores de ejecución e hidratación");
      if (process.env.PORTFOLIO_CAPTURAS === "1") await capturarRevision(browser, origin);
    } finally {
      await browser.close();
    }
  });
});
