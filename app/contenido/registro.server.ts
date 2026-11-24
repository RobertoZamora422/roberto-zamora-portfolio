import { rutaRecursoPublico } from "../rutas.ts";
import { registroPublico } from "./publico.ts";
import { seleccionarContenido } from "./seleccion.ts";

export const contenido = seleccionarContenido(registroPublico);

export function urlRecursoLocal(archivo: string) {
  return import.meta.env.DEV ? `/recursos-contenido/${archivo}` : rutaRecursoPublico(archivo);
}
