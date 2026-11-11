import type { Registro } from "./modelo.ts";

export function seleccionarContenido(registro: Registro) {
  const perfil = registro.perfil?.revision === "aprobado" ? registro.perfil : undefined;
  const proyectos = registro.proyectos.flatMap(({ slug, ficha, pagina }) => (
    ficha.revision === "aprobado"
      ? [{ slug, ficha, pagina: pagina?.revision === "aprobado" ? pagina : undefined }]
      : []
  ));
  const paginas = proyectos.flatMap(({ slug, ficha, pagina }) => (
    pagina ? [{ slug, ficha, pagina }] : []
  ));
  const casos = registro.casos.filter((caso) => caso.revision === "aprobado");
  const evidencias = registro.evidencias.filter((evidencia) => evidencia.revision === "aprobado");

  return {
    perfil,
    proyectos,
    paginas,
    casos,
    evidencias,
    proyectoDestacado: paginas.find(({ slug }) => slug === "rfm-core") ?? paginas[0],
    casoDestacado: casos.find(({ slug }) => slug === registro.casoDestacado),
  };
}
