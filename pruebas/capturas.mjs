import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const carpeta = ".local/revision-rz";
const prototipo = "docs/referencias/incremento-2/portafolio-rz.html";
export const anchos = [1280, 390, 320];
export const vistas = [
  { nombre: "Inicio", clave: "inicio", ruta: "/", referencia: "inicio" },
  { nombre: "Proyectos", clave: "proyectos", ruta: "/proyectos/", referencia: "proyectos" },
  { nombre: "Ficha individual", clave: "ficha", ruta: "/proyectos/portafolio-web/", referencia: "ficha" },
];
export const vistasCasos = [
  { nombre: "Catálogo en revisión", clave: "catalogo", ruta: "/casos-de-estudio/" },
  { nombre: "Caso en revisión", clave: "caso", ruta: "/casos-de-estudio/separar-proyecto-y-caso/" },
];

export async function capturarPerfil(browser, origin, candidata = false) {
  const destino = candidata ? ".local/revision-incremento-4" : ".local/revision-incremento-3b";
  const titulo = candidata ? "RZ. · Candidata del portafolio" : "RZ. · Revisión del incremento 3B";
  const vistas = [
    { nombre: "Inicio", clave: "inicio", ruta: "/" },
    ...(candidata ? [
      { nombre: "Proyectos", clave: "proyectos", ruta: "/proyectos/" },
      { nombre: "RFM CORE", clave: "rfm-core", ruta: "/proyectos/rfm-core/" },
      { nombre: "Casos de estudio", clave: "casos", ruta: "/casos-de-estudio/" },
      { nombre: "Del interés comercial al contrato", clave: "caso-rfm", ruta: "/casos-de-estudio/del-interes-comercial-al-contrato/" },
    ] : []),
    { nombre: "Sobre mí", clave: "sobre-mi", ruta: "/sobre-mi/" },
    { nombre: "CV y contacto", clave: "cv", ruta: "/cv/" },
  ];
  await mkdir(destino, { recursive: true });
  const page = await browser.newPage();
  try {
    for (const ancho of anchos) {
      await page.setViewportSize({ width: ancho, height: 840 });
      for (const { ruta, clave } of vistas) {
        const respuesta = await page.goto(origin + ruta);
        assert.equal(respuesta.status(), 200, ruta);
        await page.evaluate(async () => { await document.fonts.ready; });
        await page.screenshot({ path: join(destino, `${clave}-${ancho}.png`), fullPage: true });
      }
    }
  } finally {
    await page.close();
  }
  const galeria = anchos.map((ancho) => `<section><h2>${ancho} px</h2><div class="capturas">${vistas.map(({ nombre, clave }) => {
    const archivo = `${clave}-${ancho}.png`;
    return `<figure><a href="${archivo}"><img loading="lazy" src="${archivo}" alt="${nombre} a ${ancho} px"></a><figcaption>${nombre}</figcaption></figure>`;
  }).join("")}</div></section>`).join("");
  await writeFile(join(destino, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
    <title>${titulo}</title>
    <style>body{margin:0 auto;padding:1.25rem;max-width:85rem;background:#f2f1e9;color:#191e19;font:16px/1.5 system-ui}
    a{color:#30503c}a:focus-visible{outline:2px solid #30503c;outline-offset:3px}section{margin-block:2rem}
    .capturas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;align-items:start}
    figure{margin:0}img{display:block;max-width:100%;border:1px solid #c9cec1}figcaption{font-weight:600}
    @media(max-width:700px){.capturas{grid-template-columns:1fr}}</style></head>
    <body><main><h1>${titulo}</h1>
    <p>Abre una captura para verla a tamaño completo.</p>
    ${galeria}</main></body></html>`);
}

export async function capturarIncremento5a(browser, anterior, actual) {
  const destino = ".local/revision-incremento-5a";
  const vistas = [
    ["inicio", "/", "Inicio"],
    ["proyecto", "/proyectos/rfm-core/", "RFM CORE"],
    ["caso", "/casos-de-estudio/del-interes-comercial-al-contrato/", "Caso de estudio"],
    ["perfil", "/sobre-mi/", "Sobre mí"],
    ["cv", "/cv/#contacto", "CV y contacto"],
    ["e04", "/recursos/rfm-core/e04-verificacion.html", "Tabla de E04"],
  ];
  const versiones = [["antes", anterior, "Antes"], ["despues", actual, "5A"]];
  await mkdir(destino, { recursive: true });
  const page = await browser.newPage();
  try {
    for (const ancho of anchos) {
      await page.setViewportSize({ width: ancho, height: 840 });
      for (const [clave, ruta] of vistas) {
        for (const [version, origen] of versiones) {
          assert.equal((await page.goto(origen + ruta)).status(), 200, ruta);
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all([...document.images].map(async (img) => {
              img.loading = "eager";
              await img.decode();
            }));
          });
          const path = join(destino, `${clave}-${ancho}-${version}.png`);
          if (clave === "e04") await page.locator("table").screenshot({ path });
          else {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path, fullPage: true, animations: "disabled" });
          }
        }
      }
    }
  } finally {
    await page.close();
  }
  const comparaciones = anchos.map((ancho) => `<section><h2>${ancho} px</h2>${vistas.map(([clave, , nombre]) => `
    <h3>${nombre}</h3><div class="par">${versiones.map(([version, , etiqueta]) => {
      const archivo = `${clave}-${ancho}-${version}.png`;
      return `<figure><figcaption>${etiqueta}</figcaption><a href="${archivo}"><img loading="lazy" src="${archivo}" alt="${nombre} · ${etiqueta} · ${ancho} px"></a></figure>`;
    }).join("")}</div>`).join("")}</section>`).join("");
  await writeFile(join(destino, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
    <title>RZ. · Revisión del incremento 5A</title>
    <style>body{margin:auto;padding:1.25rem;max-width:86rem;background:#f2f1e9;color:#191e19;font:16px/1.5 system-ui}
    h2{border-top:1px solid #c9cec1;padding-top:1rem}figure{margin:0}img{display:block;max-width:100%;border:1px solid #c9cec1}
    figcaption{font-weight:650}.par{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;align-items:start}
    @media(max-width:650px){.par{grid-template-columns:1fr}}</style></head>
    <body><main><h1>RZ. · Incremento 5A</h1>
    <p>Abre una captura para verla a tamaño completo.</p>${comparaciones}</main></body></html>`);
}

export async function capturarRevision(browser, origin) {
  await mkdir(carpeta, { recursive: true });
  const app = await browser.newPage();
  const referencia = await browser.newPage();

  try {
    await referencia.goto(origin);
    const css = await referencia.locator('link[rel="stylesheet"]').first().getAttribute("href");
    const html = (await readFile(prototipo, "utf8")).replace(/^<link[^>]*>\s*/, "");
    await referencia.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${css}">
      <style>*,*::before,*::after{box-sizing:border-box}body{margin:0}</style></head>
      <body>${html}<style>#portafolio-rz{--body-font:"Geist Variable","Segoe UI",Arial,sans-serif}</style></body></html>`);

    for (const ancho of anchos) {
      await app.setViewportSize({ width: ancho, height: 840 });
      await referencia.setViewportSize({ width: ancho, height: 840 });
      for (const { clave, ruta, referencia: vista } of vistas) {
        await app.goto(origin + ruta);
        await referencia.locator("[data-view]").selectOption(vista);
        await Promise.all([app, referencia].map((pagina) => pagina.evaluate(async () => {
          for (const fuente of ['400 16px "Archivo Black"', '610 16px "Geist Variable"']) {
            const caras = await document.fonts.load(fuente, "Ingeniería");
            if (!caras.some((cara) => cara.status === "loaded")) throw new Error(`Falta la fuente ${fuente}`);
          }
        })));
        const sitio = referencia.locator("#portafolio-rz .site");
        assert.equal(Math.round((await sitio.boundingBox()).width), ancho);
        await sitio.screenshot({ path: join(carpeta, `${clave}-${ancho}-maqueta.png`) });
        await app.locator(".site-frame").screenshot({ path: join(carpeta, `${clave}-${ancho}.png`) });
      }
    }
  } finally {
    await Promise.all([app.close(), referencia.close()]);
  }

  const comparaciones = anchos.map((ancho) => `<section><h2>${ancho} px</h2>${vistas.map(({ nombre, clave }) => `
    <h3>${nombre}</h3><div class="par">${[["Maqueta RZ.", "-maqueta"], ["Aplicación local", ""]].map(([origen, sufijo]) => {
      const imagen = `${clave}-${ancho}${sufijo}.png`;
      return `<figure><figcaption>${origen}</figcaption><a href="${imagen}"><img loading="lazy" src="${imagen}" alt="${nombre}, ${origen}, ${ancho} px"></a></figure>`;
    }).join("")}</div>`).join("")}</section>`).join("");
  await writeFile(join(carpeta, "index.html"), `<!doctype html><html lang="es"><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>Revisión visual de RZ.</title>
    <style>body{margin:0 auto;padding:1.5rem;max-width:85rem;background:#f2f1e9;color:#191e19;font:16px/1.5 system-ui}
    h2{border-top:1px solid #c9cec1;padding-top:1rem}figure{margin:0}img{display:block;width:auto;max-width:100%;border:1px solid #c9cec1}
    figcaption{margin-bottom:.5rem;font-weight:600}.par{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
    @media(max-width:640px){.par{grid-template-columns:1fr}}</style><main><h1>Revisión visual de RZ.</h1>
    <p>Prototipo aprobado e implementación local. Abre una imagen para verla a tamaño completo.</p>${comparaciones}</main></html>`);
}

export async function capturarCasos(browser, revision, publico) {
  const destino = ".local/revision-incremento-3a";
  const capturas = [...vistasCasos, { ...vistasCasos[0], nombre: "Catálogo público", clave: "publico" }];
  const indicesMoviles = new Set();
  await mkdir(destino, { recursive: true });
  const page = await browser.newPage();
  try {
    for (const width of anchos) {
      await page.setViewportSize({ width, height: 840 });
      for (const { clave, ruta } of capturas) {
        await page.goto((clave === "publico" ? publico : revision) + ruta);
        if (clave === "caso") await page.locator(".case-index a[aria-current='location']").first().waitFor({ state: "attached" });
        await page.screenshot({ path: join(destino, `${clave}-${width}.png`), fullPage: true });
        const indice = page.locator(".case-index summary");
        if (clave === "caso" && await indice.isVisible()) {
          await indice.click();
          await page.mouse.move(0, 0);
          await page.locator(".case-index").screenshot({ path: join(destino, `indice-${width}.png`) });
          indicesMoviles.add(width);
        }
      }
    }
  } finally {
    await page.close();
  }

  const galeria = anchos.map((ancho) => {
    const imagenes = indicesMoviles.has(ancho) ? [...capturas, { nombre: "Índice móvil desplegado", clave: "indice" }] : capturas;
    return `<section><h2>${ancho} px</h2><div class="capturas">${imagenes.map(({ nombre, clave }) => {
      const imagen = `${clave}-${ancho}.png`;
      return `<figure><figcaption>${nombre}</figcaption><a href="${imagen}"><img loading="lazy" src="${imagen}" alt="${nombre} a ${ancho} px"></a></figure>`;
    }).join("")}</div></section>`;
  }).join("");
  await writeFile(join(destino, "index.html"), `<!doctype html><html lang="es"><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>Revisión del incremento 3A</title>
    <style>body{margin:0 auto;padding:1.5rem;max-width:85rem;background:#f2f1e9;color:#191e19;font:16px/1.5 system-ui}
    h2{border-top:1px solid #c9cec1;padding-top:1rem}figure{margin:0}img{display:block;max-width:100%;border:1px solid #c9cec1}
    figcaption{margin-bottom:.5rem;font-weight:600}.capturas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
    @media(max-width:640px){.capturas{grid-template-columns:1fr}}</style><main><h1>Incremento 3A · Casos de estudio y evidencias</h1>
    <p>El caso del portafolio usa material de revisión local. Abre una imagen para verla a tamaño completo.</p>${galeria}</main></html>`);
}

export async function capturarEditorial(browser, origin, rutas, evidenciasCandidatas) {
  const destino = evidenciasCandidatas ? ".local/candidata-rfm-core" : ".local/revision-editorial-rfm-core-v2";
  const titulo = evidenciasCandidatas ? "RFM CORE · Versión candidata RZ." : "RFM CORE · Segunda revisión editorial RZ.";
  const comando = evidenciasCandidatas
    ? "npx wrangler pages dev build/client --ip 127.0.0.1 --port 8789"
    : "npm run preview:prueba";
  const urlLocal = `http://127.0.0.1:${evidenciasCandidatas ? 8789 : 8788}`;
  await mkdir(destino, { recursive: true });
  const page = await browser.newPage();
  const capturas = [];
  try {
    for (const ancho of anchos) {
      await page.setViewportSize({ width: ancho, height: 840 });
      await page.goto(origin + rutas.caso);
      await page.locator(".case-index a[aria-current='location']").first().waitFor({ state: "attached" });
      const imagenes = [{ nombre: "Caso completo", archivo: `caso-${ancho}.png` }];
      await page.screenshot({ path: join(destino, imagenes[0].archivo), fullPage: true });
      for (const [clave, nombre, seccion] of [
        ["ejemplo", "Ejemplo funcional", "Cuándo se exige un paquete"],
        ["evidencias", "Fichas E01 a E04", "Evidencias"],
      ]) {
        const archivo = `${clave}-${ancho}.png`;
        await page.getByRole("region", { name: seccion, exact: true }).screenshot({ path: join(destino, archivo) });
        imagenes.push({ nombre, archivo });
      }
      await page.goto(origin + rutas.e01);
      const archivo = `e01-${ancho}.png`;
      await page.screenshot({ path: join(destino, archivo), fullPage: true });
      imagenes.push({ nombre: "E01 · Lectura por etapas", archivo });
      if (ancho === 1280) {
        const png = await page.locator("#captura-producto img").getAttribute("src");
        assert(png?.startsWith("data:image/png;base64,"));
        await writeFile(join(destino, "precotizacion-rfm-core.png"), Buffer.from(png.split(",")[1], "base64"));
      }
      if (ancho === 320) {
        const archivo = "e01-ampliado-320.png";
        await page.getByText("Ampliar el diagrama completo", { exact: true }).click();
        await page.locator(".diagram-view").evaluate((visor) => visor.scrollTo(256, 180));
        await page.locator("#diagrama").screenshot({ path: join(destino, archivo) });
        imagenes.push({ nombre: "E01 · Visor ampliado y desplazado", archivo });
      }
      if (evidenciasCandidatas) {
        for (const [clave, ruta] of [
          ["inicio", "/"], ["proyectos", "/proyectos/"], ["proyecto", rutas.proyecto], ["casos", "/casos-de-estudio/"],
          ...evidenciasCandidatas.map((ruta, indice) => [`e0${indice + 2}`, ruta]),
        ]) {
          const respuesta = await page.goto(origin + ruta);
          assert.equal(respuesta.status(), 200, ruta);
          const nombre = clave === "inicio" ? "Inicio" : await page.getByRole("heading", { level: 1 }).innerText();
          const archivo = `${clave}-${ancho}.png`;
          await page.screenshot({ path: join(destino, archivo), fullPage: true });
          imagenes.push({ nombre, archivo });
        }
      }
      capturas.push({ ancho, imagenes });
    }
  } finally {
    await page.close();
  }
  const secciones = capturas.map(({ ancho, imagenes }) => `
    <section><h2>${ancho} px</h2><div class="capturas">${imagenes.map(({ nombre, archivo }) => `
      <figure><figcaption>${nombre}</figcaption><a href="${archivo}"><img loading="lazy" src="${archivo}" alt="${nombre} a ${ancho} px"></a></figure>`).join("")}
    </div></section>`).join("");
  await writeFile(join(destino, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
    <title>${titulo}</title>
    <style>body{margin:0 auto;padding:1.5rem;max-width:85rem;background:#f2f1e9;color:#191e19;font:16px/1.5 system-ui}
    a{color:#30503c;text-underline-offset:.25em}a:focus-visible{outline:2px solid #30503c;outline-offset:3px}
    h2{border-top:1px solid #c9cec1;padding-top:1rem}figure{margin:0}img{display:block;max-width:100%;border:1px solid #c9cec1}
    figcaption{margin-bottom:.5rem;font-weight:600}.capturas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
    @media(max-width:720px){.capturas{grid-template-columns:1fr}}</style></head>
    <body><main><h1>${titulo}</h1>
    <p>Abre una captura para verla a tamaño completo.</p>
    <p>Con <code>${comando}</code> en ejecución, abre <a href="${urlLocal}${rutas.proyecto}">la página de RFM CORE</a>
    o <a href="${urlLocal}${rutas.caso}">Del interés comercial al contrato</a>.</p>
    ${secciones}
    <section><h2>Pantalla de RFM CORE</h2>
    <p>Resultado de la precotización pública en una copia local de RFM CORE, con datos sintéticos y sin paquete seleccionado.</p>
    <figure><a href="precotizacion-rfm-core.png"><img loading="lazy" src="precotizacion-rfm-core.png" alt="Resultado de una precotización de servicio completo en RFM CORE"></a></figure>
    </section></main></body></html>`);
}
