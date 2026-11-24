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
import { favicon } from "../app/contenido/publicacion.ts";
import { perfilPublico } from "../app/contenido/perfil-publico.ts";
import { anchos, capturarRevision, vistas } from "./capturas.mjs";
import { perfilAprobado, registroFixture } from "./registro-fixture.mjs";
import { conPages } from "./servidor.mjs";

const ejecutar = promisify(execFile);
const axe = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const publico = "build/client";
const desconocidas = ["/proyectos/slug-desconocido/", "/casos-de-estudio/slug-desconocido/", "/ruta-desconocida/"];
const marcasRevision = /decision-portafolio-revision|separar-proyecto-y-caso|revision-editorial|rfm_rz_paquete_integracion|E04-evidencia-RFM-CORE\.zip|Vista local de revisión|Recurso de revisión local|Registro sintético|Datos de prueba|Tu nombre|Tu foto|Probar con mi foto|data-planned/iu;
const rutaRfm = "/proyectos/rfm-core/";
const slugCasoRfm = "del-interes-comercial-al-contrato";
const rutaCasoRfm = `/casos-de-estudio/${slugCasoRfm}/`;
const tituloCasoRfm = "Del interés comercial al contrato";
const rutaCvPdf = perfilPublico.cvPdf?.revision === "aprobado" ? `/recursos/${perfilPublico.cvPdf.archivo}` : null;
const evidenciasRfm = ["e01-proceso", "e02-trazabilidad", "e03-decisiones", "e04-verificacion"];

const rutaEvidencia = (nombre) => `/recursos/rfm-core/${nombre}`;
const titulos = ["Roberto Zamora · Software Engineering Student", "RFM CORE · Roberto Zamora", `${tituloCasoRfm} · Roberto Zamora`];
const antiguas = [["/proyectos", "/#trabajo"], ["/sobre-mi", "/#sobre-mi"], ["/cv", "/#contacto"], ["/casos-de-estudio", rutaCasoRfm]];

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
    assert.match(html, /href="\/">Volver al inicio/);
    assert.equal(respuesta.headers.get("x-robots-tag"), "noindex");
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
  const recursos = await readdir(join(publico, "recursos"), { recursive: true });
  const pdf = perfilPublico.cvPdf?.revision === "aprobado" ? perfilPublico.cvPdf.archivo : undefined;
  assert.deepEqual(recursos.filter((archivo) => archivo.endsWith(".pdf")).map((archivo) => archivo.replaceAll("\\", "/")), pdf ? [pdf] : []);
  assert(recursos.every((archivo) => !/\.zip$|\.env|\.sqlite|\.pem$/i.test(archivo)));
  const archivos = (await readdir(publico, { recursive: true })).map(ruta => ruta.replaceAll("\\", "/"));
  assert.deepEqual(archivos.filter(f => f.endsWith(".html")).sort(), [
    ...vistas.map(({ ruta }) => ruta.slice(1) + "index.html"), ...evidenciasRfm.map(nombre => rutaEvidencia(nombre).slice(1) + ".html"),
  ].sort());
  assert.deepEqual(archivos.filter(f => f.endsWith(".data")).sort(), vistas.map(({ ruta }) => ruta.slice(1) + "_.data").sort());
  const html = await readFile(join(publico, "index.html"), "utf8");
  assert.match(html, /name="robots" content="noindex"/);
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
  assert.doesNotMatch(html, /<input[^>]+type="file"/);
  if (registroPublico.perfil?.revision !== "aprobado") {
    assert.doesNotMatch(html, /<h1>Roberto Zamora<\/h1>/);
    await comprobarArtefacto(publico, /Tecnología · Procesos · Análisis funcional|Me interesa la conexión entre las necesidades de un negocio|Enfoque en el análisis de procesos, la definición de requisitos|robertozamora421@gmail\.com|Universidad de Las Américas/iu);
  }
  await assert.rejects(readFile(join(publico, "__spa-fallback.html")), { code: "ENOENT" });
  await conPages(publico, async (origin) => {
    const inicio = await fetch(origin);
    assert.equal(inicio.headers.get("x-robots-tag"), "noindex");
    assert.match(inicio.headers.get("cache-control") ?? "", /(?:^|, )no-transform(?:$|,)/);
    const etag = inicio.headers.get("etag");
    assert(etag);
    for (const opciones of [{ method: "HEAD" }, { headers: { "If-None-Match": etag } }, { headers: { Range: "bytes=0-16" } }]) {
      const perdida = await fetch(origin + "/enlace-perdido", opciones);
      assert.equal(perdida.status, 404);
      assert.equal(perdida.headers.get("x-robots-tag"), "noindex");
      if (opciones.method === "HEAD") assert.equal(await perdida.text(), "");
    }
    const robots = await fetch(origin + "/robots.txt");
    assert.equal(robots.status, 200);
    assert.equal(await robots.text(), "User-agent: *\nDisallow:\n");
    const ico = await readFile("recursos-contenido/sitio/favicon.ico");
    assert.equal(ico.readUInt16LE(2), 1);
    assert.equal(ico.readUInt16LE(4), 3);
    for (const [indice, lado] of [16, 32, 48].entries()) {
      const entrada = 6 + indice * 16;
      assert.deepEqual([ico[entrada], ico[entrada + 1]], [lado, lado]);
    }
    for (const ruta of [favicon.ruta, "/favicon.ico"]) {
      const icono = await fetch(origin + ruta);
      assert.equal(icono.status, 200);
      assert.match(icono.headers.get("content-type"), /^image\/(?:x-icon|vnd\.microsoft\.icon)/);
      assert.deepEqual(Buffer.from(await icono.arrayBuffer()), ico);
    }
    await comprobar404(origin, ["/sitemap.xml"]);
    for (const [i, { ruta }] of vistas.entries()) {
      const respuesta = await fetch(origin + ruta);
      assert.equal(respuesta.status, 200, ruta);
      assert.match(respuesta.headers.get("cache-control"), /no-transform/);
      const pagina = await respuesta.text();
      assert(pagina.includes(`<title>${titulos[i]}</title>`) && pagina.includes(`property="og:title" content="${titulos[i]}"`));
      const iconos = pagina.match(/<link rel="icon"[^>]*>/g) ?? [];
      assert.equal(iconos.length, 1, ruta);
      assert(iconos[0].includes(`href="${favicon.ruta}"`), ruta);
      assert(iconos[0].includes(`sizes="${favicon.tamanos}"`), ruta);
      for (const etiqueta of [/name="description"/, /property="og:title"/, /property="og:description"/]) {
        assert.match(pagina, etiqueta, ruta);
      }
      assert.doesNotMatch(pagina, /rel="canonical"|property="og:url"/, ruta);
    }
    const pdf = await fetch(origin + rutaCvPdf);
    assert.equal(pdf.status, 200);
    assert.match(pdf.headers.get("content-type"), /^application\/pdf/);
    assert.equal(pdf.headers.get("content-disposition"), "inline");
    assert.equal(pdf.headers.get("x-robots-tag"), "noindex");
    assert.deepEqual(Buffer.from(await pdf.arrayBuffer()), await readFile(join("recursos-contenido", perfilPublico.cvPdf.archivo)));
    for (const [ruta, destino] of antiguas) {
      for (const origen of [ruta, ruta + "/"]) {
        const respuesta = await fetch(origin + origen, { redirect: "manual" });
        assert.equal(respuesta.status, 301, origen);
        assert.equal(new URL(respuesta.headers.get("location"), origin).href, origin + destino);
      }
    }
    await comprobar404(origin, [...desconocidas, "/404/", "/404.html", "/proyectos/claridez/",
      "/recursos/pruebas/decision-portafolio-revision.txt", "/recursos/ausente.html", "/assets/perdido.js",
      ...antiguas.map(([ruta]) => ruta + "/_.data")]);
  });
});

