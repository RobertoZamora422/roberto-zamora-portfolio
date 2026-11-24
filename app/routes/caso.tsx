import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { contenido, urlRecursoLocal } from "../contenido/registro.server";
import { rutaCaso, rutaProyecto } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";
import { ListaEvidencias } from "../ui/evidencias";
import { IndiceCaso } from "../ui/indice-caso";

export function loader({ params }: LoaderFunctionArgs) {
  const { casos, paginas, evidencias } = contenido;
  const caso = casos.find(({ slug }) => slug === params.slug);
  if (!caso) throw new Response(null, { status: 404 });

  const proyecto = paginas.find(({ slug }) => slug === caso.proyecto);
  if (!proyecto) throw new Response(null, { status: 404 });
  const { slug, titulo, resumen, contexto, alcance, decisiones, trabajo, validacion, resultadosYLimites,
    competencia, periodo, aprendizajes, resumenVisual, ejemplo } = caso;
  return {
    slug, titulo, resumen, contexto, alcance, decisiones, trabajo, validacion, resultadosYLimites,
    competencia, periodo, aprendizajes, resumenVisual, ejemplo,
    proyecto: {
      nombre: proyecto.nombre,
      ruta: rutaProyecto(proyecto.slug),
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

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => loaderData
  ? metadatosPagina({ titulo: `${loaderData.titulo} · Roberto Zamora`, descripcion: loaderData.resumen, ruta: rutaCaso(loaderData.slug), tipo: "article" })
  : [];

export default function Caso() {
  const caso = useLoaderData<typeof loader>();
  const { ejemplo, resumenVisual } = caso;
  const secciones = [
    ...(ejemplo ? [{
      id: "ejemplo", titulo: ejemplo.titulo, contenido: (
        <>
          <div className="module-grid case-example">
            {ejemplo.situaciones.map(({ titulo, descripcion }) => (
              <div className="panel" key={titulo}>
                {resumenVisual?.length ? <h4>{titulo}</h4> : <h3>{titulo}</h3>}
                <p>{descripcion}</p>
              </div>
            ))}
          </div>
          <ul className="project-links case-example__links" role="list">
            {ejemplo.referencias.map(({ evidencia, texto, ancla }) => {
              const recurso = caso.evidencias.find(({ id }) => id === evidencia);
              return recurso && (
                <li key={ancla}><a className="text-link" href={`${recurso.url}#${ancla}`}>{texto}</a></li>
              );
            })}
          </ul>
        </>
      ),
    }] : []),
    { id: "contexto", titulo: "Problema y contexto", contenido: <p>{caso.contexto}</p> },
    { id: "alcance", titulo: "Alcance y participación", contenido: <p>{caso.alcance}</p> },
    { id: "decisiones", titulo: "Análisis y decisiones", contenido: <p>{caso.decisiones}</p> },
    { id: "trabajo", titulo: "Trabajo realizado", contenido: <p>{caso.trabajo}</p> },
    { id: "validacion", titulo: "Validación y resultados", contenido: (
      <>
        <p>{caso.validacion}</p>
        {resumenVisual?.length ? <h4>Resultados y límites</h4> : <h3>Resultados y límites</h3>}
        <p>{caso.resultadosYLimites}</p>
      </>
    ) },
    ...(caso.evidencias.length ? [{
      id: "evidencias", titulo: "Evidencias",
      contenido: <ListaEvidencias evidencias={caso.evidencias}
        encabezado={resumenVisual?.length ? "h4" : "h3"} />,
    }] : []),
    ...(caso.aprendizajes ? [{ id: "aprendizajes", titulo: "Aprendizajes", contenido: <p>{caso.aprendizajes}</p> }] : []),
  ];

  return (
    <article className="case-detail">
      <PageIntro title={caso.titulo} kicker={(
        <TextLink to={caso.proyecto.ruta} back>Volver a {caso.proyecto.nombre}</TextLink>
      )}>
        <p className="lead">{caso.resumen}</p>
      </PageIntro>
      {!!resumenVisual?.length && (
        <section className="case-overview" aria-labelledby="resumen-caso">
          <h2 id="resumen-caso">El caso en breve</h2>
          <div className="case-overview__links">
            {!!caso.evidencias.length && <TextLink to="#evidencias">Consultar evidencias</TextLink>}
            <TextLink to="#detalle-tecnico">Ver el detalle técnico</TextLink>
          </div>
          <dl className="project-facts case-facts case-summary">
            {resumenVisual.map(({ etiqueta, valor, detalle }) => (
              <div key={etiqueta}>
                <dt>{etiqueta}</dt>
                <dd><strong>{valor}</strong>{detalle && <span>{detalle}</span>}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {(caso.competencia || caso.periodo) && <dl className={resumenVisual?.length ? "project-facts case-facts case-facts--secondary" : "project-facts case-facts"} aria-label="Datos del caso">
        {caso.competencia && <div><dt>Competencia principal</dt><dd>{caso.competencia}</dd></div>}
        {caso.periodo && <div><dt>Periodo</dt><dd>{caso.periodo}</dd></div>}
      </dl>}
      {!!resumenVisual?.length && <h2 className="case-technical-title" id="detalle-tecnico" tabIndex={-1}>Detalle técnico</h2>}
      <div className="case-layout">
        <IndiceCaso key={caso.slug} secciones={secciones} />
        <div className="case-story">
          {secciones.map(({ id, titulo, contenido }) => (
            <section key={id} aria-labelledby={id} className="case-section">
              {resumenVisual?.length
                ? <h3 id={id} tabIndex={-1}>{titulo}</h3>
                : <h2 id={id} tabIndex={-1}>{titulo}</h2>}
              {contenido}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
