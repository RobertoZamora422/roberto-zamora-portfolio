import { useLoaderData } from "react-router";
import { cargarPerfilProfesional } from "../contenido/perfil.server";
import { PageIntro } from "../ui/elementos";
import { CasosPerfil, Formacion, Trayectoria } from "../ui/perfil";

export const meta = () => [{ title: "CV y contacto · Portafolio profesional" }];
export const loader = cargarPerfilProfesional;

export default function Cv() {
  const perfil = useLoaderData<typeof loader>();
  const correo = perfil?.correo;
  const enlaces = perfil?.enlaces ?? [];
  const tieneContacto = Boolean(correo || enlaces.length);
  return (
    <article className="page-stack cv-page">
      {perfil ? (
        <PageIntro title={perfil.nombre} kicker={<p className="technical-label">Currículum</p>}>
          <p className="lead">{perfil.presentacion}</p>
          <p>{perfil.oportunidades}</p>
          <div className="actions cv-acciones">
            <button className="action-link cv-imprimir" type="button" onClick={() => window.print()}>Imprimir CV</button>
          </div>
        </PageIntro>
      ) : <PageIntro title="CV y contacto"><p className="lead">El CV aún no está disponible.</p></PageIntro>}
      {!!perfil?.formacion.length && (
        <section className="perfil-seccion" aria-labelledby="formacion-titulo">
          <h2 id="formacion-titulo">Formación</h2>
          <Formacion entradas={perfil.formacion} />
        </section>
      )}
      {!!perfil?.trayectoria.length && (
        <section className="perfil-seccion" aria-labelledby="trayectoria-titulo">
          <h2 id="trayectoria-titulo">Experiencia en proyectos</h2>
          <div className="perfil-detalle">
            {perfil.casos.length > 0 && <CasosPerfil casos={perfil.casos} />}
            <Trayectoria entradas={perfil.trayectoria} />
          </div>
        </section>
      )}
      <section className={`perfil-seccion cv-contacto${tieneContacto ? "" : " cv-contacto--pendiente"}`}
        id="contacto" tabIndex={-1} aria-labelledby="contacto-titulo">
        <h2 id="contacto-titulo">Contacto</h2>
        {tieneContacto ? (
          <ul className="perfil-enlaces" role="list">
            {correo && <li><a href={`mailto:${encodeURIComponent(correo).replace("%40", "@")}`}>{correo}</a></li>}
            {enlaces.map(({ titulo, url }) => <li key={url}><a href={url}>{titulo}</a></li>)}
          </ul>
        ) : <p>Aún no hay un canal de contacto disponible.</p>}
      </section>
    </article>
  );
}
