import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";

export async function loader({ params }: LoaderFunctionArgs) {
  const { paginas, casos, evidencias } = await cargarContenido();
  const proyecto = paginas.find(({ slug }) => slug === params.slug);
  if (!proyecto) throw new Response(null, { status: 404 });

  const { ficha, pagina } = proyecto;
  return {
    nombre: ficha.nombre,
    estado: ficha.estado,
    entradilla: pagina.entradilla,
    problema: pagina.problema,
    contexto: pagina.contexto,
    proposito: pagina.proposito,
    solucion: pagina.solucion,
    participacion: pagina.participacion,
    tecnologias: pagina.tecnologias,
    evidencias: evidencias.filter(({ id }) => pagina.evidencias.includes(id)).map(({ id, titulo, recurso }) => ({
      id,
      titulo,
      url: "archivo" in recurso ? urlRecursoLocal(recurso.archivo) : recurso.url,
    })),
    casos: casos.filter(({ proyecto: slug }) => slug === proyecto.slug).map(({ slug, titulo }) => ({
      titulo,
      ruta: rutaCaso(slug),
    })),
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [{
  title: loaderData ? `${loaderData.nombre} · Proyectos` : "Página no encontrada · Portafolio profesional",
}];

export default function Proyecto() {
  const proyecto = useLoaderData<typeof loader>();

  return (
    <article className="project-detail">
      <PageIntro title={proyecto.nombre} kicker={(
        <nav className="project-crumb" aria-label="Ubicación del proyecto">
          <TextLink to={paths.proyectos} back>Volver a Proyectos</TextLink>
        </nav>
      )}>
        <p className="lead">{proyecto.entradilla}</p>
      </PageIntro>
      <dl className="project-facts" aria-label="Datos del proyecto">
        <div><dt>Estado</dt><dd>{proyecto.estado}</dd></div>
        {!!proyecto.tecnologias?.length && (
          <div><dt>Tecnologías</dt><dd>{proyecto.tecnologias.join(", ")}</dd></div>
        )}
      </dl>
      <div className="project-story">
        <section aria-labelledby="problema">
          <h2 id="problema">El problema</h2>
          <div className="project-story__body">
            <p>{proyecto.contexto}</p>
            <p>{proyecto.problema}</p>
          </div>
        </section>
        <section aria-labelledby="solucion">
          <h2 id="solucion">La solución</h2>
          <div className="project-story__body">
            <p>{proyecto.proposito}</p>
            <p>{proyecto.solucion}</p>
          </div>
        </section>
        <section aria-labelledby="participacion">
          <h2 id="participacion">Participación personal</h2>
          <div className="project-story__body">
            <p>{proyecto.participacion}</p>
            <ul className="project-links" role="list" aria-label="Evidencias de la participación">
              {proyecto.evidencias.map(({ id, titulo, url }) => (
                <li key={id}><a className="text-link" href={url}>{titulo}</a></li>
              ))}
            </ul>
          </div>
        </section>
        {!!proyecto.casos.length && (
          <section aria-labelledby="casos-relacionados">
            <h2 id="casos-relacionados">Casos relacionados</h2>
            <ul className="project-links" role="list">
              {proyecto.casos.map(({ titulo, ruta }) => (
                <li key={ruta}><TextLink to={ruta}>{titulo}</TextLink></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
