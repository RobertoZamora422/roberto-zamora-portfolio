export const paths = {
  inicio: "/",
  trabajo: "/#trabajo",
  aportacion: "/#aportacion",
  sobreMi: "/#sobre-mi",
  contacto: "/#contacto",
} as const;

export const rutaProyecto = (slug: string) => `/${slug}/`;
export const rutaCaso = (proyecto: string) => `${rutaProyecto(proyecto)}caso-de-estudio/`;

export const rutasAnteriores: ReadonlyArray<readonly [string, string]> = [
  ["/proyectos", paths.trabajo], ["/sobre-mi", paths.sobreMi], ["/cv", paths.contacto],
  ["/proyectos/rfm-core", rutaProyecto("rfm-core")],
  ["/casos-de-estudio/del-interes-comercial-al-contrato", rutaCaso("rfm-core")],
  ["/casos-de-estudio", rutaCaso("rfm-core")],
];

// Pages sirve los documentos HTML en su URL sin extensión.
export const rutaRecursoPublico = (archivo: string) => `/recursos/${archivo.replace(/\.html$/, "")}`;
