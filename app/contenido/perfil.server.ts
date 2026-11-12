import { rutaCaso } from "../rutas";
import { cargarContenido, urlRecursoLocal } from "./registro.server";

export async function cargarPerfilProfesional() {
  const { perfil, casos, evidencias } = await cargarContenido();
  if (!perfil) return null;

  const { nombre, presentacion, sobreMi, resumenProfesional, formacion, correo, enlaces } = perfil;
  const evidenciasPorId = new Map(evidencias.map((evidencia) => [evidencia.id, evidencia]));
  return {
    nombre, presentacion, sobreMi, resumenProfesional, formacion, correo, enlaces,
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
