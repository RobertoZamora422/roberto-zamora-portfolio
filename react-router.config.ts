import { copyFile, mkdir, rename, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Config } from "@react-router/dev/config";
import { cargarContenido, cargarRegistro } from "./app/contenido/registro.server";
import { validarRegistro } from "./app/contenido/validar";
import { rutaCaso, rutaProyecto } from "./app/rutas";

const preview = process.env.PORTFOLIO_PREVIEW === "1";

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
    // Pages reads this file for unmatched URLs and sends the HTTP status.
    await rename(resolve(client, "404/index.html"), resolve(client, "404.html"));
    await rm(resolve(client, "__spa-fallback.html"), { force: true });
    const recursos = await validarRegistro(await cargarRegistro(), resolve(viteConfig.root, "recursos-contenido"), {
      revisionLocal: preview,
    });
    for (const [archivo, origen] of recursos) {
      const destino = resolve(client, "recursos", archivo);
      await mkdir(dirname(destino), { recursive: true });
      await copyFile(origen, destino);
    }
  },
} satisfies Config;
