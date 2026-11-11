import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { seleccionarContenido } from "../app/contenido/seleccion.ts";
import { validarRegistro } from "../app/contenido/validar.ts";
import { registroFixture } from "./registro-fixture.mjs";

test("La ficha y la página se aprueban de forma independiente y RFM CORE tiene prioridad", () => {
  const registro = registroFixture();
  const [base] = registro.proyectos;
  const rfm = { ...base, slug: "rfm-core", pagina: { ...base.pagina, revision: "borrador" } };
  registro.proyectos.push(rfm, { ...base, slug: "oculto", ficha: { ...base.ficha, revision: "borrador" } });
  const contenido = seleccionarContenido(registro);
  assert.deepEqual(contenido.proyectos.map(({ slug }) => slug), [base.slug, rfm.slug]);
  assert.equal(contenido.proyectos[1].pagina, undefined);
  assert.deepEqual(contenido.paginas.map(({ slug }) => slug), [base.slug]);
  assert.equal(contenido.proyectoDestacado.slug, base.slug);
  rfm.pagina.revision = "aprobado";
  assert.equal(seleccionarContenido(registro).proyectoDestacado.slug, rfm.slug);
});

for (const [entidad, grupo] of [["Proyecto", "proyectos"], ["Caso", "casos"], ["Evidencia", "evidencias"]]) {
  test(`Detecta identificadores duplicados de ${entidad.toLowerCase()}`, async () => {
    const registro = registroFixture();
    registro[grupo].push(registro[grupo][0]);
    await assert.rejects(validarRegistro(registro, ""), new RegExp(`${entidad}: identificador duplicado`));
  });
}

const erroresDeRegistro = [
  ["slug inválido", (r) => { r.proyectos[0].slug = "../otro"; }, /identificador inválido/],
  ["página aprobada con ficha en borrador", (r) => { r.proyectos[0].ficha.revision = "borrador"; }, /página aprobada sin ficha aprobada/],
  ["proyecto inexistente", (r) => { r.casos[0].proyecto = "otro"; }, /referencia inexistente «otro»/],
  ["evidencia inexistente", (r) => { r.proyectos[0].pagina.evidencias = ["otra"]; }, /referencia inexistente «otra»/],
  ["evidencia en borrador", (r) => { r.evidencias[0].revision = "borrador"; }, /referencia sin aprobación/],
  ["participación sin evidencia", (r) => { r.proyectos[0].pagina.evidencias = []; }, /falta evidencia aprobada/],
  ["campo requerido vacío", (r) => { r.proyectos[0].pagina.solucion = " "; }, /falta solucion/],
  ["campo requerido ausente", (r) => { delete r.proyectos[0].pagina.participacion; }, /falta participacion/],
  ["estado de revisión inválido", (r) => { r.casos[0].revision = "pendiente"; }, /estado de revisión inválido/],
  ["archivo ausente", () => {}, /Falta el archivo/],
  ["ruta de archivo inválida", (r) => { r.evidencias[0].recurso.archivo = "../fuera.txt"; }, /Ruta de recurso inválida/],
  ["recurso de revisión local en el registro público", (r) => { r.evidencias[0].recurso.archivo = "pruebas/ejemplo.txt"; }, /reservado para revisión local/],
  ["URL de evidencia inválida", (r) => { r.evidencias[0].recurso = { url: "javascript:alert(1)" }; }, /se requiere una URL HTTPS/],
  ["destacado en borrador", (r) => {
    r.casos[0].revision = "borrador";
    r.evidencias[0].recurso = { url: "https://example.org/evidencia" };
  }, /Caso destacado: referencia sin aprobación/],
];

for (const [nombre, cambiar, error] of erroresDeRegistro) {
  test(`Detecta ${nombre}`, async () => {
    const registro = registroFixture();
    cambiar(registro);
    await assert.rejects(validarRegistro(registro, "recursos-inexistentes-qa"), error);
  });
}

test("Devuelve solo los archivos aprobados aunque el borrador exista en disco", async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-registro-"));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const registro = registroFixture();
  const [evidencia] = registro.evidencias;
  registro.evidencias.push({ ...evidencia, id: "borrador", revision: "borrador", recurso: { archivo: "borrador.txt" } });
  await Promise.all([writeFile(join(carpeta, evidencia.recurso.archivo), "QA"), writeFile(join(carpeta, "borrador.txt"), "QA")]);
  assert.deepEqual([...await validarRegistro(registro, carpeta)].map(([archivo]) => archivo), [evidencia.recurso.archivo]);
});
