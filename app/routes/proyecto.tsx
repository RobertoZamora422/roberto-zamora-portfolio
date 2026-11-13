import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
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
    capturas: pagina.capturas?.filter(({ revision }) => revision === "aprobado")
      .map(({ archivo, ...captura }) => ({ ...captura, url: urlRecursoLocal(archivo) })),
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

export const meta: MetaFunction<typeof loader> = ({ loaderData, params }) => loaderData && params.slug
  ? metadatosPagina({ titulo: `${loaderData.nombre} · Proyectos`, descripcion: loaderData.entradilla, ruta: rutaProyecto(params.slug) })
  : [{ title: "Página no encontrada · Portafolio profesional" }, { name: "robots", content: "noindex" }];

export default function Proyecto() {
  const proyecto = useLoaderData<typeof loader>();
  const casoUnico = proyecto.casos.length === 1 ? proyecto.casos[0] : undefined;

  return (
    <article className="project-detail">
      <PageIntro title={proyecto.nombre} kicker={(
        <nav className="project-crumb" aria-label="Ubicación del proyecto">
          <TextLink to={paths.proyectos} back>Volver a Proyectos</TextLink>
        </nav>
      )}>
        <p className="lead">{proyecto.entradilla}</p>
        {casoUnico && <TextLink to={casoUnico.ruta}>{casoUnico.titulo}</TextLink>}
      </PageIntro>
      <dl className="project-facts" aria-label="Datos del proyecto">
        <div><dt>Estado</dt><dd>{proyecto.estado}</dd></div>
        {!!proyecto.tecnologias?.length && (
          <div><dt>Tecnologías</dt><dd>{proyecto.tecnologias.join(", ")}</dd></div>
        )}
      </dl>
      <div className="project-story">
        {!!proyecto.capturas?.length && (
          <section className="project-product" aria-labelledby="producto">
            <h2 id="producto">El producto</h2>
            <div className="project-captures">
              {proyecto.capturas.map(({ url, titulo, alt, descripcion, ancho, alto }) => (
                <figure key={url}>
                  <a href={url} aria-label={`Ampliar captura de ${titulo}`}>
                    <img src={url} alt={alt} width={ancho} height={alto} loading="lazy" />
                  </a>
                  <figcaption><strong>{titulo}</strong><p>{descripcion}</p></figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
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
        {proyecto.casos.length > 1 && (
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
