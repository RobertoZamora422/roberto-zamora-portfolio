import { index, route, type RouteConfig } from "@react-router/dev/routes";
import { paths } from "./rutas";

const preview = process.env.PORTFOLIO_PREVIEW === "1";

export default [
  index("routes/inicio.tsx"),
  route(paths.proyectos, preview ? "pruebas/proyectos.tsx" : "routes/proyectos.tsx"),
  route(paths.casos, preview ? "pruebas/casos.tsx" : "routes/casos.tsx"),
  route(paths.perfil, "routes/perfil.tsx"),
  route(paths.cv, "routes/cv.tsx"),
  route("404", "routes/no-encontrada.tsx"),
  ...(preview
    ? [
        route("/proyectos/:slug", "pruebas/proyecto.tsx"),
        route("/casos-de-estudio/:slug", "pruebas/caso.tsx"),
      ]
    : []),
] satisfies RouteConfig;
