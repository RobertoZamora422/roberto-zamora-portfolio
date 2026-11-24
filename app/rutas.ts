export const paths = {
  inicio: "/",
  trabajo: "/#trabajo",
  aportacion: "/#aportacion",
  sobreMi: "/#sobre-mi",
  contacto: "/#contacto",
} as const;

export const rutaProyecto = (slug: string) => `/proyectos/${slug}/`;
export const rutaCaso = (slug: string) => `/casos-de-estudio/${slug}/`;

// Pages sirve los documentos HTML en su URL sin extensión.
export const rutaRecursoPublico = (archivo: string) => `/recursos/${archivo.replace(/\.html$/, "")}`;
