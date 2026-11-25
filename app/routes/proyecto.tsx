import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { contenido } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto, rutaRecursoPublico } from "../rutas";
import { PageIntro, Parrafos, TextLink } from "../ui/elementos";
import { EnlacesProyecto } from "../ui/enlaces-proyecto";

export function loader({ params }: LoaderFunctionArgs) {
  const proyecto = contenido.paginas.find(({ slug }) => slug === params.proyecto);
  if (!proyecto) throw new Response(null, { status: 404 });
  const { slug, nombre, estado, aplicacion, repositorio, pagina } = proyecto;
  const { entradilla, contexto, solucion, participacion, tecnologias } = pagina;
  const caso = contenido.casos.find((entrada) => entrada.proyecto === slug);
  return {
    slug, nombre, estado, aplicacion, repositorio, entradilla, contexto, solucion, participacion, tecnologias,
    capturas: pagina.capturas?.filter(({ revision }) => revision === "aprobado")
      .map(({ archivo, titulo, alt, descripcion, nota, ancho, alto }) => ({ titulo, alt, descripcion, nota, ancho, alto, url: rutaRecursoPublico(archivo) })),
    caso: caso && { titulo: caso.titulo, resumen: caso.resumen, ruta: rutaCaso(slug) },
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
          <div className="project-story__body"><Parrafos textos={proyecto.contexto} /></div>
        </section>
        <section aria-labelledby="solucion">
          <h2 id="solucion">La solución</h2>
          <div className="project-story__body"><Parrafos textos={proyecto.solucion} /></div>
        </section>
        {!!proyecto.capturas?.length && (
          <section className="project-product" aria-labelledby="producto">
            <h2 id="producto">El producto</h2>
            <div className="project-captures">
              {proyecto.capturas.map(({ url, titulo, alt, descripcion, nota, ancho, alto }) => (
                <figure key={url}>
                  <a href={url} aria-label={`Ampliar captura de ${titulo}`}>
                    <img src={url} alt={alt} width={ancho} height={alto} loading="lazy" />
                  </a>
                  <figcaption><h3>{titulo}</h3><p>{descripcion}</p>{nota && <small><em>{nota}</em></small>}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        <section aria-labelledby="participacion">
          <h2 id="participacion">Mi participación</h2>
          <div className="project-story__body"><Parrafos textos={proyecto.participacion} /></div>
        </section>
      </div>
      {proyecto.caso && (
        <section className="lectura-caso" aria-label={`Caso de estudio · ${proyecto.caso.titulo}`}>
          <p className="editorial-section__index">Caso de estudio</p>
          <div>
            <h2>{proyecto.caso.titulo}</h2>
            <p>{proyecto.caso.resumen}</p>
            <TextLink to={proyecto.caso.ruta} label={`Leer caso de estudio: ${proyecto.caso.titulo}`}>Leer caso de estudio</TextLink>
          </div>
        </section>
      )}
    </article>
  );
}
