import { reactRouter } from "@react-router/dev/vite";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig, normalizePath, type Plugin } from "vite";
import { redirecciones, rutasPublicas } from "./app/contenido/registro.server.ts";
import { registroPublico } from "./app/contenido/publico.ts";
import { validarRegistro } from "./app/contenido/validar.ts";
import { rutaRecursoPublico } from "./app/rutas.ts";
import { esNavegacion } from "./cloudflare/respuesta.js";
import { configuracionPublicacion, favicon, tarjetaSocial } from "./app/contenido/publicacion.ts";

const { origen, indexar } = configuracionPublicacion(process.env);

// Vite sirve los originales durante la edición con las mismas direcciones que Pages.
function navegacionLocal(): Plugin {
  const recursos = new Map<string, string>();
  return {
    name: "navegacion-local",
    apply: "serve",
    async config(config) {
      const raiz = resolve(config.root ?? ".");
      const carpeta = resolve(raiz, "recursos-contenido");
      const archivos = await validarRegistro(registroPublico, carpeta);
      for (const [archivo, fuente] of archivos) recursos.set(rutaRecursoPublico(archivo), fuente);
      for (const ruta of [favicon.ruta, "/favicon.ico"]) recursos.set(ruta, resolve(carpeta, "sitio/favicon.ico"));
      if (origen) recursos.set(tarjetaSocial, resolve(carpeta, tarjetaSocial.slice("/recursos/".length)));
      const modulos = ["app", "node_modules", ".react-router"].map((dir) => resolve(raiz, dir));
      return { server: { fs: { allow: [...modulos, ...recursos.values()] } } };
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !["GET", "HEAD"].includes(req.method ?? "")) return next();
        const { pathname, search } = new URL(req.url, "http://localhost");
        const canonica = pathname.replace(/\.html$/, "");
        if (canonica !== pathname && recursos.has(canonica)) {
          res.writeHead(308, { Location: canonica + search }).end();
          return;
        }
        const archivo = recursos.get(pathname);
        if (archivo?.endsWith(".html")) {
          // Son documentos independientes. React Router solo renderiza las páginas del portafolio.
          readFile(archivo).then(
            (html) => res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(html),
            next,
          );
          return;
        }
        if (archivo) {
          req.url = `/@fs/${normalizePath(archivo)}${search}`;
          return next();
        }
        const destino = redirecciones.get(pathname);
        if (destino) {
          res.writeHead(301, { Location: destino }).end();
          return;
        }
        if (rutasPublicas.includes(pathname) || pathname.startsWith("/@")
          || /^\/(?:app|node_modules|__vite_ping|__manifest)(?:\/|$)/.test(pathname)) return next();
        if (rutasPublicas.includes(pathname + "/")) {
          res.writeHead(308, { Location: pathname + "/" + search }).end();
          return;
        }
        if (rutasPublicas.some((ruta) => pathname === ruta + "_.data")) return next();
        if (esNavegacion(pathname, req.headers["sec-fetch-dest"], req.headers.accept)) {
          res.writeHead(302, { Location: "/" }).end();
        } else {
          res.writeHead(404).end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [navegacionLocal(), reactRouter()],
  publicDir: false,
  define: {
    "process.env.PORTFOLIO_ORIGEN": JSON.stringify(origen ?? ""),
    "process.env.PORTFOLIO_INDEXAR": JSON.stringify(indexar ? "1" : "0"),
  },
});
