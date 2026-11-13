import { useLoaderData, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { prepararPerfilProfesional } from "../contenido/perfil.server";
import { presentacionBase } from "../contenido/publico";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
import { ActionLink, Arrow, TextLink } from "../ui/elementos";
import { EnlaceCv, Trayectoria } from "../ui/perfil";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => metadatosPagina({
  titulo: `${loaderData?.nombre ?? "Portafolio profesional"} · RZ.`,
  descripcion: loaderData?.descripcion ?? "Portafolio de tecnología, procesos y análisis funcional.",
  ruta: paths.inicio,
});

export async function loader() {
  const contenido = await cargarContenido();
  const { perfil, proyectoDestacado, casoDestacado } = contenido;
  const profesional = prepararPerfilProfesional(contenido);
  const retrato = perfil?.retrato?.revision === "aprobado" ? perfil.retrato : undefined;
  return {
    nombre: perfil?.nombre,
    presentacion: perfil?.presentacion ?? presentacionBase.presentacion,
    propuesta: perfil?.propuesta ?? presentacionBase.propuesta,
    oportunidades: perfil ? undefined : presentacionBase.oportunidades,
    descripcion: profesional?.descripcionInicio,
    competencias: profesional?.trayectoria,
    cvPdf: profesional?.cvPdf,
    retrato: retrato && { src: urlRecursoLocal(retrato.archivo), alt: retrato.alt },
    proyecto: proyectoDestacado && {
      nombre: proyectoDestacado.ficha.nombre,
      resumen: proyectoDestacado.pagina.destacado,
      ruta: rutaProyecto(proyectoDestacado.slug),
    },
    caso: casoDestacado && {
      ruta: rutaCaso(casoDestacado.slug),
      evidencias: casoDestacado.evidencias.length,
    },
  };
}

export default function Inicio() {
  const { nombre, presentacion, propuesta, oportunidades, descripcion, competencias, cvPdf, proyecto, caso, retrato } =
    useLoaderData<typeof loader>();

  return (
    <div className="home-page">
      <div className={retrato ? "home-hero home-hero--portrait" : "home-hero"}>
        <header className="home-title">
          <h1>{nombre ?? presentacion}</h1>
          <p className="home-role">{nombre ? presentacion : oportunidades}</p>
        </header>
        <div className="home-intro">
          <p className="home-motto">{propuesta}</p>
          {descripcion && <p className="lead">{descripcion}</p>}
          <div className="actions">
            {caso ? <ActionLink to={caso.ruta} primary>Leer el caso de estudio <Arrow /></ActionLink>
              : <ActionLink to={proyecto?.ruta ?? paths.proyectos} primary>Ver {proyecto?.nombre ?? "proyectos"} <Arrow /></ActionLink>}
            <EnlaceCv pdf={cvPdf} className="action-link" />
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
            <div className="featured-project__links">
              <TextLink to={proyecto.ruta}>Ver el proyecto</TextLink>
              {!!caso?.evidencias && <TextLink to={`${caso.ruta}#evidencias`}>Consultar evidencias</TextLink>}
            </div>
          </div>
        </section>
      )}
      {!!competencias?.length && (
        <section className="home-competencias" aria-labelledby="competencias-aplicadas">
          <h2 id="competencias-aplicadas">Competencias aplicadas</h2>
          <Trayectoria entradas={competencias} />
        </section>
      )}
    </div>
  );
}
