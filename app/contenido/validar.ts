import { open, realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { Apartado, Registro, Revision, TextoConTitulo } from "./modelo.ts";

import { rutasAnteriores } from "../rutas.ts";

const segmentosReservados = new Set(["404", "api", "assets", "recursos",
  ...rutasAnteriores.map(([ruta]) => ruta.split("/")[1]),
]);
const slugValido = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const archivoValido = /^(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.[a-z0-9]+$/;
const formatoImagen = /\.(?:avif|jpe?g|png|webp)$/;

function exigirTextos(origen: string, campos: Record<string, string>) {
  for (const [campo, valor] of Object.entries(campos)) {
    if (typeof valor !== "string" || !valor.trim()) throw new Error(`${origen}: falta ${campo}`);
  }
}

function exigirLista<T>(origen: string, campo: string, valores: readonly T[]) {
  if (!Array.isArray(valores) || !valores.length) throw new Error(`${origen}: falta ${campo}`);
}

function exigirParrafos(origen: string, campo: string, parrafos: readonly string[]) {
  exigirLista(origen, campo, parrafos);
  for (const texto of parrafos) exigirTextos(origen, { [campo]: texto });
}

function exigirApartados(origen: string, campo: string, apartados: readonly Apartado[]) {
  exigirLista(origen, campo, apartados);
  for (const { titulo, parrafos } of apartados) {
    exigirTextos(origen, { titulo });
    exigirParrafos(origen, campo, parrafos);
  }
}

function exigirEntradas(origen: string, campo: string, entradas: readonly TextoConTitulo[]) {
  exigirLista(origen, campo, entradas);
  for (const { titulo, descripcion } of entradas) exigirTextos(origen, { titulo, descripcion });
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
  const destino = URL.canParse(url) ? new URL(url) : undefined;
  if (destino?.protocol !== "https:") {
    throw new Error(`${origen}: se requiere una URL HTTPS`);
  }
  if (destino.username || destino.password) throw new Error(`${origen}: la URL pública contiene credenciales`);
}

async function resolverArchivo(carpeta: string, archivo: string) {
  const reservado = /^(?:pruebas|revision-editorial)[\\/]/i;
  if (reservado.test(archivo)) throw new Error(`Recurso reservado para revisión local «${archivo}»`);
  if (!archivoValido.test(archivo)) throw new Error(`Ruta de recurso inválida «${archivo}»`);
  const raiz = await realpath(carpeta).catch(() => undefined);
  const ruta = await realpath(resolve(carpeta, archivo)).catch(() => undefined);
  if (!raiz || !ruta || !(await stat(ruta)).isFile()) throw new Error(`Falta el archivo «${archivo}»`);
  const dentro = relative(raiz, ruta);
  if (dentro.startsWith("..") || isAbsolute(dentro)) throw new Error(`Recurso fuera del directorio «${archivo}»`);
  if (reservado.test(dentro)) throw new Error(`Recurso reservado para revisión local «${archivo}»`);
  return ruta;
}

export async function validarRegistro(registro: Registro, carpetaRecursos: string) {
  const proyectos = indexar("Proyecto", registro.proyectos, ({ slug }) => slug);
  const proyectosConCaso = new Set<string>();
  const evidencias = indexar("Evidencia", registro.evidencias, ({ id }) => id);
  const archivosAprobados = new Map<string, string>();

  async function validarArchivo(archivo: string, revision: Revision) {
    const ruta = await resolverArchivo(carpetaRecursos, archivo);
    if (revision === "aprobado") archivosAprobados.set(archivo, ruta);
    return ruta;
  }

  function validarEvidencias(origen: string, ids: readonly string[], revision: Revision) {
    if (revision === "aprobado" && ids.length === 0) throw new Error(`${origen}: falta evidencia aprobada`);
    for (const id of ids) validarReferencia(origen, id, evidencias, revision, (entrada) => entrada.revision);
  }

  for (const { slug, revision, nombre, estado, categoria, descripcion, repositorio, aplicacion, visual, pagina } of registro.proyectos) {
    const origen = `Proyecto «${slug}»`;
    validarRevision(origen, revision);
    if (revision === "aprobado") exigirTextos(origen, { nombre, estado, categoria, descripcion });
    validarUrl(origen, repositorio);
    if (aplicacion !== undefined) validarUrl(origen, aplicacion);
    if (revision === "aprobado" && visual !== "conceptual" && (
      pagina?.revision !== "aprobado"
      || !pagina.capturas?.some(({ archivo, revision }) => archivo === visual.captura && revision === "aprobado")
    )) throw new Error(`${origen}: la portada requiere una captura aprobada`);
    if (!pagina) continue;

    const { revision: revisionPagina, evidencias: ids, entradilla,
      contexto, solucion, participacion } = pagina;
    validarRevision(origen, revisionPagina);
    if (revisionPagina === "aprobado") {
      if (segmentosReservados.has(slug)) throw new Error(`${origen}: la URL está reservada`);
      if (revision !== "aprobado") throw new Error(`${origen}: página aprobada sin ficha aprobada`);
      exigirTextos(origen, { entradilla });
      exigirParrafos(origen, "contexto", contexto);
      exigirParrafos(origen, "solucion", solucion);
      exigirParrafos(origen, "participacion", participacion);
    }
    validarEvidencias(origen, ids, revisionPagina);
    for (const { revision: revisionCaptura, archivo, titulo, alt, descripcion, ancho, alto } of pagina.capturas ?? []) {
      const captura = `${origen}, captura «${archivo}»`;
      validarRevision(captura, revisionCaptura);
      exigirTextos(captura, { titulo, alt, descripcion });
      if (!formatoImagen.test(archivo)) throw new Error(`${captura}: formato de imagen inválido`);
      if (![ancho, alto].every((dimension) => Number.isSafeInteger(dimension) && dimension > 0)) {
        throw new Error(`${captura}: dimensiones de imagen inválidas`);
      }
      await validarArchivo(archivo, revisionPagina === "aprobado" ? revisionCaptura : "borrador");
    }
  }

  for (const caso of registro.casos) {
    const { revision, proyecto, evidencias: ids, titulo, resumen, pregunta, introduccion, ejemplo, validacion } = caso;
    const origen = `Caso de «${proyecto}»`;
    validarRevision(origen, revision);
    validarReferencia(origen, proyecto, proyectos, revision, (entrada) => entrada.pagina?.revision ?? "borrador");
    if (revision === "aprobado") {
      if (proyectosConCaso.has(proyecto)) throw new Error(`${origen}: solo se puede publicar un caso de estudio por proyecto`);
      proyectosConCaso.add(proyecto);
      exigirTextos(origen, { titulo, resumen, pregunta, introduccion });
      exigirEntradas(origen, "resumenVisual", caso.resumenVisual);
      exigirParrafos(origen, "contexto", caso.contexto);
      exigirParrafos(origen, "alcance", caso.alcance);
      exigirApartados(origen, "decisiones", caso.decisiones);
      exigirParrafos(origen, "trazabilidad", caso.trazabilidad);
      if (!validacion) throw new Error(`${origen}: falta validacion`);
      exigirTextos(origen, { introduccion: validacion.introduccion, ejecucion: validacion.ejecucion, fuente: validacion.fuente });
      exigirEntradas(origen, "escenarios", validacion.escenarios);
      exigirEntradas(origen, "resultados", validacion.resultados);
      exigirParrafos(origen, "limites", validacion.limites);
      if (caso.aprendizajes) exigirParrafos(origen, "aprendizajes", caso.aprendizajes);
      if (ejemplo) {
        exigirApartados(origen, "situaciones", ejemplo.situaciones);
        exigirTextos(origen, { conclusion: ejemplo.conclusion });
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
      await validarArchivo(recurso.archivo, revision);
    }
  }

  if (registro.perfil) {
    const { revision, nombre, correo, enlaces, cvPdf, retrato, portada, whatsapp } = registro.perfil;
    validarRevision("Perfil", revision);
    if (revision === "aprobado") {
      exigirTextos("Perfil", { nombre });
      const { area, nombreCompleto, titular: [primera, segunda, enfasis], estudios, introduccion, enfoque, ubicacion,
        ejes, capacidades, trayectoria, datos } = portada;
      exigirTextos("Portada", { area, primera, segunda, enfasis, estudios, introduccion, ubicacion });
      exigirParrafos("Portada", "enfoque", enfoque);
      if (nombreCompleto !== undefined) exigirTextos("Portada", { nombreCompleto });
      for (const texto of [...ejes, ...trayectoria]) exigirTextos("Portada", { texto });
      for (const entrada of [...capacidades, ...datos]) exigirTextos("Portada", { ...entrada });
    }
    if (cvPdf) {
      validarRevision("CV", cvPdf.revision);
      if (!cvPdf.archivo.endsWith(".pdf")) throw new Error("CV: se requiere un PDF");
      const revisionDelArchivo = revision === "aprobado" ? cvPdf.revision : "borrador";
      const ruta = await validarArchivo(cvPdf.archivo, revisionDelArchivo);
      const archivo = await open(ruta);
      try {
        const encabezado = Buffer.alloc(5);
        await archivo.read(encabezado, 0, encabezado.length, 0);
        if (encabezado.toString() !== "%PDF-") throw new Error("CV: firma PDF inválida");
      } finally {
        await archivo.close();
      }
    }
    if (retrato) {
      validarRevision("Retrato", retrato.revision);
      const revisionDelArchivo = revision === "aprobado" ? retrato.revision : "borrador";
      if (revisionDelArchivo === "aprobado") exigirTextos("Retrato", { alt: retrato.alt });
      if (!formatoImagen.test(retrato.archivo)) throw new Error("Retrato: formato de imagen inválido");
      await validarArchivo(retrato.archivo, revisionDelArchivo);
    }
    if (correo !== undefined && (typeof correo !== "string" || !/^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)+$/i.test(correo))) {
      throw new Error("Perfil: correo inválido");
    }
    if (whatsapp) {
      validarRevision("WhatsApp", whatsapp.revision);
      if (!/^\+[1-9]\d{7,14}$/.test(whatsapp.numero)) throw new Error("Perfil: número internacional de WhatsApp inválido");
    }
    for (const { url } of enlaces ?? []) validarUrl("Perfil", url);
  }

  return archivosAprobados;
}