test("La compilación pública prerenderiza proyectos y casos aprobados de un registro aislado", { timeout: 90_000 }, async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-compilacion-"));
  t.after(() => rm(carpeta, { recursive: true, force: true, maxRetries: 3 }));
  const registro = registroFixture();
  registro.perfil = {
    ...perfilAprobado,
    correo: "talento+qa@example.test",
    enlaces: [{ titulo: "Perfil externo QA", url: "https://example.org/perfil-qa" }],
    whatsapp: { revision: "borrador", numero: "+12025550147" },
  };
  const [base] = registro.proyectos;
  const [casoBase] = registro.casos;
  registro.evidencias.push({ ...registro.evidencias[0], id: "documento-qa", recurso: { archivo: "documento-qa.html" } });
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
    ...casoBase, slug: "otro-caso-qa", proyecto: "otro-proyecto-qa", titulo: "Otro caso QA",
    competencia: undefined, periodo: undefined, aprendizajes: undefined,
  });
  registro.proyectos.push({
    ...base, slug: "borrador-qa", revision: "borrador", nombre: "Borrador aislado QA",
    pagina: { ...base.pagina, revision: "borrador", evidencias: ["archivo-borrador-qa"] },
  }, { ...base, slug: "solo-ficha-qa", nombre: "Proyecto con ficha QA", pagina: undefined },
    { ...base, slug: "otro-proyecto-qa", nombre: "Otro proyecto QA" });
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
  const entradas = ["app", "cloudflare", "package.json", "react-router.config.ts", "tsconfig.json", "vite.config.ts"];
  await Promise.all(entradas.map((entrada) => cp(entrada, join(carpeta, entrada), { recursive: true })));
  await symlink(resolve("node_modules"), join(carpeta, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  await appendFile(join(carpeta, "app/contenido/publico.ts"), `\nObject.assign(registroPublico, ${JSON.stringify(registro)});\n`);
  for (const directorio of ["recursos-contenido", "public"]) await mkdir(join(carpeta, directorio));
  const aprobado = join(carpeta, "recursos-contenido/archivo-aprobado-qa.txt");
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMxoAAAAASUVORK5CYII=", "base64");
  await writeFile(aprobado, "Recurso aprobado QA");
  await writeFile(join(carpeta, "recursos-contenido/documento-qa.html"), "<html><head><title>Documento QA</title></head><body>Documento QA</body></html>");
  await mkdir(join(carpeta, "recursos-contenido/sitio"));
  await cp("recursos-contenido/sitio/rz-social.png", join(carpeta, "recursos-contenido/sitio/rz-social.png"));
  await cp("recursos-contenido/sitio/favicon.ico", join(carpeta, "recursos-contenido/sitio/favicon.ico"));
  await writeFile(join(carpeta, "recursos-contenido", perfilAprobado.retrato.archivo), png);
  await writeFile(join(carpeta, "recursos-contenido/retrato-no-autorizado-qa.png"), png);
  await writeFile(join(carpeta, "recursos-contenido/archivo-borrador-qa.txt"), "Borrador aislado QA");
  await writeFile(join(carpeta, "public/recurso-sin-revision-qa.txt"), "Copia directa QA");
  const compilar = () => ejecutar(process.execPath, ["node_modules/@react-router/dev/bin.cjs", "build"], {
    cwd: carpeta, env: { ...process.env, PORTFOLIO_PREVIEW: "0", PORTFOLIO_ORIGEN: "https://example.org", PORTFOLIO_INDEXAR: "1" }, timeout: 35_000,
  });
  await compilar();

  const salida = join(carpeta, publico);
  await comprobarArtefacto(salida, /borrador-qa|Borrador aislado QA|Caso sin aprobar QA|recurso-sin-revision-qa|Copia directa QA|retrato-no-autorizado-qa/iu);
  await comprobarArtefacto(salida, marcasRevision);
  const [inicio, ficha, detalle, otroProyecto, otroCaso] = await Promise.all([
    "index.html", "proyectos/solucion-qa/index.html", "casos-de-estudio/caso-qa/index.html",
    "proyectos/otro-proyecto-qa/index.html", "casos-de-estudio/otro-caso-qa/index.html",
  ].map((archivo) => readFile(join(salida, archivo), "utf8")));
  assert.match(inicio, /Presentación de portada QA/);
  assert.match(inicio, /href="mailto:talento%2Bqa@example\.test\?subject=/);
  assert.match(inicio, /href="https:\/\/example.org\/perfil-qa"/);
  assert.match(inicio, /<img[^>]+src="\/recursos\/retrato-qa.png"[^>]+alt="Retrato QA"/);
  assert.doesNotMatch(inicio, /12025550147|wa\.me|href="\/casos-de-estudio\//);
  assert.match(ficha, /Presentación de ficha QA/);
  assert.match(ficha, /href="\/casos-de-estudio\/caso-qa\/"/);
  assert.doesNotMatch(ficha, /otro-caso-qa/);
  assert.match(otroProyecto, /href="\/casos-de-estudio\/otro-caso-qa\/"/);
  assert.match(otroCaso, /href="\/proyectos\/otro-proyecto-qa\/"/);
  assert.doesNotMatch(otroCaso, /href="#aprendizajes"/);
  assert.match(detalle, /<title>Caso QA · Roberto Zamora<\/title>/);
  assert.match(detalle, /name="description" content="Resumen QA"/);
  for (const texto of ["Periodo QA", "Aprendizajes QA", "Comprobación pendiente QA", "Medición pendiente QA", "Qué demuestra",
    "Fuente QA", "Autoría QA", "Decisión documentada", "Artefacto de análisis y documentación", "Prueba y resultado verificable",
    "Evidencia técnica", 'href="https://example.org/tecnica-qa"']) assert(detalle.includes(texto), texto);
  const sitemap = await readFile(join(salida, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  assert.deepEqual(urls.toSorted(), ["/", "/proyectos/solucion-qa/", "/proyectos/otro-proyecto-qa/",
    "/casos-de-estudio/caso-qa/", "/casos-de-estudio/otro-caso-qa/", "/recursos/documento-qa",
  ].map((ruta) => `https://example.org${ruta}`).sort());
  assert.match(await readFile(join(salida, "robots.txt"), "utf8"), /Sitemap: https:\/\/example\.org\/sitemap\.xml/);
  assert.match(inicio, /property="og:image" content="https:\/\/example.org\/recursos\/sitio\/rz-social.png"/);

  await conPages(salida, async (origin) => {
    for (const url of urls) {
      const respuesta = await fetch(origin + new URL(url).pathname);
      assert.equal(respuesta.status, 200, url);
      const html = await respuesta.text();
      assert(html.includes(`rel="canonical" href="${url}"`), url);
      assert(html.includes(`property="og:url" content="${url}"`), url);
      assert.doesNotMatch(html, /name="robots" content="noindex"/, url);
    }
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

test("Inicio renderiza las cinco secciones, las anclas y los enlaces en escritorio y móvil", { timeout: 150_000 }, async () => {
  await conPages(publico, async (origin) => {
    const respuesta = await fetch(origin);
    const html = await respuesta.text();
    assert.equal(respuesta.status, 200);
    assert.match(html, /<title>Roberto Zamora · Software Engineering Student<\/title>/);
    assert.match(html, /name="description" content="Estudiante de 8vo semestre de Ingeniería de Software/);
    assert.match(html, /property="og:title" content="Roberto Zamora · Software Engineering Student"/);
    for (const id of ["inicio", "trabajo", "aportacion", "sobre-mi", "contacto"]) assert.match(html, new RegExp(`id="${id}"`));
    assert.doesNotMatch(html, /raw\.githubusercontent\.com|fonts\.googleapis\.com|MAQUETA CONCEPTUAL/);
    assert.doesNotMatch(html, /Recurso conceptual|editorial-proof|171\/171|Reglas de negocio con trazabilidad documentada|La trazabilidad relaciona reglas|Consultar evidencias/);

    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    try {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin });
      const errores = [];
      page.on("pageerror", (error) => errores.push(error.message));
      page.on("console", (mensaje) => { if (mensaje.type() === "error") errores.push(mensaje.text()); });
      page.on("response", (respuesta) => {
        if (respuesta.url().startsWith(origin) && respuesta.status() >= 400) errores.push(respuesta.url());
      });
      const hero = page.locator("#inicio");
      const trabajo = page.locator("#trabajo");
      const contacto = page.locator("#contacto");
      const accionesContacto = contacto.locator(".editorial-contact__actions");
      const pieContacto = page.getByRole("contentinfo");
      const menu = page.locator(".editorial-menu summary");
      const nav = page.getByRole("navigation", { name: "Principal" });
      for (const width of anchos) {
        const esMovil = width <= 730;
        await page.setViewportSize({ width, height: 840 });
        await page.goto(origin);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map((imagen) => {
            imagen.loading = "eager";
            return imagen.decode();
          }));
        });
        assert.match(await hero.getByRole("heading", { level: 1 }).innerText(), /Del análisis\s+a la solución\./);
        assert.doesNotMatch(await hero.innerText(), /RFM CORE|Claridez|Presentación profesional/);
        assert.equal(await hero.locator("figcaption strong").textContent(), "Roberto David Zamora Alcívar");
        assert.equal(await hero.locator("figcaption span").textContent(), "Quito · Ecuador");
        const accionesHero = ["#trabajo", rutaCvPdf, "#contacto"];
        const fila = await hero.getByRole("link").evaluateAll((links) => links.map((link) => {
          const { left, right, top, height } = link.getBoundingClientRect();
          return { href: link.getAttribute("href"), left, right, centro: top + height / 2 };
        }));
        assert.deepEqual(fila.map(({ href }) => href), accionesHero);
        assert(fila.every(({ centro, left, right }, indice) => (
          Math.abs(centro - fila[0].centro) < 1 && left >= (fila[indice - 1]?.right ?? 0) && right <= width
        )), `Acciones en una sola fila a ${width} px`);
        const [foto, titular, ficha, acciones] = await Promise.all(
          ["img", "h1", "figure", ".editorial-hero__actions"].map((s) => hero.locator(s).boundingBox()),
        );
        if (esMovil) {
          assert(foto.width < width / 2 && acciones.y + acciones.height <= foto.y, `Retrato y acciones a ${width} px`);
        } else {
          assert(foto.x + foto.width < titular.x && ficha.y + ficha.height <= acciones.y, `Dos columnas a ${width} px`);
          if (width >= 1280) assert(foto.width >= 280 && foto.width <= 320, `Ancho del retrato a ${width} px`);
        }
        assert.deepEqual(await trabajo.getByRole("heading", { level: 3 }).allTextContents(), ["RFM CORE", "Claridez"]);
        for (const proyecto of registroPublico.proyectos) {
          const repositorio = trabajo.getByRole("link", { name: new RegExp(`repositorio de ${proyecto.nombre}`, "i") });
          assert.equal(await repositorio.getAttribute("href"), proyecto.repositorio);
        }
        const [rfm, claridez] = await trabajo.getByRole("article").all();
        assert.deepEqual((await rfm.getByRole("link").allTextContents()).map(t => t.replace("↗", "").trim()),
          ["Explorar el proyecto", "Ver aplicación", "Repositorio"]);
        assert.equal(await rfm.getByRole("link", { name: /Ver aplicación/ }).getAttribute("href"), "https://ranchoflormaria.com/login");
        assert.equal(await claridez.getByRole("link").count(), 1);
        assert.equal(await page.locator("#aportacion h3").count(), 4);
        assert.match(await page.locator("#sobre-mi").innerText(), /Universidad de Las Américas \(UDLA\)[\s\S]*Rancho Flor María/);
        const tituloContacto = contacto.getByRole("heading", { name: "Trabajemos juntos.", exact: true });
        const lineasContacto = await tituloContacto.evaluate((titulo) => {
          const rango = document.createRange();
          rango.selectNodeContents(titulo);
          return rango.getClientRects().length;
        });
        if (!esMovil) assert.equal(lineasContacto, 1, `Titular de contacto a ${width} px`);
        assert.doesNotMatch(await pieContacto.innerText(), /Roberto Zamora · Ecuador/);
        const medidas = await page.evaluate(async () => {
          const fuentes = await Promise.all([
            '500 68px "Newsreader Variable"', 'italic 400 68px "Newsreader Variable"', '600 16px "DM Sans Variable"',
          ].map((fuente) => document.fonts.load(fuente, "Ingeniería · solución")));
          const titulos = [...document.querySelectorAll("main h1, main h2, main h3")].flatMap((titulo) => {
            const rango = document.createRange();
            rango.selectNodeContents(titulo);
            return [...rango.getClientRects()].filter(({ width }) => width > 0).map(({ left, right }) => [left, right]);
          });
          return {
            ancho: document.documentElement.scrollWidth,
            titulos,
            fuentes: fuentes.every((caras) => caras.some((cara) => cara.status === "loaded")),
            movimiento: getComputedStyle(document.documentElement).scrollBehavior,
            controles: [...document.querySelectorAll("header a, header summary, .editorial-actions a, .editorial-actions button, .editorial-project__links a, footer a")]
              .map((control) => control.getBoundingClientRect().height).filter(Boolean),
          };
        });
        assert(medidas.ancho <= width && medidas.titulos.every(([left, right]) => left >= 0 && right <= width), `${width} px`);
        assert(medidas.fuentes, "Tipografías locales y cursiva en la portada");
        assert.equal(medidas.movimiento, "auto");
        assert(medidas.controles.every((altura) => altura >= 44), `Acciones a ${width} px`);
        await page.addScriptTag({ path: axe });
        await comprobarAccesibilidad(page, `Inicio a ${width} px`);

        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "#contenido");
        assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
        await page.keyboard.press("Enter");
        assert.equal(await page.evaluate(() => document.activeElement.id), "contenido");
        assert.equal(await menu.isVisible(), esMovil);
        if (esMovil) {
          await menu.press("Enter");
          await nav.waitFor();
          await comprobarAccesibilidad(page, `Menú móvil abierto a ${width} px`);
          await page.keyboard.press("Tab");
          assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "/#trabajo");
          await page.keyboard.press("Escape");
          assert(await menu.evaluate((control) => control === document.activeElement && !control.parentElement.open));
        }
        for (const [ancla, enlace] of [["trabajo", "Mi trabajo"], ["aportacion", "Cómo aporto"], ["sobre-mi", "Sobre mí"], ["contacto", "Hablemos"]]) {
          if (esMovil) await menu.press("Enter");
          await nav.getByRole("link", { name: enlace, exact: true }).press("Enter");
          await page.waitForFunction((id) => {
            const seccion = document.getElementById(id);
            return location.hash === `#${id}` && document.activeElement === seccion
              && seccion.getBoundingClientRect().top >= document.querySelector(".editorial-header").getBoundingClientRect().bottom;
          }, ancla);
          if (esMovil) assert.equal(await nav.isVisible(), false);
        }
        const whatsapp = accionesContacto.getByRole("link", { name: "WhatsApp", exact: true });
        const correo = accionesContacto.getByRole("link", { name: "Correo", exact: true });
        const cv = accionesContacto.getByRole("link", { name: /^Ver CV/ });
        const numero = perfilPublico.whatsapp.numero;
        assert.equal(await whatsapp.getAttribute("href"), `https://wa.me/${numero.slice(1)}`);
        assert.equal(await whatsapp.getAttribute("target"), "_blank");
        assert.equal(await cv.getAttribute("href"), rutaCvPdf);
        assert.equal(await cv.getAttribute("target"), "_blank");
        const destino = new URL(await correo.getAttribute("href"));
        assert.equal(destino.protocol, "mailto:");
        assert.equal(destino.pathname, perfilPublico.correo);
        assert.equal(destino.searchParams.get("subject"), "Oportunidad profesional - Roberto Zamora");
        for (const [enlace, etiqueta, mensaje, dato] of [
          [whatsapp, "Copiar número de WhatsApp", "Número copiado", numero],
          [correo, "Copiar correo", "Correo copiado", perfilPublico.correo],
        ]) {
          await page.keyboard.press("Tab");
          assert(await enlace.evaluate((control) => control === document.activeElement));
          await page.keyboard.press("Tab");
          const copiar = accionesContacto.getByRole("button", { name: etiqueta });
          assert(await copiar.evaluate((control) => control === document.activeElement && control.matches(":focus-visible")));
          await page.keyboard.press("Space");
          await contacto.getByRole("status").getByText(mensaje, { exact: true }).waitFor();
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), dato);
        }
        await page.keyboard.press("Tab");
        assert(await cv.evaluate((control) => control === document.activeElement));
        for (const { titulo, url } of perfilPublico.enlaces) {
          assert.equal(await pieContacto.getByRole("link", { name: titulo, exact: true }).getAttribute("href"), url);
        }
        await pieContacto.getByRole("link", { name: /Volver al inicio/ }).press("Enter");
        await page.waitForURL(origin + "/");
      }

      await page.goto(origin);
      await page.evaluate(() => { window.mismaSesion = true; });
      await trabajo.getByRole("link", { name: "Explorar el proyecto" }).press("Enter");
      await page.waitForURL(origin + rutaRfm);
      assert(await page.evaluate(() => window.mismaSesion));
      await page.getByRole("heading", { name: "RFM CORE", level: 1 }).waitFor();
      await page.getByRole("link", { name: /^Leer caso de estudio/ }).press("Enter");
      await page.waitForURL(origin + rutaCasoRfm);
      const fichas = page.getByRole("region", { name: "Evidencias", exact: true });
      for (const nombre of evidenciasRfm) {
        const href = rutaEvidencia(nombre);
        assert(await fichas.locator(`a[href="${href}"]`).count(), href);
        assert.equal((await fetch(origin + href)).status, 200, href);
      }
      assert.deepEqual(errores, []);

      const simple = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 840 } });
      try {
        await simple.goto(origin);
        await simple.locator(".editorial-menu summary").press("Space");
        await simple.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Hablemos" }).press("Enter");
        assert.equal(await simple.locator(":target").getAttribute("id"), "contacto");
        const accesos = simple.getByRole("link", { name: /^Ver CV/ });
        assert.equal(await accesos.count(), 3);
        for (const acceso of await accesos.all()) {
          assert.equal(await acceso.getAttribute("href"), rutaCvPdf);
          assert.equal(await acceso.getAttribute("target"), "_blank");
          assert.equal(await acceso.getAttribute("download"), null);
        }
        assert.equal(await simple.getByRole("contentinfo").getByRole("link", { name: "Correo", exact: true }).getAttribute("href"), `mailto:${perfilPublico.correo}`);
        assert.equal(await simple.getByRole("link", { name: "WhatsApp", exact: true }).getAttribute("href"), `https://wa.me/${perfilPublico.whatsapp.numero.slice(1)}`);
        assert.equal(await simple.locator("#contacto").getByRole("button", { name: /^Copiar/ }).count(), 0);
      } finally {
        await simple.close();
      }
      if (process.env.PORTFOLIO_CAPTURAS === "1") await capturarRevision(browser, origin);
    } finally {
      await browser.close();
    }
  });
});

