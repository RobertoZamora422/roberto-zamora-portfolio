import { copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Config } from "@react-router/dev/config";
import { cargarContenido, cargarRegistro } from "./app/contenido/registro.server";
import { validarRegistro } from "./app/contenido/validar";
import { configuracionPublicacion, favicon, tarjetaSocial } from "./app/contenido/publicacion";
import { metadatosPagina } from "./app/contenido/metadatos";
import { paths, rutaCaso, rutaProyecto } from "./app/rutas";

const preview = process.env.PORTFOLIO_PREVIEW === "1";
const { origen, indexar } = configuracionPublicacion(process.env);
const escapar = (texto: string) => texto.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const rutaEvidencia = (archivo: string) => `/recursos/${archivo.replace(/\.html$/, "")}`;

export default {
  ssr: false,
  buildDirectory: preview ? ".local/prerender" : "build",
  routeDiscovery: { mode: "initial" },
  async prerender({ getStaticPaths }) {
    await validarRegistro(await cargarRegistro(), resolve("recursos-contenido"), { revisionLocal: preview });
    const { paginas, casos } = await cargarContenido();
    return [
      // React Router solicita /ruta/_.data al navegar a las URLs canónicas con barra final.
      ...getStaticPaths().map((ruta) => ruta.endsWith("/") || ruta === "/404" ? ruta : `${ruta}/`),
      ...paginas.map(({ slug }) => rutaProyecto(slug)),
      ...casos.map(({ slug }) => rutaCaso(slug)),
    ];
  },
  async buildEnd({ reactRouterConfig, viteConfig }) {
    const client = resolve(viteConfig.root, reactRouterConfig.buildDirectory, "client");
    const archivoIcono = resolve(viteConfig.root, "recursos-contenido/sitio/favicon.ico");
    await copyFile(archivoIcono, resolve(client, `.${favicon.ruta}`));
    await copyFile(archivoIcono, resolve(client, "favicon.ico"));
    // Pages reads this file for unmatched URLs and sends the HTTP status.
    await rename(resolve(client, "404/index.html"), resolve(client, "404.html"));
    await rm(resolve(client, "__spa-fallback.html"), { force: true });
    const registro = await cargarRegistro();
    const recursos = await validarRegistro(registro, resolve(viteConfig.root, "recursos-contenido"), {
      revisionLocal: preview,
    });
    const documentos = new Map(registro.evidencias.flatMap(({ revision, titulo, afirmacion, recurso }) => (
      revision === "aprobado" && "archivo" in recurso && recurso.archivo.endsWith(".html")
        ? [[recurso.archivo, { titulo, descripcion: afirmacion, ruta: rutaEvidencia(recurso.archivo) }] as const]
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
      const etiquetas = (preview ? [] : metadatosPagina({ ...documento, tipo: "article" }, origen ?? ""))
        .flatMap((meta) => {
          if ("href" in meta && meta.href) return [`<link rel="canonical" href="${escapar(meta.href)}">`];
          if ("property" in meta && meta.property) return [`<meta property="${meta.property}" content="${escapar(meta.content)}">`];
          if ("name" in meta && meta.name) return [`<meta name="${meta.name}" content="${escapar(meta.content)}">`];
          return [];
        });
      await writeFile(destino, html.replace("</head>", `<link rel="icon" href="${favicon.ruta}" sizes="${favicon.tamanos}" type="image/vnd.microsoft.icon">\n${etiquetas.join("\n")}\n</head>`));
    }

    const robots = "User-agent: *\nDisallow:\n";
    // Cloudflare's email obfuscation respects no-transform on the compatibility page.
    const headers = [
      "/cv/\n  Cache-Control: public, max-age=0, must-revalidate, no-transform",
      "/cv\n  Cache-Control: public, max-age=0, must-revalidate, no-transform",
    ];
    const pdf = registro.perfil?.revision === "aprobado" && registro.perfil.cvPdf;
    if (pdf && pdf.revision === "aprobado") {
      headers.push(`/recursos/${pdf.archivo}\n  Content-Type: application/pdf\n  Content-Disposition: inline\n  X-Robots-Tag: noindex`);
    }
    if (origen && !preview) {
      const destino = resolve(client, `.${tarjetaSocial}`);
      await mkdir(dirname(destino), { recursive: true });
      await copyFile(resolve(viteConfig.root, `recursos-contenido/${tarjetaSocial.slice("/recursos/".length)}`), destino);
    }
    if (indexar && origen) {
      const { paginas, casos, perfil } = await cargarContenido();
      const rutas = [paths.inicio, paths.proyectos, paths.casos, ...(perfil ? [paths.perfil, paths.cv] : []),
        ...paginas.map(({ slug }) => rutaProyecto(slug)), ...casos.map(({ slug }) => rutaCaso(slug)),
        ...Array.from(documentos.values(), ({ ruta }) => ruta)];
      const urls = rutas.map((ruta) => `  <url><loc>${escapar(new URL(ruta, origen).href)}</loc></url>`).join("\n");
      await writeFile(resolve(client, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      await writeFile(resolve(client, "robots.txt"), `${robots}Sitemap: ${origen}/sitemap.xml\n`);
      headers.push("https://:project.pages.dev/*\n  X-Robots-Tag: noindex", "https://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex");
    } else {
      await writeFile(resolve(client, "robots.txt"), robots);
      headers.push("/*\n  X-Robots-Tag: noindex");
    }
    await writeFile(resolve(client, "_headers"), `${headers.join("\n")}\n`);
  },
} satisfies Config;
