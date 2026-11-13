import { useLoaderData, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { cargarPerfilProfesional } from "../contenido/perfil.server";
import { paths } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";
import { CasosPerfil, EnlaceCv, Formacion, PerfilesPublicos, Trayectoria } from "../ui/perfil";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => metadatosPagina({
  titulo: `Sobre mí · ${loaderData?.nombre ?? "Portafolio profesional"}`,
  descripcion: "Enfoque profesional en tecnología, procesos y análisis funcional, formación y evidencias de trabajo.",
  ruta: paths.perfil,
});
export const loader = cargarPerfilProfesional;

export default function Perfil() {
  const perfil = useLoaderData<typeof loader>();
  if (!perfil) return <PageIntro title="Sobre mí"><p className="lead">El perfil profesional aún no está disponible.</p></PageIntro>;

  return (
    <article className="page-stack perfil-page">
      <PageIntro title="Sobre mí" kicker={<p className="technical-label">{perfil.nombre}</p>}>
        {perfil.sobreMi?.length ? (
          <div className="perfil-detalle">
            {perfil.sobreMi.map((parrafo, indice) => <p key={indice}>{parrafo}</p>)}
          </div>
        ) : <p className="lead">{perfil.presentacion}</p>}
        <div className="actions">
          <EnlaceCv pdf={perfil.cvPdf} className="action-link" />
          <ActionLink to={paths.contacto}>Ir a contacto</ActionLink>
        </div>
        {!!perfil.enlaces?.length && <PerfilesPublicos enlaces={perfil.enlaces} />}
      </PageIntro>
      {perfil.formacion.length > 0 && (
        <section className="perfil-seccion" aria-labelledby="formacion-titulo">
          <h2 id="formacion-titulo">Formación</h2>
          <Formacion entradas={perfil.formacion} />
        </section>
      )}
      {perfil.trayectoria.length > 0 && (
        <section className="perfil-seccion" aria-labelledby="competencias-titulo">
          <h2 id="competencias-titulo">Competencias en práctica</h2>
          <div className="perfil-detalle">
            <Trayectoria entradas={perfil.trayectoria} />
            {perfil.casos.length > 0 && <CasosPerfil casos={perfil.casos} />}
          </div>
        </section>
      )}
      {!!perfil.intereses?.length && (
        <section className="perfil-seccion" aria-labelledby="intereses-profesionales">
          <h2 id="intereses-profesionales">Intereses profesionales</h2>
          <ul className="perfil-lista" role="list">
            {perfil.intereses.map(({ titulo, descripcion }) => (
              <li key={titulo}><h3>{titulo}</h3><p>{descripcion}</p></li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
