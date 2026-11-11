import { readFile } from "node:fs/promises";
import type { Registro, Revision } from "./modelo.ts";

type BorradorEditorial = Pick<Registro, "proyectos" | "casos" | "evidencias" | "casoDestacado">;

function habilitarVistaLocal<T extends { revision: Revision }>(entrada: T) {
  if (entrada.revision !== "borrador") throw new Error("El registro editorial local debe contener borradores");
  return { ...entrada, revision: "aprobado" as const };
}

export async function incorporarBorradorEditorial(publico: Registro): Promise<Registro> {
  const texto = await readFile(".local/contenido-editorial/registro.json", "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return undefined;
    throw error;
  });
  if (texto === undefined) return publico;

  // La selección y el prerenderizado ven una copia habilitada solo para la revisión local.
  const borrador: BorradorEditorial = JSON.parse(texto);
  const proyectos = borrador.proyectos.map(({ ficha, pagina, slug }) => ({
    slug,
    ficha: habilitarVistaLocal(ficha),
    pagina: pagina && habilitarVistaLocal(pagina),
  }));
  return {
    ...publico,
    proyectos: [...publico.proyectos, ...proyectos.filter(({ slug }) => !publico.proyectos.some((p) => p.slug === slug))],
    casos: [...publico.casos, ...borrador.casos.map(habilitarVistaLocal).filter(({ slug }) => !publico.casos.some((c) => c.slug === slug))],
    evidencias: [...publico.evidencias, ...borrador.evidencias.map(habilitarVistaLocal).filter(({ id }) => !publico.evidencias.some((e) => e.id === id))],
    casoDestacado: borrador.casoDestacado ?? publico.casoDestacado,
  };
}
