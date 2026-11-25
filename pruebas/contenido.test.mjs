import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { seleccionarContenido } from "../app/contenido/seleccion.ts";
import { configuracionPublicacion } from "../app/contenido/publicacion.ts";
import { validarRegistro } from "../app/contenido/validar.ts";
import { perfilAprobado, registroFixture } from "./registro-fixture.mjs";

test("La indexación exige un origen HTTPS público y la revisión ignora el origen", () => {
  assert.deepEqual(configuracionPublicacion({}), { origen: undefined, indexar: false });
  assert.throws(() => configuracionPublicacion({ PORTFOLIO_INDEXAR: "1" }), /requiere PORTFOLIO_ORIGEN/);
  for (const origen of ["http://example.org", "https://localhost", "https://ejemplo.pages.dev", "https://example.org/ruta", "https://u@example.org", "https://example.org:443"]) {
    assert.throws(() => configuracionPublicacion({ PORTFOLIO_ORIGEN: origen }), /origen HTTPS/, origen);
  }
  const publicacion = { PORTFOLIO_ORIGEN: "https://example.org/", PORTFOLIO_INDEXAR: "1" };
  assert.deepEqual(configuracionPublicacion(publicacion), { origen: "https://example.org", indexar: true });
  assert.deepEqual(configuracionPublicacion({ ...publicacion, PORTFOLIO_PREVIEW: "1" }), { origen: undefined, indexar: false });
});

test("La tarjeta y la página individual se aprueban de forma independiente", () => {
  const registro = registroFixture();
  const [base] = registro.proyectos;
  const rfm = { ...base, slug: "rfm-core", pagina: { ...base.pagina, revision: "borrador" } };
  registro.proyectos.push(rfm, { ...base, slug: "oculto", revision: "borrador" });
  const contenido = seleccionarContenido(registro);
  assert.deepEqual(contenido.proyectos.map(({ slug }) => slug), [base.slug, rfm.slug]);
  assert.equal(contenido.proyectos[1].pagina, undefined);
  assert.deepEqual(contenido.paginas.map(({ slug }) => slug), [base.slug]);
  rfm.pagina.revision = "aprobado";
  assert.deepEqual(seleccionarContenido(registro).paginas.map(({ slug }) => slug), [base.slug, rfm.slug]);
});

for (const [entidad, grupo] of [["Proyecto", "proyectos"], ["Evidencia", "evidencias"]]) {
  test(`Detecta identificadores duplicados de ${entidad.toLowerCase()}`, async () => {
    const registro = registroFixture();
    registro[grupo].push(registro[grupo][0]);
    await assert.rejects(validarRegistro(registro, ""), new RegExp(`${entidad}: identificador duplicado`));
  });
}

test("Un proyecto admite borradores y un solo caso publicado, cualquiera que sea su título", async () => {
  const registro = registroFixture();
  registro.evidencias[0].recurso = { url: "https://example.org/evidencia" };
  const borrador = { ...registro.casos[0], titulo: "Otra competencia", revision: "borrador" };
  registro.casos.push(borrador);
  await validarRegistro(registro, "");
  assert.equal(seleccionarContenido(registro).casos.length, 1);
  borrador.revision = "aprobado";
  await assert.rejects(validarRegistro(registro, ""), /un caso de estudio por proyecto/);
});

