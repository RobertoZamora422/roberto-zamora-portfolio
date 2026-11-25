import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const anchos = [1440, 1280, 1024, 768, 390, 320];
export const vistas = [
  { nombre: "Inicio", clave: "inicio", ruta: "/" },
  { nombre: "RFM CORE", clave: "rfm-core", ruta: "/rfm-core/" },
  { nombre: "Del interés comercial al contrato", clave: "caso", ruta: "/rfm-core/caso-de-estudio/" },
];

export async function capturarRevision(browser, origin) {
  const carpeta = ".local/revision-editorial-rutas";
  await mkdir(carpeta, { recursive: true });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const grupos = [];
  try {
    for (const width of anchos) {
      await page.setViewportSize({ width, height: width > 768 ? 900 : width === 768 ? 1024 : width === 390 ? 844 : 640 });
      const imagenes = [];
      for (const { nombre, clave, ruta } of vistas) {
        await page.goto(origin + ruta);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(img => { img.loading = "eager"; return img.decode(); }));
        });
        const archivo = `${clave}-${width}.png`;
        await page.screenshot({ path: join(carpeta, archivo), fullPage: true, animations: "disabled" });
        imagenes.push(`<figure><figcaption>${nombre}</figcaption><a href="${archivo}"><img src="${archivo}" alt="${nombre} a ${width} píxeles" loading="lazy"></a></figure>`);
      }
      grupos.push(`<section><h2>${width} px</h2><div>${imagenes.join("")}</div></section>`);
    }
    await writeFile(join(carpeta, "index.html"), `<!doctype html><html lang="es"><meta charset="utf-8">
<meta name="viewport" content="width=device-width"><title>Capturas del portafolio RZ.</title>
<style>body{margin:auto;padding:2rem;max-width:78rem;background:#f7f6f1;color:#202722;font:1rem/1.5 system-ui}section{border-top:1px solid #bdc8bd}section div{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem}figure{margin:0 0 2rem}figcaption{font-weight:650;padding-bottom:.5rem}img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top;border:1px solid #bdc8bd}</style>
<main><h1>Capturas del portafolio RZ.</h1><p>Abre una imagen para ver la página completa.</p>${grupos.join("")}</main></html>`);
  } finally {
    await page.close();
  }
}
