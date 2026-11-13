import { useLoaderData, type MetaFunction } from "react-router";
import { metadatosPagina } from "../contenido/metadatos";
import { cargarPerfilProfesional } from "../contenido/perfil.server";
import { paths } from "../rutas";
import { PageIntro } from "../ui/elementos";
import { CasosPerfil, EnlaceCv, PerfilesPublicos } from "../ui/perfil";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => metadatosPagina({
  titulo: `CV y contacto · ${loaderData?.nombre ?? "Portafolio profesional"}`,
  descripcion: loaderData?.cvPdf
    ? "Contacto profesional, perfiles públicos y acceso al currículum oficial en PDF."
    : "Contacto profesional y perfiles públicos.",
  ruta: paths.cv,
});

export async function loader() {
  const perfil = await cargarPerfilProfesional();
  if (!perfil) return null;
  const { nombre, presentacion, descripcionInicio, cvPdf, correo, enlaces, casos } = perfil;
  return { nombre, presentacion, descripcionInicio, cvPdf, correo, enlaces, casos };
}

export default function Cv() {
  const perfil = useLoaderData<typeof loader>();
  return (
    <article className="page-stack cv-page">
      <PageIntro title={perfil?.nombre ?? "CV y contacto"} kicker={<p className="technical-label">Currículum</p>}>
        {perfil && <p className="lead">{perfil.presentacion}</p>}
        {perfil?.cvPdf
          ? <EnlaceCv pdf={perfil.cvPdf} className="action-link" />
          : <p>El CV en PDF aún no está disponible.</p>}
      </PageIntro>
      <section className="perfil-seccion" id="contacto" tabIndex={-1} aria-labelledby="contacto-titulo">
        <h2 id="contacto-titulo">Contacto</h2>
        <div className="perfil-detalle">
          {perfil?.correo && (
            <p><a className="text-link" href={`mailto:${encodeURIComponent(perfil.correo).replace("%40", "@")}`}>{perfil.correo}</a></p>
          )}
          {!!perfil?.enlaces?.length && <PerfilesPublicos enlaces={perfil.enlaces} />}
          {!perfil?.correo && !perfil?.enlaces?.length && <p>Aún no hay un canal de contacto disponible.</p>}
        </div>
      </section>
      {perfil?.descripcionInicio && (
        <section className="perfil-seccion" aria-labelledby="trabajo-verificable">
          <h2 id="trabajo-verificable">Trabajo verificable</h2>
          <div className="perfil-detalle">
            <p>{perfil.descripcionInicio}</p>
            {perfil.casos.length > 0 && <CasosPerfil casos={perfil.casos} />}
          </div>
        </section>
      )}
    </article>
  );
}
