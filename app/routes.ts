import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/inicio.tsx"),
  route(":proyecto", "routes/proyecto.tsx"),
  route(":proyecto/caso-de-estudio", "routes/caso.tsx"),
] satisfies RouteConfig;
