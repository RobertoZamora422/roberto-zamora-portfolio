import type { Registro } from "./modelo.ts";

export function seleccionarContenido(registro: Registro) {
  const proyectos = registro.proyectos.filter(({ revision }) => revision === "aprobado")
    .map(({ pagina, ...proyecto }) => ({
      ...proyecto, pagina: pagina?.revision === "aprobado" ? pagina : undefined,
    }));
  const paginas = proyectos.flatMap(({ pagina, ...proyecto }) => pagina ? [{ ...proyecto, pagina }] : []);
  return {
    perfil: registro.perfil?.revision === "aprobado" ? registro.perfil : undefined,
    proyectos,
    paginas,
    casos: registro.casos.filter(({ revision }) => revision === "aprobado"),
    evidencias: registro.evidencias.filter(({ revision }) => revision === "aprobado"),
  };
}
