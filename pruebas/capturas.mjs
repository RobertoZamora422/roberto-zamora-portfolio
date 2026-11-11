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
