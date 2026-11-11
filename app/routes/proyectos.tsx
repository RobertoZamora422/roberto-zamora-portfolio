import { Link, useLoaderData } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { rutaProyecto } from "../rutas";
import { PageIntro } from "../ui/elementos";

export const meta = () => [{ title: "Proyectos · Portafolio profesional" }];

export async function loader() {
  const { proyectos } = await cargarContenido();
  return proyectos.map(({ slug, ficha, pagina }) => ({
    slug,
    nombre: ficha.nombre,
    resumen: ficha.resumen,
    estado: ficha.estado,
    ruta: pagina ? rutaProyecto(slug) : undefined,
  }));
}

export default function Proyectos() {
  const proyectos = useLoaderData<typeof loader>();

  return (
    <div className="editorial-page page-stack">
      <PageIntro title="Proyectos">
        <p className="editorial-lead">El propósito y el alcance de cada solución.</p>
      </PageIntro>
      {proyectos.length ? (
        <ul className="project-list" role="list">
          {proyectos.map(({ slug, nombre, resumen, estado, ruta }) => (
            <li key={slug}>
              <article className="panel project-row">
                <div className="project-row__summary">
                  <h2>{nombre}</h2>
                  <p>{resumen}</p>
                </div>
                <div className="project-row__aside">
                  <p className="project-state">{estado}</p>
                  {ruta && <Link className="editorial-link" to={ruta} aria-label={`Ver proyecto ${nombre}`}>Ver proyecto</Link>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : <p>Por ahora no hay proyectos publicados.</p>}
    </div>
  );
}