const erroresDeRegistro = [
  ["párrafo vacío", (r) => { r.casos[0].decisiones[0].parrafos = [" "]; }, /falta decisiones/],
  ["URL de proyecto que colisiona con un 301", (r) => { r.proyectos[0].slug = "cv"; }, /URL está reservada/],
  ["URL de proyecto reservada para recursos", (r) => { r.proyectos[0].slug = "recursos"; }, /URL está reservada/],
  ["slug inválido", (r) => { r.proyectos[0].slug = "../otro"; }, /identificador inválido/],
  ["página aprobada con ficha en borrador", (r) => { r.proyectos[0].revision = "borrador"; }, /página aprobada sin ficha aprobada/],
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
  ["recurso editorial en el registro público", (r) => { r.evidencias[0].recurso.archivo = "revision-editorial/ejemplo.html"; }, /reservado para revisión local/],
  ["URL de evidencia inválida", (r) => { r.evidencias[0].recurso = { url: "javascript:alert(1)" }; }, /se requiere una URL HTTPS/],
  ["portada con captura sin aprobar", (r) => {
    r.proyectos[0].visual = { captura: "captura-qa.png" };
  }, /la portada requiere una captura aprobada/],
  ["URL de aplicación inválida", (r) => { r.proyectos[0].aplicacion = "http://example.org"; }, /URL HTTPS/],
  ["caso de proyecto sin página aprobada", (r) => { delete r.proyectos[0].pagina; }, /referencia sin aprobación/],
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

test("El retrato requiere aprobación propia y del perfil", async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-retrato-"));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const perfil = structuredClone(perfilAprobado);
  const registro = { proyectos: [], casos: [], evidencias: [], perfil };
  const { archivo } = perfil.retrato;
  await assert.rejects(validarRegistro(registro, carpeta), /Falta el archivo «retrato-qa.png»/);
  await writeFile(join(carpeta, archivo), "QA");
  assert.deepEqual([...await validarRegistro(registro, carpeta)].map(([ruta]) => ruta), [archivo]);
  perfil.retrato.revision = "borrador";
  assert.equal((await validarRegistro(registro, carpeta)).size, 0);
  perfil.retrato.revision = "aprobado";
  perfil.revision = "borrador";
  assert.equal((await validarRegistro(registro, carpeta)).size, 0);
});

test("El CV requiere un archivo PDF y la aprobación del archivo y del perfil", async (t) => {
  const carpeta = await mkdtemp(join(tmpdir(), "portafolio-cv-"));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const registro = { proyectos: [], casos: [], evidencias: [], perfil: undefined };
  await writeFile(join(carpeta, "firma-qa.pdf"), "%PDF-");
  await writeFile(join(carpeta, "firma-invalida.pdf"), "archivo QA");
  registro.perfil = { ...perfilAprobado, retrato: undefined, cvPdf: { revision: "borrador", archivo: "firma-qa.pdf" } };
  assert(!(await validarRegistro(registro, carpeta)).has("firma-qa.pdf"));
  registro.perfil.cvPdf.revision = "aprobado";
  assert((await validarRegistro(registro, carpeta)).has("firma-qa.pdf"));
  registro.perfil.revision = "borrador";
  assert(!(await validarRegistro(registro, carpeta)).has("firma-qa.pdf"));
  registro.perfil.cvPdf.archivo = "firma-invalida.pdf";
  await assert.rejects(validarRegistro(registro, carpeta), /firma PDF inválida/);
  registro.perfil.cvPdf.archivo = "inexistente.pdf";
  await assert.rejects(validarRegistro(registro, carpeta), /Falta el archivo/);
});

test("El correo del perfil admite un buzón simple y rechaza parámetros de mailto", async () => {
  const { retrato, ...perfil } = perfilAprobado;
  const registro = { proyectos: [], casos: [], evidencias: [], perfil: { ...perfil, correo: "talento+qa@example.test" } };
  await validarRegistro(registro, "");
  registro.perfil.correo += "?bcc=otro@example.test";
  await assert.rejects(validarRegistro(registro, ""), /correo inválido/);
});

test("WhatsApp exige un número internacional en formato E.164", async () => {
  const { retrato, ...perfil } = perfilAprobado;
  const whatsapp = { revision: "aprobado", numero: "+12025550147" };
  const registro = { proyectos: [], casos: [], evidencias: [], perfil: { ...perfil, whatsapp } };
  await validarRegistro(registro, "");
  whatsapp.numero = "+12025550147?text=QA";
  await assert.rejects(validarRegistro(registro, ""), /número internacional de WhatsApp inválido/);
});
