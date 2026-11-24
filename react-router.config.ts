import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Config } from "@react-router/dev/config";
import { registroPublico as registro } from "./app/contenido/publico";
import { seleccionarContenido } from "./app/contenido/seleccion";
import { validarRegistro } from "./app/contenido/validar";
import { configuracionPublicacion, favicon, tarjetaSocial } from "./app/contenido/publicacion";
import { metadatosPagina } from "./app/contenido/metadatos";
import { paths, rutaCaso, rutaProyecto, rutaRecursoPublico } from "./app/rutas";

const { paginas, casos } = seleccionarContenido(registro);
const rutas = [paths.inicio, ...paginas.map(({ slug }) => rutaProyecto(slug)), ...casos.map(({ slug }) => rutaCaso(slug))];
const redirecciones = [
  ["/proyectos", paths.trabajo], ["/sobre-mi", paths.sobreMi], ["/cv", paths.contacto],
  ["/casos-de-estudio", rutaCaso("del-interes-comercial-al-contrato")],
].flatMap(([ruta, destino]) => [[ruta, destino], [ruta + "/", destino]]);

const { origen, indexar } = configuracionPublicacion(process.env);
const escapar = (texto: string) => texto.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export default {
  ssr: false,
  routeDiscovery: { mode: "initial" },
  prerender: rutas,
  async buildEnd({ reactRouterConfig, viteConfig }) {
    const client = resolve(viteConfig.root, reactRouterConfig.buildDirectory, "client");
    const archivoIcono = resolve(viteConfig.root, "recursos-contenido/sitio/favicon.ico");
    await copyFile(archivoIcono, resolve(client, `.${favicon.ruta}`));
    await copyFile(archivoIcono, resolve(client, "favicon.ico"));
    await rm(resolve(client, "__spa-fallback.html"), { force: true });
    const recursos = await validarRegistro(registro, resolve(viteConfig.root, "recursos-contenido"));
    const documentos = new Map(registro.evidencias.flatMap(({ revision, titulo, afirmacion, recurso }) => (
      revision === "aprobado" && "archivo" in recurso && recurso.archivo.endsWith(".html")
        ? [[recurso.archivo, { titulo, descripcion: afirmacion, ruta: rutaRecursoPublico(recurso.archivo) }] as const]
        : []
    )));
    for (const [archivo, fuente] of recursos) {
      const destino = resolve(client, "recursos", archivo);
      await mkdir(dirname(destino), { recursive: true });
      const documento = documentos.get(archivo);
      if (!documento) {
        await copyFile(fuente, destino);
        continue;
      }
      const html = await readFile(fuente, "utf8");
      if (!html.includes("</head>")) throw new Error(`Falta </head> en la evidencia ${archivo}`);
      const etiquetas = metadatosPagina({ ...documento, tipo: "article" }, origen ?? "")
        .flatMap((meta) => {
          if ("href" in meta && meta.href) return [`<link rel="canonical" href="${escapar(meta.href)}">`];
          if ("property" in meta && meta.property) return [`<meta property="${meta.property}" content="${escapar(meta.content)}">`];
          if ("name" in meta && meta.name) return [`<meta name="${meta.name}" content="${escapar(meta.content)}">`];
          return [];
        });
      await writeFile(destino, html.replace("</head>", `<link rel="icon" href="${favicon.ruta}" sizes="${favicon.tamanos}" type="image/vnd.microsoft.icon">\n${etiquetas.join("\n")}\n</head>`));
    }

    const robots = "User-agent: *\nDisallow:\n";
    const headers = rutas.map((ruta) => `${ruta}\n  Cache-Control: public, max-age=0, must-revalidate, no-transform`);
    const pdf = registro.perfil?.revision === "aprobado" && registro.perfil.cvPdf;
    if (pdf && pdf.revision === "aprobado") {
      headers.push(`/recursos/${pdf.archivo}\n  Content-Type: application/pdf\n  Content-Disposition: inline${indexar ? "\n  X-Robots-Tag: noindex" : ""}`);
    }
    if (origen) {
      const destino = resolve(client, `.${tarjetaSocial}`);
      await mkdir(dirname(destino), { recursive: true });
      await copyFile(resolve(viteConfig.root, `recursos-contenido/${tarjetaSocial.slice("/recursos/".length)}`), destino);
    }
    if (indexar && origen) {
      const indexables = [...rutas, ...Array.from(documentos.values(), ({ ruta }) => ruta)];
      const urls = indexables.map((ruta) => `  <url><loc>${escapar(new URL(ruta, origen).href)}</loc></url>`).join("\n");
      await writeFile(resolve(client, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      await writeFile(resolve(client, "robots.txt"), `${robots}Sitemap: ${origen}/sitemap.xml\n`);
      headers.push("https://:project.pages.dev/*\n  X-Robots-Tag: noindex", "https://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex");
    } else {
      await writeFile(resolve(client, "robots.txt"), robots);
      headers.push("/*\n  X-Robots-Tag: noindex");
    }
    await writeFile(resolve(client, "_redirects"), redirecciones.map(([ruta, destino]) => `${ruta} ${destino} 301\n`).join(""));
    // Sin 404.html, Pages sirve Inicio como fallback. Sus páginas reales y los 301
    // pasan directamente al servicio estático, igual que los recursos de uso habitual.
    const contenidoEstatico = [...rutas, ...Array.from(documentos.values(), ({ ruta }) => ruta),
      ...redirecciones.map(([ruta]) => ruta)];
    const archivosEstaticos = [
      ...rutas.map((ruta) => ruta + "_.data"), ...Array.from(recursos.keys(), (archivo) => "/recursos/" + archivo),
      ...(await readdir(resolve(client, "assets"))).map((archivo) => "/assets/" + archivo),
      favicon.ruta, "/favicon.ico", "/robots.txt", ...(origen ? [tarjetaSocial] : []), ...(indexar ? ["/sitemap.xml"] : []),
    ];
    // Pages permite 100 reglas en total. Los recursos adicionales se sirven con ASSETS.fetch.
    const exclude = [...new Set([...contenidoEstatico, ...archivosEstaticos])].slice(0, 99);
    if (contenidoEstatico.length > 99) throw new Error("Las rutas HTML y redirecciones superan el límite de reglas de Pages");
    await writeFile(resolve(client, "_routes.json"), JSON.stringify({ version: 1, include: ["/*"], exclude }));
    await copyFile(resolve(viteConfig.root, "cloudflare/respuesta.js"), resolve(client, "_worker.js"));
    await writeFile(resolve(client, "_headers"), `${headers.join("\n")}\n`);
  },
} satisfies Config;
