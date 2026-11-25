import { reactRouter } from "@react-router/dev/vite";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { redirecciones, rutasPublicas } from "./app/contenido/registro.server.ts";
import { registroPublico } from "./app/contenido/publico.ts";
import { validarRegistro } from "./app/contenido/validar.ts";
import { rutaRecursoPublico } from "./app/rutas.ts";
import { esNavegacion } from "./cloudflare/respuesta.js";
import { configuracionPublicacion } from "./app/contenido/publicacion.ts";

const { origen, indexar } = configuracionPublicacion(process.env);

// Vite sirve los originales durante la edición con las mismas direcciones que Pages.
function navegacionLocal(): Plugin {
  return {
    name: "navegacion-local",
    async configureServer(server) {
      const archivos = await validarRegistro(registroPublico, resolve(server.config.root, "recursos-contenido"));
      const recursos = new Map(Array.from(archivos.keys(), (archivo) => [rutaRecursoPublico(archivo), archivo]));
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
          readFile(archivos.get(archivo)!).then(
            (html) => res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(html),
            next,
          );
          return;
        }
        if (archivo) {
          req.url = `/recursos-contenido/${archivo}${search}`;
          return next();
        }
        const destino = redirecciones.get(pathname);
        if (destino) {
          res.writeHead(301, { Location: destino }).end();
          return;
        }
        if (rutasPublicas.includes(pathname) || pathname.startsWith("/@")
          || /^\/(?:app|node_modules|recursos-contenido|__vite_ping|__manifest)(?:\/|$)/.test(pathname)) return next();
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
