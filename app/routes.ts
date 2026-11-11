import { index, route, type RouteConfig } from "@react-router/dev/routes";
import { cargarContenido } from "./contenido/registro.server";
import { paths } from "./rutas";

const preview = process.env.PORTFOLIO_PREVIEW === "1";

export default cargarContenido().then(({ paginas, casos }) => [
  index("routes/inicio.tsx"),
  route(paths.proyectos, "routes/proyectos.tsx"),
  ...(paginas.length ? [route(`${paths.proyectos}:slug`, "routes/proyecto.tsx")] : []),
  route(paths.casos, preview ? "pruebas/casos.tsx" : "routes/casos.tsx"),
  ...(casos.length ? [route(`${paths.casos}:slug`, "pruebas/caso.tsx")] : []),
  route(paths.perfil, "routes/perfil.tsx"),
  route(paths.cv, "routes/cv.tsx"),
  route("404", "routes/no-encontrada.tsx"),
]) satisfies RouteConfig;
