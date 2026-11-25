import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Config } from "@react-router/dev/config";
import { registroPublico as registro } from "./app/contenido/publico";
import { redirecciones, rutasPublicas as rutas } from "./app/contenido/registro.server";
import { validarRegistro } from "./app/contenido/validar";
import { configuracionPublicacion, favicon, tarjetaSocial } from "./app/contenido/publicacion";
import { metadatosPagina } from "./app/contenido/metadatos";
import { rutaRecursoPublico } from "./app/rutas";

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
    await writeFile(resolve(client, "_redirects"), Array.from(redirecciones, ([ruta, destino]) => `${ruta} ${destino} 301\n`).join(""));
    // Un marcador vacío desactiva el fallback SPA de Pages y conserva el 404 de los archivos ausentes.
    await writeFile(resolve(client, "404.html"), "");
    const exclude = ["/assets/*", "/recursos/*", ...redirecciones.keys(), ...rutas];
    await writeFile(resolve(client, "_routes.json"), JSON.stringify({ version: 1, include: ["/*"], exclude: exclude.slice(0, 99) }));
    await copyFile(resolve(viteConfig.root, "cloudflare/respuesta.js"), resolve(client, "_worker.js"));
    await writeFile(resolve(client, "_headers"), `${headers.join("\n")}\n`);
  },
} satisfies Config;
