export const paths = {
  inicio: "/",
  proyectos: "/proyectos/",
  casos: "/casos-de-estudio/",
  perfil: "/sobre-mi/",
  cv: "/cv/",
  contacto: "/cv/#contacto",
} as const;

export const rutaProyecto = (slug: string) => `${paths.proyectos}${slug}/`;
export const rutaCaso = (slug: string) => `${paths.casos}${slug}/`;
