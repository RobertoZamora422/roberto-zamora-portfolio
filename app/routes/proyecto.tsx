import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { paths, rutaCaso } from "../rutas";
import { PageIntro } from "../ui/elementos";

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
      url: "archivo" in recurso
        ? `${import.meta.env.DEV ? "/recursos-contenido" : "/recursos"}/${recurso.archivo}`
        : recurso.url,
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
    <article className="editorial-page page-stack project-detail">
      <nav aria-label="Ubicación del proyecto">
        <Link className="editorial-link project-crumb" to={paths.proyectos}>Proyectos</Link>
      </nav>
      <PageIntro title={proyecto.nombre} kicker={<p className="editorial-meta">{proyecto.estado}</p>}>
        <p className="editorial-lead">{proyecto.entradilla}</p>
      </PageIntro>
      <div className="module-grid">
        <section className="panel" aria-labelledby="solucion">
          <h2 id="solucion">Problema, propósito y solución</h2>
          <p>{proyecto.contexto}</p>
          <p>{proyecto.problema}</p>
          <p>{proyecto.proposito}</p>
          <p>{proyecto.solucion}</p>
        </section>
        <section className="panel" aria-labelledby="participacion">
          <h2 id="participacion">Participación personal</h2>
          <p>{proyecto.participacion}</p>
          {!!proyecto.tecnologias?.length && (
            <dl className="project-facts">
              <dt className="editorial-meta">Tecnologías</dt>
              <dd>{proyecto.tecnologias.join(", ")}</dd>
            </dl>
          )}
          <ul className="project-links" role="list" aria-label="Evidencias de la participación">
            {proyecto.evidencias.map(({ id, titulo, url }) => (
              <li key={id}><a className="editorial-link" href={url}>{titulo}</a></li>
            ))}
          </ul>
        </section>
      </div>
      {!!proyecto.casos.length && (
        <section className="panel" aria-labelledby="casos-relacionados">
          <h2 id="casos-relacionados">Casos relacionados</h2>
          <ul className="project-links" role="list">
            {proyecto.casos.map(({ titulo, ruta }) => (
              <li key={ruta}><Link className="editorial-link" to={ruta}>{titulo}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
