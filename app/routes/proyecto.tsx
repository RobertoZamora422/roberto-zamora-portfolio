import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { contenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";
import { EnlacesProyecto } from "../ui/enlaces-proyecto";

export function loader({ params }: LoaderFunctionArgs) {
  const proyecto = contenido.paginas.find(({ slug }) => slug === params.slug);
  if (!proyecto) throw new Response(null, { status: 404 });
  const { slug, nombre, estado, aplicacion, repositorio, pagina } = proyecto;
  const { entradilla, contexto, problema, solucion, participacion, tecnologias } = pagina;
  return {
    slug, nombre, estado, aplicacion, repositorio, entradilla, contexto, problema, solucion, participacion, tecnologias,
    capturas: pagina.capturas?.filter(({ revision }) => revision === "aprobado")
      .map(({ archivo, titulo, alt, descripcion, ancho, alto }) => ({ titulo, alt, descripcion, ancho, alto, url: urlRecursoLocal(archivo) })),
    casos: contenido.casos.filter((caso) => caso.proyecto === slug).map(({ slug, titulo, resumen }) => ({
      titulo, resumen, ruta: rutaCaso(slug),
    })),
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => loaderData
  ? metadatosPagina({ titulo: `${loaderData.nombre} · Roberto Zamora`, descripcion: loaderData.entradilla, ruta: rutaProyecto(loaderData.slug), tipo: "article" })
  : [];

export default function Proyecto() {
  const proyecto = useLoaderData<typeof loader>();
  return (
    <article className="project-detail">
      <PageIntro title={proyecto.nombre} kicker={<TextLink to={paths.trabajo} back>Volver a mi trabajo</TextLink>}>
        <p className="lead">{proyecto.entradilla}</p>
        <div className="editorial-project__links">
          <EnlacesProyecto nombre={proyecto.nombre} aplicacion={proyecto.aplicacion} repositorio={proyecto.repositorio} />
        </div>
      </PageIntro>
      <dl className="project-facts" aria-label="Datos del proyecto">
        <div><dt>Estado</dt><dd>{proyecto.estado}</dd></div>
        {!!proyecto.tecnologias?.length && <div><dt>Tecnologías</dt><dd>{proyecto.tecnologias.join(", ")}</dd></div>}
      </dl>
      <div className="project-story">
        <section aria-labelledby="problema">
          <h2 id="problema">Contexto y problema</h2>
          <div className="project-story__body"><p>{proyecto.contexto}</p><p>{proyecto.problema}</p></div>
        </section>
        <section aria-labelledby="solucion">
          <h2 id="solucion">La solución</h2>
          <p>{proyecto.solucion}</p>
        </section>
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
        <section aria-labelledby="participacion">
          <h2 id="participacion">Mi participación</h2>
          <p>{proyecto.participacion}</p>
        </section>
      </div>
      {proyecto.casos.map(({ ruta, titulo, resumen }) => (
        <section className="lectura-caso" key={ruta} aria-label={`Caso de estudio · ${titulo}`}>
          <p className="editorial-section__index">Caso de estudio</p>
          <div>
            <h2>{titulo}.</h2>
            <p>{resumen}</p>
            <TextLink to={ruta} label={`Leer caso de estudio: ${titulo}`}>Leer caso de estudio</TextLink>
          </div>
        </section>
      ))}
    </article>
  );
}
