import { paths, rutaCaso, rutaProyecto, rutasAnteriores } from "../rutas.ts";
import { registroPublico } from "./publico.ts";
import { seleccionarContenido } from "./seleccion.ts";

export const contenido = seleccionarContenido(registroPublico);

export const rutasPublicas = [
  paths.inicio,
  ...contenido.paginas.map(({ slug }) => rutaProyecto(slug)),
  ...contenido.casos.map(({ proyecto }) => rutaCaso(proyecto)),
];

export const redirecciones = new Map<string, string>();
for (const [ruta, destino] of rutasAnteriores) {
  if (rutasPublicas.includes(destino.split("#")[0])) {
    redirecciones.set(ruta, destino);
    redirecciones.set(ruta + "/", destino);
  }
}
