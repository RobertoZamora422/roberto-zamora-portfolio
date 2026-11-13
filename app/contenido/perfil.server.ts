import { rutaCaso } from "../rutas";
import { cargarContenido, urlRecursoLocal } from "./registro.server";

export async function cargarPerfilProfesional() {
  return prepararPerfilProfesional(await cargarContenido());
}

export function prepararPerfilProfesional({ perfil, casos, evidencias }: Awaited<ReturnType<typeof cargarContenido>>) {
  if (!perfil) return null;

  const { nombre, presentacion, descripcionInicio, sobreMi, formacion, correo, enlaces, cvPdf, intereses } = perfil;
  const evidenciasPorId = new Map(evidencias.map((evidencia) => [evidencia.id, evidencia]));
  return {
    nombre, presentacion, descripcionInicio, sobreMi, formacion, correo, enlaces, intereses,
    cvPdf: cvPdf?.revision === "aprobado" ? urlRecursoLocal(cvPdf.archivo) : undefined,
    casos: casos.filter(({ slug }) => perfil.casos?.includes(slug))
      .map(({ slug, titulo }) => ({ titulo, url: rutaCaso(slug) })),
    trayectoria: perfil.trayectoria.map(({ titulo, descripcion, evidencias: ids }) => ({
      titulo,
      descripcion,
      evidencias: ids.map((id) => {
        const evidencia = evidenciasPorId.get(id);
        if (!evidencia) throw new Error(`Falta evidencia aprobada para el perfil: ${id}`);
        const { titulo, recurso } = evidencia;
        return { titulo, url: "url" in recurso ? recurso.url : urlRecursoLocal(recurso.archivo) };
      }),
    })),
  };
}

export type PerfilProfesional = NonNullable<Awaited<ReturnType<typeof cargarPerfilProfesional>>>;
