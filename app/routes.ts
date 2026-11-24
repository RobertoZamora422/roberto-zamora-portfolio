import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/inicio.tsx"),
  route("proyectos/:slug", "routes/proyecto.tsx"),
  route("casos-de-estudio/:slug", "routes/caso.tsx"),
] satisfies RouteConfig;
