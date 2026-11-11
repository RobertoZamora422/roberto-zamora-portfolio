import { useLoaderData } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { rutaCaso } from "../rutas";
import { PageIntro, TextLink } from "../ui/elementos";

export const meta = () => [{ title: "Casos de estudio · Portafolio profesional" }];

export async function loader() {
  const { casos, proyectos } = await cargarContenido();
  return casos.map(({ slug, titulo, resumen, competencia, proyecto }) => ({
    titulo,
    resumen,
    competencia,
    proyecto: proyectos.find((entrada) => entrada.slug === proyecto)?.ficha.nombre,
    ruta: rutaCaso(slug),
  }));
}

export default function Casos() {
  const casos = useLoaderData<typeof loader>();

  return (
    <div className="page-stack">
      <PageIntro title="Casos de estudio">
        {process.env.PORTFOLIO_PREVIEW === "1" && <p className="technical-label">Vista local de revisión</p>}
      </PageIntro>
      {casos.length ? (
        <ul className="project-list" role="list">
          {casos.map(({ titulo, resumen, competencia, proyecto, ruta }) => (
            <li className="project-row case-row" key={ruta}>
              <div className="case-row__title">
                <h2>{titulo}</h2>
                {proyecto && <p>{proyecto}</p>}
              </div>
              <p>{resumen}</p>
              <div className="project-row__aside">
                {competencia && (
                  <dl className="case-row__competence">
                    <dt>Competencia principal</dt><dd>{competencia}</dd>
                  </dl>
                )}
                <TextLink to={ruta} label={`Leer caso «${titulo}»`}>Leer caso</TextLink>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>Por ahora no hay casos de estudio publicados.</p>}
    </div>
  );
}
