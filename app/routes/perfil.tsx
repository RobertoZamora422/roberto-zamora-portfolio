import { useLoaderData } from "react-router";
import { cargarPerfilProfesional } from "../contenido/perfil.server";
import { paths } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";
import { CasosPerfil, Formacion, Trayectoria } from "../ui/perfil";

export const meta = () => [{ title: "Sobre mí · Portafolio profesional" }];
export const loader = cargarPerfilProfesional;

export default function Perfil() {
  const perfil = useLoaderData<typeof loader>();
  if (!perfil) return <PageIntro title="Sobre mí"><p className="lead">El perfil profesional aún no está disponible.</p></PageIntro>;

  return (
    <article className="page-stack perfil-page">
      <PageIntro title="Sobre mí" kicker={<p className="technical-label">{perfil.nombre}</p>}>
        <p className="lead">{perfil.presentacion}. {perfil.oportunidades}</p>
        <div className="actions"><ActionLink to={paths.cv}>Ver mi CV</ActionLink></div>
      </PageIntro>
      {perfil.formacion.length > 0 && (
        <section className="perfil-seccion" aria-labelledby="formacion-titulo">
          <h2 id="formacion-titulo">Formación</h2>
          <Formacion entradas={perfil.formacion} />
        </section>
      )}
      {!!perfil.intereses?.length && (
        <section className="perfil-seccion" aria-labelledby="intereses-titulo">
          <h2 id="intereses-titulo">Intereses profesionales</h2>
          <ul className="interest-list" role="list">
            {perfil.intereses.map(({ titulo, descripcion }) => <li key={titulo}><h3>{titulo}</h3><p>{descripcion}</p></li>)}
          </ul>
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
    </article>
  );
}