test("Cabecera global, compatibilidad de enlaces y regreso con y sin JavaScript", { timeout: 150_000 }, async () => {
  await conPages(publico, async (origin) => {
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    const anclas = ["/#trabajo", "/#aportacion", "/#sobre-mi", "/#contacto"];
    const enlaces = [anclas[0], anclas[1], anclas[2], rutaCvPdf, anclas[3]];
    try {
      for (const javaScriptEnabled of [true, false]) {
        const page = await browser.newPage({ javaScriptEnabled, reducedMotion: "reduce" });
        for (const [ruta, destino] of [...antiguas.map(([ruta, destino]) => [ruta + "/", destino]), ["/cv/#contacto", "/#contacto"]]) {
          assert.equal((await page.goto(origin + ruta)).status(), 200);
          assert.equal(page.url(), origin + destino);
          if (destino.includes("#")) assert.equal(await page.locator(":target").getAttribute("id"), destino.split("#")[1]);
        }
        const perdida = await page.goto(origin + "/este-enlace-no-existe/");
        assert.equal(perdida.status(), 404);
        await page.getByRole("link", { name: "Volver al inicio del portafolio" }).press("Enter");
        await page.waitForURL(origin + "/");

        for (const width of [1440, 390]) {
          await page.setViewportSize({ width, height: 840 });
          for (const { ruta } of vistas) {
            for (const destino of anclas) {
              await page.goto(origin + ruta);
              const cabecera = page.getByRole("banner");
              assert.equal(await cabecera.getByRole("link", { name: /RZ/ }).getAttribute("href"), "/");
              if (width === 390) await cabecera.locator("summary").press("Enter");
              const nav = cabecera.getByRole("navigation", { name: "Principal" });
              assert.deepEqual(await nav.getByRole("link").evaluateAll(lista => lista.map(a => a.getAttribute("href"))), enlaces);
              await nav.locator(`a[href="${destino}"]`).press("Enter");
              await page.waitForURL(origin + destino);
              assert.equal(await page.locator(":target").getAttribute("id"), destino.slice(2));
            }
          }
        }
        await page.goto(origin + rutaCasoRfm);
        await page.getByRole("link", { name: "Volver a RFM CORE" }).press("Enter");
        await page.getByRole("link", { name: "Volver a mi trabajo" }).press("Enter");
        await page.waitForURL(origin + "/#trabajo");
        await page.close();
      }

      const page = await browser.newPage();
      const revisados = new Set();
      for (const ruta of [...vistas.map(v => v.ruta), ...evidenciasRfm.map(rutaEvidencia)]) {
        await page.goto(origin + ruta);
        const destinos = await page.locator("a[href]").evaluateAll(enlaces => enlaces.map(a => a.href));
        for (const href of destinos) {
          const url = new URL(href);
          if (url.origin !== origin || revisados.has(href)) continue;
          revisados.add(href);
          assert(!antiguas.some(([ruta]) => ruta === url.pathname.replace(/\/$/, "")), href);
          const respuesta = await page.request.get(href);
          assert.equal(respuesta.status(), 200, href);
          if (url.hash) assert((await respuesta.text()).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), href);
        }
      }
      await page.goto(origin + rutaRfm);
      assert.equal(await page.getByRole("link", { name: /Ver aplicación/ }).getAttribute("href"), "https://ranchoflormaria.com/login");
      assert.equal(await page.getByRole("link", { name: /Repositorio de RFM CORE/ }).getAttribute("href"), registroPublico.proyectos[0].repositorio);
      assert.equal(await page.locator(".page-intro a").filter({ hasText: /caso de estudio/i }).count(), 0);
      const [pdf] = await Promise.all([
        page.context().waitForEvent("response", res => res.url() === origin + rutaCvPdf),
        page.getByRole("banner").getByRole("link", { name: /^Ver CV/ }).click(),
      ]);
      assert.equal(pdf.status(), 200);
      assert.match((await pdf.allHeaders())["content-type"], /^application\/pdf/);
      await page.close();
    } finally {
      await browser.close();
    }
  });
});

