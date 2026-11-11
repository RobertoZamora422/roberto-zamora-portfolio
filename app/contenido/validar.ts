import { realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { Registro, Revision } from "./modelo.ts";

const slugValido = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const archivoValido = /^(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.[a-z0-9]+$/;

function exigirTextos(origen: string, campos: Record<string, string>) {
  for (const [campo, valor] of Object.entries(campos)) {
    if (typeof valor !== "string" || !valor.trim()) throw new Error(`${origen}: falta ${campo}`);
  }
}

function validarRevision(origen: string, revision: Revision) {
  if (revision !== "aprobado" && revision !== "borrador") {
    throw new Error(`${origen}: estado de revisión inválido`);
  }
}

function indexar<T>(entidad: string, entradas: readonly T[], clave: (entrada: T) => string) {
  const indice = new Map<string, T>();
  for (const entrada of entradas) {
    const id = clave(entrada);
    if (typeof id !== "string" || !slugValido.test(id)) throw new Error(`${entidad}: identificador inválido «${id}»`);
    if (indice.has(id)) throw new Error(`${entidad}: identificador duplicado «${id}»`);
    indice.set(id, entrada);
  }
  return indice;
}

function validarReferencia<T>(
  origen: string,
  id: string,
  indice: ReadonlyMap<string, T>,
  revision: Revision,
  revisar: (entrada: T) => Revision,
) {
  const destino = indice.get(id);
  if (!destino) throw new Error(`${origen}: referencia inexistente «${id}»`);
  if (revision === "aprobado" && revisar(destino) !== "aprobado") {
    throw new Error(`${origen}: referencia sin aprobación «${id}»`);
  }
}

function validarUrl(origen: string, url: string) {
  if (!URL.canParse(url) || new URL(url).protocol !== "https:") {
    throw new Error(`${origen}: se requiere una URL HTTPS`);
  }
}

async function resolverArchivo(carpeta: string, archivo: string) {
  if (!archivoValido.test(archivo)) throw new Error(`Ruta de recurso inválida «${archivo}»`);
  const raiz = await realpath(carpeta).catch(() => undefined);
  const ruta = await realpath(resolve(carpeta, archivo)).catch(() => undefined);
  if (!raiz || !ruta || !(await stat(ruta)).isFile()) throw new Error(`Falta el archivo «${archivo}»`);
  const dentro = relative(raiz, ruta);
  if (dentro.startsWith("..") || isAbsolute(dentro)) throw new Error(`Recurso fuera del directorio «${archivo}»`);
  return ruta;
}

export async function validarRegistro(registro: Registro, carpetaRecursos: string, { revisionLocal = false } = {}) {
  const proyectos = indexar("Proyecto", registro.proyectos, ({ slug }) => slug);
  const casos = indexar("Caso", registro.casos, ({ slug }) => slug);
  const evidencias = indexar("Evidencia", registro.evidencias, ({ id }) => id);
  const archivosAprobados = new Map<string, string>();

  async function validarArchivo(origen: string, archivo: string, revision: Revision) {
    if (!revisionLocal && (archivo.startsWith("pruebas/") || archivo.startsWith("revision-editorial/"))) {
      throw new Error(`${origen}: recurso reservado para revisión local`);
    }
    const ruta = await resolverArchivo(carpetaRecursos, archivo);
    if (revision === "aprobado") archivosAprobados.set(archivo, ruta);
  }

  function validarEvidencias(origen: string, ids: readonly string[], revision: Revision) {
    if (revision === "aprobado" && ids.length === 0) throw new Error(`${origen}: falta evidencia aprobada`);
    for (const id of ids) validarReferencia(origen, id, evidencias, revision, (entrada) => entrada.revision);
  }

  for (const { slug, ficha, pagina } of registro.proyectos) {
    const origen = `Proyecto «${slug}»`;
    const { revision, nombre, resumen, estado } = ficha;
    validarRevision(origen, revision);
    if (revision === "aprobado") exigirTextos(origen, { nombre, resumen, estado });
    if (!pagina) continue;

    const { revision: revisionPagina, evidencias: ids, entradilla, destacado,
      problema, contexto, proposito, solucion, participacion } = pagina;
    validarRevision(origen, revisionPagina);
    if (revisionPagina === "aprobado") {
      if (revision !== "aprobado") throw new Error(`${origen}: página aprobada sin ficha aprobada`);
      exigirTextos(origen, { entradilla, destacado, problema, contexto, proposito, solucion, participacion });
    }
    validarEvidencias(origen, ids, revisionPagina);
  }

  for (const caso of registro.casos) {
    const { slug, revision, proyecto, evidencias: ids, titulo, resumen, contexto,
      alcance, decisiones, trabajo, validacion, resultadosYLimites, resumenVisual, ejemplo } = caso;
    const origen = `Caso «${slug}»`;
    validarRevision(origen, revision);
    validarReferencia(origen, proyecto, proyectos, revision, (entrada) => entrada.ficha.revision);
    if (revision === "aprobado") {
      exigirTextos(origen, { titulo, resumen, contexto, alcance, decisiones, trabajo, validacion, resultadosYLimites });
      for (const { etiqueta, valor } of resumenVisual ?? []) exigirTextos(origen, { etiqueta, valor });
      if (ejemplo) {
        exigirTextos(origen, { titulo: ejemplo.titulo });
        for (const situacion of ejemplo.situaciones) exigirTextos(origen, situacion);
        for (const { evidencia, texto, ancla } of ejemplo.referencias) {
          exigirTextos(origen, { texto, ancla });
          if (!ids.includes(evidencia) || !slugValido.test(ancla)) {
            throw new Error(`${origen}: referencia de ejemplo inválida «${evidencia}#${ancla}»`);
          }
        }
      }
    }
    validarEvidencias(origen, ids, revision);
  }

  for (const { id, revision, recurso, titulo, tipo, fuente, autoria, afirmacion } of registro.evidencias) {
    const origen = `Evidencia «${id}»`;
    validarRevision(origen, revision);
    if (revision === "aprobado") exigirTextos(origen, { titulo, tipo, fuente, autoria, afirmacion });
    if ("url" in recurso) {
      validarUrl(origen, recurso.url);
    } else {
      await validarArchivo(origen, recurso.archivo, revision);
    }
  }

  if (registro.perfil) {
    const { revision, nombre, presentacion, propuesta, oportunidades, formacion, trayectoria,
      casos: referencias, enlaces, retrato, intereses } = registro.perfil;
    validarRevision("Perfil", revision);
    if (revision === "aprobado") {
      exigirTextos("Perfil", { nombre, presentacion, propuesta, oportunidades });
      for (const entrada of formacion) exigirTextos("Formación", entrada);
      for (const entrada of intereses ?? []) exigirTextos("Área de interés", entrada);
    }
    if (retrato) {
      validarRevision("Retrato", retrato.revision);
      const revisionDelArchivo = revision === "aprobado" ? retrato.revision : "borrador";
      if (revisionDelArchivo === "aprobado") exigirTextos("Retrato", { alt: retrato.alt });
      if (!/\.(?:avif|jpe?g|png|webp)$/.test(retrato.archivo)) throw new Error("Retrato: formato de imagen inválido");
      await validarArchivo("Retrato", retrato.archivo, revisionDelArchivo);
    }
    for (const { descripcion, evidencias: ids } of trayectoria) {
      if (revision === "aprobado") exigirTextos("Trayectoria", { descripcion });
      validarEvidencias("Trayectoria", ids, revision);
    }
    for (const id of referencias ?? []) validarReferencia("Perfil", id, casos, revision, (entrada) => entrada.revision);
    for (const { url } of enlaces ?? []) validarUrl("Perfil", url);
  }

  if (registro.casoDestacado) {
    validarReferencia("Caso destacado", registro.casoDestacado, casos, "aprobado", (entrada) => entrada.revision);
  }
  return archivosAprobados;
}
