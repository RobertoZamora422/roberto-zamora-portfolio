import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import type { TextoConTitulo } from "../contenido/modelo";
import { contenido } from "../contenido/registro.server";
import { rutaCaso, rutaProyecto, rutaRecursoPublico } from "../rutas";
import { PageIntro, Parrafos, TextLink } from "../ui/elementos";
import { ListaEvidencias } from "../ui/evidencias";
import { IndiceCaso } from "../ui/indice-caso";

export function loader({ params }: LoaderFunctionArgs) {
  const caso = contenido.casos.find(({ proyecto }) => proyecto === params.proyecto);
  const proyecto = contenido.paginas.find(({ slug }) => slug === params.proyecto);
  if (!caso || !proyecto) throw new Response(null, { status: 404 });
  const { revision, proyecto: slug, evidencias: ids, ...texto } = caso;
  return {
    ...texto, slug, nombreProyecto: proyecto.nombre,
    evidencias: ids.map((id) => {
      const { titulo, tipo, fuente, autoria, afirmacion, recurso } = contenido.evidencias.find((e) => e.id === id)!;
      return { id, titulo, tipo, fuente, autoria, afirmacion,
        url: "archivo" in recurso ? rutaRecursoPublico(recurso.archivo) : recurso.url };
    }),
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => loaderData
  ? metadatosPagina({ titulo: `${loaderData.titulo} · Roberto Zamora`, descripcion: loaderData.resumen, ruta: rutaCaso(loaderData.slug), tipo: "article" })
  : [];

function ListaResultados({ entradas }: { entradas: readonly TextoConTitulo[] }) {
  return <ul>{entradas.map(({ titulo, descripcion }) => (
    <li key={titulo}><strong>{titulo}</strong> · {descripcion}</li>
  ))}</ul>;
}

export default function Caso() {
  const caso = useLoaderData<typeof loader>();
  const { ejemplo, validacion } = caso;
  const secciones = [
    { id: "contexto", titulo: "Contexto y problema", contenido: <Parrafos textos={caso.contexto} /> },
    { id: "alcance", titulo: "Alcance y participación", contenido: <Parrafos textos={caso.alcance} /> },
    { id: "decisiones", titulo: "Análisis y decisiones de diseño", contenido: caso.decisiones.map(({ titulo, parrafos }) => (
      <div className="case-decision" key={titulo}><h4>{titulo}</h4><Parrafos textos={parrafos} /></div>
    )) },
    ...(ejemplo ? [{
      id: "ejemplo", titulo: "Una regla de negocio en la práctica", contenido: (
        <>
          <div className="module-grid case-example">
            {ejemplo.situaciones.map(({ titulo, parrafos }) => (
              <div className="panel" key={titulo}><h4>{titulo}</h4><Parrafos textos={parrafos} /></div>
            ))}
          </div>
          <p>{ejemplo.conclusion}</p>
          <ul className="project-links case-example__links" role="list">
            {ejemplo.referencias.map(({ evidencia, texto, ancla }) => {
              const recurso = caso.evidencias.find(({ id }) => id === evidencia)!;
              return <li key={ancla}><a className="text-link" href={`${recurso.url}#${ancla}`}>{texto}</a></li>;
            })}
          </ul>
        </>
      ),
    }] : []),
    { id: "trazabilidad", titulo: "Trazabilidad funcional", contenido: <Parrafos textos={caso.trazabilidad} /> },
    { id: "validacion", titulo: "Validación y resultados", contenido: (
      <>
        <p>{validacion.introduccion}</p>
        <ListaResultados entradas={validacion.escenarios} />
        <p>{validacion.ejecucion}</p>
        <ListaResultados entradas={validacion.resultados} />
        <p>{validacion.fuente}</p>
        <h4>Alcance y limitaciones de la validación</h4>
        <Parrafos textos={validacion.limites} />
      </>
    ) },
    { id: "evidencias", titulo: "Evidencias", contenido: <ListaEvidencias evidencias={caso.evidencias} /> },
    ...(caso.aprendizajes ? [{ id: "aprendizajes", titulo: "Aprendizajes", contenido: <Parrafos textos={caso.aprendizajes} /> }] : []),
  ];

  return (
    <article className="case-detail">
      <PageIntro title={caso.titulo} kicker={(
        <TextLink to={rutaProyecto(caso.slug)} back>Volver a {caso.nombreProyecto}</TextLink>
      )}>
        <p className="lead">{caso.pregunta}</p>
        <p className="case-intro">{caso.introduccion}</p>
      </PageIntro>
      <section className="case-overview" aria-labelledby="resumen-caso">
        <h2 id="resumen-caso">El caso en breve</h2>
        <div className="case-overview__links">
          <TextLink to="#evidencias">Consultar evidencias</TextLink>
          <TextLink to="#detalle-tecnico">Ver el detalle técnico</TextLink>
        </div>
        <dl className="project-facts case-facts case-summary">
          {caso.resumenVisual.map(({ titulo, descripcion }) => (
            <div key={titulo}><dt>{titulo}</dt><dd>{descripcion}</dd></div>
          ))}
        </dl>
        {(caso.competencias || caso.periodo) && <dl className="project-facts case-facts case-facts--secondary">
          {caso.competencias && <div><dt>Competencias</dt><dd>{caso.competencias}</dd></div>}
          {caso.periodo && <div><dt>Periodo</dt><dd>{caso.periodo}</dd></div>}
        </dl>}
      </section>
      <h2 className="case-technical-title" id="detalle-tecnico" tabIndex={-1}>Detalle técnico</h2>
      <div className="case-layout">
        <IndiceCaso key={caso.slug} secciones={secciones} />
        <div className="case-story">
          {secciones.map(({ id, titulo, contenido }) => (
            <section key={id} aria-labelledby={id} className="case-section">
              <h3 id={id} tabIndex={-1}>{titulo}</h3>
              {contenido}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
