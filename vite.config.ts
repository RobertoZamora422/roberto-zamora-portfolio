import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { configuracionPublicacion } from "./app/contenido/publicacion.ts";

const { origen, indexar } = configuracionPublicacion(process.env);

export default defineConfig({
  plugins: [reactRouter()],
  publicDir: false,
  define: {
    "process.env.PORTFOLIO_PREVIEW": JSON.stringify(process.env.PORTFOLIO_PREVIEW ?? "0"),
    "process.env.PORTFOLIO_ORIGEN": JSON.stringify(origen ?? ""),
    "process.env.PORTFOLIO_INDEXAR": JSON.stringify(indexar ? "1" : "0"),
  },
});