test("RFM CORE se puede recorrer con sus cuatro evidencias y sus límites", {
  timeout: 240_000,
}, async () => {
  assert.equal(registroPublico.casos.find(({ slug }) => slug === slugCasoRfm).evidencias.length, 4);
  await conPages(publico, async (origin) => {
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
    {
      for (const evidencia of evidenciasRfm) {
        const ruta = rutaEvidencia(evidencia);
        const archivo = `rfm-core/${evidencia}.html`;
        const anterior = await fetch(origin + ruta + ".html", { redirect: "manual" });
        assert.equal(anterior.status, 308);
        assert.equal(new URL(anterior.headers.get("location"), origin).pathname, ruta);
        const documento = await fetch(origin + ruta);
        assert.equal(documento.status, 200, ruta);
        const recurso = await readFile(join("recursos-contenido", archivo), "utf8");
        const html = await documento.text();
        assert.equal(html.split("</head>")[1], recurso.split("</head>")[1], ruta);
        const iconos = html.match(/<link rel="icon"[^>]*>/g) ?? [];
        assert.equal(iconos.length, 1, ruta);
        assert(iconos[0].includes(`href="${favicon.ruta}"`), ruta);
        assert.match(html, /property="og:title"/);
        assert.equal(documento.headers.get("x-robots-tag"), "noindex");
      }
    }

    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    try {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      const errores = [];
      page.on("pageerror", (error) => errores.push(error.message));
      page.on("console", (mensaje) => { if (mensaje.type() === "error") errores.push(mensaje.text()); });
      await page.goto(origin);
      const enlaceDestacado = page.locator("#trabajo").getByRole("link", { name: "Leer el caso de estudio" });
      assert.equal(await enlaceDestacado.count(), 0);
      for (const [ruta, enlace, titulo] of [
        [rutaRfm, "Explorar el proyecto", "RFM CORE"], [rutaCasoRfm, /^Leer caso de estudio/, tituloCasoRfm],
      ]) {
        const datos = page.waitForResponse((respuesta) => new URL(respuesta.url()).pathname === ruta + "_.data");
        await page.getByRole("link", { name: enlace, exact: true }).press("Enter");
        assert.equal((await datos).status(), 200, ruta);
        await page.getByRole("heading", { name: titulo, exact: true }).waitFor();
      }
      await page.getByRole("link", { name: "Volver a RFM CORE", exact: true }).press("Enter");
      await page.getByRole("heading", { name: "RFM CORE", exact: true }).waitFor();

      for (const ancho of anchos) {
        await page.setViewportSize({ width: ancho, height: 840 });
        for (const ruta of [rutaRfm, rutaCasoRfm, ...evidenciasRfm.map(rutaEvidencia)]) {
          const respuesta = await page.goto(origin + ruta);
          assert.equal(respuesta.status(), 200, ruta);
          const medida = await page.evaluate(async (esEvidencia) => {
            const fuentes = await Promise.all(['400 16px "Archivo Black"', esEvidencia ? '610 16px "Geist Variable"' : '600 16px "DM Sans Variable"']
              .map((fuente) => document.fonts.load(fuente, "Análisis")));
            return {
              controles: esEvidencia ? [] : [...document.querySelectorAll("header a, main a, summary, footer a")]
                .map(control => control.getBoundingClientRect().height).filter(Boolean),
              fuentes: fuentes.every((caras) => caras.some((cara) => cara.status === "loaded")),
              ancho: document.documentElement.scrollWidth,
            };
          }, ruta.startsWith("/recursos/"));
          assert(medida.fuentes && medida.ancho <= ancho, `${ruta} a ${ancho} px`);
          assert(medida.controles.every(altura => altura >= 44), `Controles de ${ruta} a ${ancho} px`);
          await page.addScriptTag({ path: axe });
          await comprobarAccesibilidad(page, `${ruta} a ${ancho} px`);
        }

        {
          await page.goto(origin + rutaRfm);
          const producto = page.getByRole("region", { name: "El producto", exact: true });
          assert.deepEqual(await producto.getByRole("img").evaluateAll((imagenes) => Promise.all(imagenes.map(async (img) => {
            img.loading = "eager";
            await img.decode();
            return [img.naturalWidth, img.naturalHeight];
          }))), [[1440, 910], [1088, 725]]);
          for (const enlace of await producto.getByRole("link").all()) {
            const respuesta = await fetch(origin + await enlace.getAttribute("href"));
            assert.equal(respuesta.status, 200);
            assert.match(respuesta.headers.get("content-type"), /^image\/(webp|png)/);
            await respuesta.body.cancel();
          }
        }
        await page.goto(origin + rutaCasoRfm);
        const breve = page.getByRole("region", { name: "El caso en breve", exact: true });
        const sintesis = await breve.innerText();
        for (const texto of ["Problema", "Mi responsabilidad", "Único desarrollador", "Decisiones principales",
          "Resultados verificables", "nueve reglas de negocio", "171/171", "SQLite", "datos sintéticos", "Consultar evidencias"]) {
          assert(sintesis.includes(texto), texto);
        }
        await breve.getByRole("link", { name: "Ver el detalle técnico" }).press("Enter");
        await page.waitForFunction(() => document.activeElement.id === "detalle-tecnico");
        const ejemplo = page.getByRole("region", { name: "Cuándo se exige un paquete", exact: true });
        for (const [enlace, archivo, ancla] of [
          ["RN-03 · Regla de negocio", "e02-trazabilidad", "rn-03"],
          ["QA-06 · Prueba de conversión", "e04-verificacion", "qa-06"],
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
        await indice.locator('a[href="#evidencias"][aria-current="location"]').first().waitFor({ state: "attached" });
        if (await resumen.isVisible()) assert.equal(await resumen.evaluate(el => el.parentElement.open), false);
        const fichas = page.getByRole("region", { name: "Evidencias", exact: true }).getByRole("article");
        assert.equal(await fichas.count(), 4);
        for (const [indice, evidencia] of evidenciasRfm.entries()) {
          const tarjeta = fichas.nth(indice);
          assert.match(await tarjeta.innerText(), /Fuente o versión[\s\S]*Autoría/);
          assert.match(await tarjeta.getByRole("heading").textContent(), new RegExp(`^E0${indice + 1} —`));
          const enlace = tarjeta.getByRole("link");
          assert.equal(await enlace.getAttribute("href"), rutaEvidencia(evidencia));
          await enlace.press("Enter");
          await page.getByRole("heading", { level: 1, name: new RegExp(`^E0${indice + 1} —`) }).waitFor();
          if (evidencia === "e04-verificacion") {
            const resultados = await page.getByRole("table").innerText();
            for (const total of ["19 de 19", "149 de 149", "171 de 171"]) assert(resultados.includes(total), total);
            assert.equal(await page.getByRole("columnheader", { name: "Aprobadas", exact: true }).evaluate((th) => {
              const texto = document.createRange();
              texto.selectNodeContents(th);
              return texto.getClientRects().length;
            }), 1, `Aprobadas a ${ancho} px`);
          }
          await page.getByRole("link", { name: /Volver al caso/ }).press("Enter");
          await page.waitForURL(origin + rutaCasoRfm + "#evidencias");
        }

        await page.goto(origin + rutaCasoRfm + "#validacion");
        await page.locator('.case-index a[href="#validacion"][aria-current="location"]').first().waitFor({ state: "attached" });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.locator('.case-index a[href="#aprendizajes"][aria-current="location"]').first().waitFor({ state: "attached" });

        await page.goto(origin + rutaEvidencia("e01-proceso"));
        await page.getByText("Ampliar el diagrama completo", { exact: true }).press("Enter");
        const visor = page.getByRole("region", { name: "Visor del diagrama a tamaño original" });
        await visor.getByRole("img").waitFor();
        const anchosImagenes = await page.getByRole("img").evaluateAll((imagenes) => Promise.all(imagenes.map(async (imagen) => {
          await imagen.decode();
          return imagen.naturalWidth;
        })));
        assert.deepEqual(anchosImagenes, [1400, 1088]);
        assert(await visor.evaluate((elemento) => elemento.scrollWidth > elemento.clientWidth && document.documentElement.scrollWidth <= innerWidth));
        await visor.press("ArrowRight");
        await page.waitForFunction(() => document.querySelector(".diagram-view").scrollLeft > 0);
        await page.addScriptTag({ path: axe });
        await comprobarAccesibilidad(page, `E01 ampliado a ${ancho} px`);
      }
      assert.deepEqual(errores, [], "Errores de ejecución e hidratación");
    } finally {
      await browser.close();
    }
  });
});
