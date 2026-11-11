import { Link, useLoaderData } from "react-router";
import { presentacionBase } from "../contenido/publico";
import { cargarContenido } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";

export async function loader() {
  const { perfil, proyectoDestacado, casoDestacado } = await cargarContenido();
  return {
    nombre: perfil?.nombre,
    presentacion: perfil?.presentacion ?? presentacionBase.presentacion,
    propuesta: perfil?.propuesta ?? presentacionBase.propuesta,
    oportunidades: perfil?.oportunidades ?? presentacionBase.oportunidades,
    proyecto: proyectoDestacado && {
      nombre: proyectoDestacado.ficha.nombre,
      estado: proyectoDestacado.ficha.estado,
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
  const { nombre, presentacion, propuesta, oportunidades, proyecto, caso } = useLoaderData<typeof loader>();

  return (
    <div className="editorial-page page-stack">
      <div className={caso ? "home-hero home-hero--featured" : "home-hero"}>
        <PageIntro title={nombre ?? presentacion} kicker={<p className="editorial-kicker">{oportunidades}</p>}>
          {nombre && <p className="editorial-lead">{presentacion}</p>}
          <p className="editorial-line">{propuesta}</p>
          <div className="actions">
            <ActionLink to={caso?.ruta ?? paths.proyectos} primary>
              {caso ? "Leer caso destacado" : "Ver proyectos"}
            </ActionLink>
            <ActionLink to={paths.cv}>Ver CV</ActionLink>
          </div>
        </PageIntro>
        {caso && (
          <section className="panel" aria-labelledby="caso-destacado">
            <p className="editorial-kicker">Caso destacado</p>
            <h2 id="caso-destacado">{caso.titulo}</h2>
            <p>{caso.resumen}</p>
          </section>
        )}
      </div>
      {proyecto && (
        <section className="featured-project" aria-labelledby="proyecto-destacado">
          <h2 className="editorial-heading" id="proyecto-destacado">Proyecto destacado</h2>
          <article className="panel">
            <p className="editorial-meta">{proyecto.estado}</p>
            <h3>{proyecto.nombre}</h3>
            <p>{proyecto.resumen}</p>
            <Link className="editorial-link" to={proyecto.ruta}>Ver el proyecto</Link>
          </article>
        </section>
      )}
    </div>
  );
}
