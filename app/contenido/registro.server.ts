import { registroPublico } from "./publico.ts";
import { seleccionarContenido } from "./seleccion.ts";

export function urlRecursoLocal(archivo: string) {
  const directorio = import.meta.env.DEV ? "/recursos-contenido" : "/recursos";
  return `${directorio}/${archivo}`;
}

export async function cargarRegistro() {
  if (process.env.PORTFOLIO_PREVIEW === "1") {
    const { registroParaRevision } = await import("../pruebas/datos.ts");
    return registroParaRevision(registroPublico);
  }
  return registroPublico;
}

export async function cargarContenido() {
  const contenido = seleccionarContenido(await cargarRegistro());

  // El índice y la plantilla públicos de casos corresponden al incremento 3.
  if (process.env.PORTFOLIO_PREVIEW !== "1") {
    return { ...contenido, casos: [], casoDestacado: undefined };
  }
  return contenido;
}
