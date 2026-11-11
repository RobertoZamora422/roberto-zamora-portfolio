import { useLoaderData } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { rutaProyecto } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";

export const meta = () => [{ title: "Proyectos · Portafolio profesional" }];

export async function loader() {
  const { proyectos, proyectoDestacado } = await cargarContenido();
  const destacadosPrimero = proyectoDestacado
    ? [proyectoDestacado, ...proyectos.filter(({ slug }) => slug !== proyectoDestacado.slug)]
    : proyectos;
  return destacadosPrimero.map(({ slug, ficha, pagina }) => ({
    slug,
    nombre: ficha.nombre,
    resumen: ficha.resumen,
    estado: ficha.estado,
    destacado: slug === proyectoDestacado?.slug,
    ruta: pagina ? rutaProyecto(slug) : undefined,
  }));
}

export default function Proyectos() {
  const proyectos = useLoaderData<typeof loader>();

  return (
    <div className="projects-page">
      <PageIntro title="Proyectos">
        <p className="lead">El propósito y el alcance de cada solución.</p>
      </PageIntro>
      {proyectos.length ? (
        <ul className="project-list" role="list">
          {proyectos.map(({ slug, nombre, resumen, estado, destacado, ruta }) => (
            <li className={destacado ? "project-row project-row--featured" : "project-row"} key={slug}>
              <h2>{nombre}</h2>
              <p>{resumen}</p>
              <div className="project-row__aside">
                <p>{estado}</p>
                {ruta && <TextLink to={ruta} label={`Ver ficha de ${nombre}`}>Ver ficha</TextLink>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p>Por ahora no hay proyectos publicados.</p>}
    </div>
  );
}
