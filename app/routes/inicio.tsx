import { useLoaderData } from "react-router";
import { presentacionBase } from "../contenido/publico";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
import { ActionLink, Arrow, TextLink } from "../ui/elementos";

export async function loader() {
  const { perfil, proyectoDestacado, casoDestacado } = await cargarContenido();
  const retrato = perfil?.retrato?.revision === "aprobado" ? perfil.retrato : undefined;
  return {
    nombre: perfil?.nombre,
    presentacion: perfil?.presentacion ?? presentacionBase.presentacion,
    propuesta: perfil?.propuesta ?? presentacionBase.propuesta,
    oportunidades: perfil?.oportunidades ?? presentacionBase.oportunidades,
    intereses: perfil?.intereses,
    retrato: retrato && { src: urlRecursoLocal(retrato.archivo), alt: retrato.alt },
    proyecto: proyectoDestacado && {
      nombre: proyectoDestacado.ficha.nombre,
      resumen: proyectoDestacado.pagina.destacado,
      ruta: rutaProyecto(proyectoDestacado.slug),
    },
    caso: casoDestacado && {
      titulo: casoDestacado.titulo,
      resumen: casoDestacado.resumen,
      ruta: rutaCaso(casoDestacado.slug),
    },
  };
}

export default function Inicio() {
  const { nombre, presentacion, propuesta, oportunidades, proyecto, caso, intereses, retrato } =
    useLoaderData<typeof loader>();

  return (
    <div className="home-page">
      <div className={retrato ? "home-hero home-hero--portrait" : "home-hero"}>
        <header className="home-title">
          <h1>{nombre ?? presentacion}</h1>
          <p className="home-role">{nombre ? presentacion : oportunidades}</p>
        </header>
        <div className="home-intro">
          <p className="lead">{propuesta}{nombre && ` ${oportunidades}`}</p>
          <div className="actions">
            <ActionLink to={paths.proyectos} primary>Ver proyectos <Arrow /></ActionLink>
            <ActionLink to={paths.cv}>Ver mi CV</ActionLink>
          </div>
        </div>
        {retrato && (
          <div className="portrait-frame">
            <div className="portrait">
              <img src={retrato.src} alt={retrato.alt} />
            </div>
          </div>
        )}
      </div>
      {proyecto && (
        <section className="featured-project" aria-labelledby="proyecto-destacado">
          <div className="featured-project__title">
            <h2 id="proyecto-destacado">Proyecto destacado</h2>
            <h3>{proyecto.nombre}</h3>
          </div>
          <div className="featured-project__detail">
            <p>{proyecto.resumen}</p>
            <TextLink to={proyecto.ruta} label={`Ver ficha de ${proyecto.nombre}`}>Ver ficha</TextLink>
          </div>
        </section>
      )}
      {!!intereses?.length && (
        <section className="home-interests" aria-labelledby="areas-de-interes">
          <h2 id="areas-de-interes">Áreas de interés</h2>
          <ul className="interest-list" role="list">
            {intereses.map(({ titulo, descripcion }) => (
              <li key={titulo}><h3>{titulo}</h3><p>{descripcion}</p></li>
            ))}
          </ul>
        </section>
      )}
      {caso && (
        <section className="home-case" aria-labelledby="caso-destacado">
          <h2 id="caso-destacado">Caso destacado</h2>
          <h3>{caso.titulo}</h3>
          <p>{caso.resumen}</p>
          <TextLink to={caso.ruta}>Leer caso destacado</TextLink>
        </section>
      )}
    </div>
  );
}
