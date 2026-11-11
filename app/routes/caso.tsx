import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaProyecto } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";
import { ListaEvidencias } from "../ui/evidencias";
import { IndiceCaso } from "../ui/indice-caso";

export async function loader({ params }: LoaderFunctionArgs) {
  const { casos, proyectos, evidencias } = await cargarContenido();
  const caso = casos.find(({ slug }) => slug === params.slug);
  if (!caso) throw new Response(null, { status: 404 });

  const proyecto = proyectos.find(({ slug }) => slug === caso.proyecto);
  const { slug, titulo, resumen, contexto, alcance, decisiones, trabajo, validacion, resultadosYLimites,
    competencia, periodo, aprendizajes } = caso;
  return {
    slug, titulo, resumen, contexto, alcance, decisiones, trabajo, validacion, resultadosYLimites,
    competencia, periodo, aprendizajes,
    proyecto: proyecto && {
      nombre: proyecto.ficha.nombre,
      ruta: proyecto.pagina ? rutaProyecto(proyecto.slug) : undefined,
    },
    evidencias: caso.evidencias.flatMap((referencia) => {
      const evidencia = evidencias.find(({ id }) => id === referencia);
      if (!evidencia) return [];
      const { id, titulo, tipo, fuente, autoria, afirmacion, recurso } = evidencia;
      return [{ id, titulo, tipo, fuente, autoria, afirmacion,
        url: "archivo" in recurso ? urlRecursoLocal(recurso.archivo) : recurso.url }];
    }),
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: loaderData ? `${loaderData.titulo} · Casos de estudio` : "Página no encontrada · Portafolio profesional" },
  ...(loaderData ? [{ name: "description", content: loaderData.resumen }] : []),
];

export default function Caso() {
  const caso = useLoaderData<typeof loader>();
  const secciones = [
    { id: "contexto", titulo: "Problema y contexto", contenido: <p>{caso.contexto}</p> },
    { id: "alcance", titulo: "Alcance y participación", contenido: <p>{caso.alcance}</p> },
    { id: "decisiones", titulo: "Análisis y decisiones", contenido: <p>{caso.decisiones}</p> },
    { id: "trabajo", titulo: "Trabajo realizado", contenido: <p>{caso.trabajo}</p> },
    { id: "validacion", titulo: "Validación y resultados", contenido: (
      <>
        <p>{caso.validacion}</p>
        <h3>Resultados y límites</h3>
        <p>{caso.resultadosYLimites}</p>
      </>
    ) },
    ...(caso.evidencias.length ? [{ id: "evidencias", titulo: "Evidencias", contenido: <ListaEvidencias evidencias={caso.evidencias} /> }] : []),
    ...(caso.aprendizajes ? [{ id: "aprendizajes", titulo: "Aprendizajes", contenido: <p>{caso.aprendizajes}</p> }] : []),
  ];

  return (
    <article className="case-detail">
      <PageIntro title={caso.titulo} kicker={(
        <nav className="project-crumb" aria-label="Ubicación del caso">
          <TextLink to={paths.casos} back>Volver a Casos de estudio</TextLink>
        </nav>
      )}>
        <p className="lead">{caso.resumen}</p>
        {process.env.PORTFOLIO_PREVIEW === "1" && <p className="technical-label">Vista local de revisión</p>}
      </PageIntro>
      <dl className="project-facts case-facts" aria-label="Datos del caso">
        {caso.proyecto && (
          <div><dt>Proyecto</dt><dd>{caso.proyecto.ruta
            ? <TextLink to={caso.proyecto.ruta}>{caso.proyecto.nombre}</TextLink>
            : caso.proyecto.nombre}</dd></div>
        )}
        {caso.competencia && <div><dt>Competencia principal</dt><dd>{caso.competencia}</dd></div>}
        {caso.periodo && <div><dt>Periodo</dt><dd>{caso.periodo}</dd></div>}
      </dl>
      <div className="case-layout">
        <IndiceCaso key={caso.slug} secciones={secciones} />
        <div className="case-story">
          {secciones.map(({ id, titulo, contenido }) => (
            <section key={id} aria-labelledby={id} className="case-section">
              <h2 id={id} tabIndex={-1}>{titulo}</h2>
              {contenido}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
