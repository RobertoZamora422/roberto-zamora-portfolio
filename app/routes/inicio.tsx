import type { ReactNode } from "react";
import { Link, useLoaderData, type MetaFunction } from "react-router";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/newsreader/standard.css";
import "@fontsource-variable/newsreader/standard-italic.css";
import { metadatosPagina } from "../contenido/metadatos";
import { presentacionBase } from "../contenido/publico";
import { cargarContenido, urlRecursoLocal } from "../contenido/registro.server";
import { paths, rutaCaso, rutaProyecto } from "../rutas";
import { MarcaRz } from "../ui/marca-rz";
import { EnlaceCv } from "../ui/perfil";
import "../inicio.css";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  ...metadatosPagina({
    titulo: loaderData?.portada
      ? `${loaderData.nombre} · ${loaderData.portada.titular.join(" ")}`
      : `${loaderData?.nombre ?? "Portafolio profesional"} · RZ.`,
    descripcion: loaderData?.descripcion ?? "Portafolio de tecnología, procesos y análisis funcional.",
    ruta: paths.inicio,
  }),
  { name: "theme-color", content: "#f7f6f1" },
];

export async function loader() {
  const { perfil, proyectos, proyectoDestacado, casoDestacado } = await cargarContenido();
  const portada = perfil?.portada;
  const retrato = perfil?.retrato?.revision === "aprobado" ? perfil.retrato : undefined;
  const cv = perfil?.cvPdf?.revision === "aprobado" ? perfil.cvPdf : undefined;
  const whatsapp = perfil?.whatsapp?.revision === "aprobado" ? perfil.whatsapp : undefined;
  const tarjetas = proyectos.flatMap(({ slug, ficha, pagina, portada }) => {
    if (!portada) return [];
    const { categoria, descripcion, repositorio, visual } = portada;
    const captura = visual === "conceptual" ? undefined : pagina?.capturas?.find(
      ({ revision, archivo }) => revision === "aprobado" && archivo === visual.captura,
    );
    return [{
      slug, nombre: ficha.nombre, meta: `${categoria} · ${ficha.estado}`, descripcion, repositorio,
      ruta: pagina ? rutaProyecto(slug) : undefined,
      conceptual: visual === "conceptual",
      captura: captura && { src: urlRecursoLocal(captura.archivo), alt: captura.alt, ancho: captura.ancho, alto: captura.alto },
    }];
  });
  return {
    portada, tarjetas,
    nombre: perfil?.nombre,
    presentacion: perfil?.presentacion ?? presentacionBase.presentacion,
    propuesta: perfil?.propuesta ?? presentacionBase.propuesta,
    descripcion: portada ? `${portada.estudios} ${portada.introduccion}` : perfil?.descripcionInicio,
    cvPdf: cv && urlRecursoLocal(cv.archivo),
    retrato: retrato && { src: urlRecursoLocal(retrato.archivo), alt: retrato.alt },
    correo: perfil?.correo,
    whatsapp: whatsapp && `https://wa.me/${whatsapp.numero.slice(1)}`,
    enlaces: perfil?.enlaces,
    sobreMi: perfil?.sobreMi,
    proyecto: proyectoDestacado && {
      nombre: proyectoDestacado.ficha.nombre,
      descripcion: proyectoDestacado.pagina.destacado,
      ruta: rutaProyecto(proyectoDestacado.slug),
    },
    caso: casoDestacado && {
      ruta: rutaCaso(casoDestacado.slug),
      prueba: casoDestacado.portada,
    },
  };
}

function Flecha() {
  return <span aria-hidden="true">↗</span>;
}

function EncabezadoSeccion({ id, indice, titulo, children }: {
  id: string;
  indice: string;
  titulo: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="editorial-section__header">
      <p className="editorial-section__index">{indice}</p>
      <div>
        <h2 id={id}>{titulo}</h2>
        {children && <p>{children}</p>}
      </div>
    </header>
  );
}

function TarjetaProyecto({ tarjeta }: { tarjeta: Awaited<ReturnType<typeof loader>>["tarjetas"][number] }) {
  const { nombre, meta, descripcion, repositorio, ruta, conceptual, captura } = tarjeta;
  return (
    <article className="editorial-project">
      {conceptual && (
        <figure className="editorial-art">
          <div className="editorial-art__grid" aria-hidden="true"><span /><span /><span /><span /></div>
          <figcaption>Recurso conceptual</figcaption>
        </figure>
      )}
      {captura && (
        <div className="editorial-project__image">
          <img src={captura.src} alt={captura.alt} width={captura.ancho} height={captura.alto} loading="lazy" />
        </div>
      )}
      <div className="editorial-project__copy">
        <p className="editorial-project__meta">{meta}</p>
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <div className="editorial-project__links">
          {ruta && <Link to={ruta}>Explorar el proyecto <Flecha /></Link>}
          <a href={repositorio} target="_blank" rel="noopener noreferrer"
            aria-label={`${ruta ? "Repositorio" : "Consultar repositorio"} de ${nombre} en GitHub`}>
            {ruta ? "Repositorio" : "Consultar repositorio"} <Flecha />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Inicio() {
  const { portada, tarjetas, nombre, presentacion, propuesta, cvPdf, retrato,
    correo, whatsapp, enlaces, sobreMi, proyecto, caso } = useLoaderData<typeof loader>();
  const titular = portada?.titular;
  const mailto = correo && `mailto:${encodeURIComponent(correo).replace("%40", "@")}`;
  const asunto = encodeURIComponent(`Oportunidad profesional${nombre ? ` - ${nombre}` : ""}`);
  const perfiles = [...(enlaces ?? [])].sort((a, b) => Number(b.titulo === "LinkedIn") - Number(a.titulo === "LinkedIn"));
  return (
    <>
      <section className="editorial-wrap editorial-hero" id="inicio" tabIndex={-1} aria-labelledby="titulo-inicio">
        <div className="editorial-hero__copy">
          <p className="editorial-eyebrow">{portada ? `${nombre} · ${portada.area}` : presentacion}</p>
          <h1 id="titulo-inicio">
            {titular ? <>{titular[0]}<br /> {titular[1]} <em>{titular[2]}</em></> : nombre ?? presentacion}
          </h1>
          {portada ? (
            <>
              <p className="editorial-hero__intro"><strong>{portada.estudios}</strong> {portada.introduccion}</p>
              <p className="editorial-hero__detail">{portada.enfoque}</p>
            </>
          ) : <p className="editorial-hero__detail">{propuesta}</p>}
        </div>
        <div className="editorial-hero__identity">
          {retrato && (
            <figure className="editorial-portrait">
              <div className="editorial-portrait__image"><img src={retrato.src} alt={retrato.alt} /></div>
              <figcaption>
                <strong>{portada?.nombreCompleto ?? nombre}</strong>
                {portada && <span>{portada.ubicacion}</span>}
              </figcaption>
            </figure>
          )}
          <div className="editorial-actions editorial-hero__actions">
            <a className="editorial-button editorial-button--primary" href="#trabajo">Explorar mi trabajo <Flecha /></a>
            <EnlaceCv pdf={cvPdf} className="editorial-simple-link" flecha />
            <a className="editorial-simple-link" href="#contacto">Contactar <Flecha /></a>
          </div>
        </div>
      </section>
      {portada && (
        <ul className="editorial-wrap editorial-axes" aria-label="Dimensiones del perfil profesional" role="list">
          {portada.ejes.map((eje, indice) => (
            <li key={eje}><span aria-hidden="true">0{indice + 1} /</span><strong>{eje}</strong></li>
          ))}
        </ul>
      )}

      <section className="editorial-wrap editorial-section" id="trabajo" tabIndex={-1} aria-labelledby="titulo-trabajo">
        <EncabezadoSeccion id="titulo-trabajo" indice="01 — Mi trabajo" titulo="Ideas que se convierten en soluciones.">
          Una selección de proyectos donde aplico análisis de necesidades, criterios de diseño y conocimientos tecnológicos.
        </EncabezadoSeccion>
        {tarjetas.length ? (
          <div className="editorial-work">
            {tarjetas.map((tarjeta) => <TarjetaProyecto tarjeta={tarjeta} key={tarjeta.slug} />)}
          </div>
        ) : proyecto && (
          <article className="editorial-project editorial-project__copy">
            <h3>{proyecto.nombre}</h3>
            <p>{proyecto.descripcion}</p>
            <div className="editorial-project__links"><Link to={proyecto.ruta}>Explorar el proyecto <Flecha /></Link></div>
          </article>
        )}
        {caso?.prueba ? (
          <div className="editorial-proof" role="group" aria-label="Evidencia técnica">
            {caso.prueba.indicadores.map(({ valor, descripcion }) => (
              <div className="editorial-proof__item" key={valor}><strong>{valor}</strong><span>{descripcion}</span></div>
            ))}
            <p className="editorial-proof__note">
              {caso.prueba.alcance}{" "}
              <Link to={`${caso.ruta}#evidencias`}>Consultar evidencias <Flecha /></Link>
            </p>
          </div>
        ) : caso && <Link to={caso.ruta}>Leer el caso de estudio <Flecha /></Link>}
      </section>

      <section className="editorial-wrap editorial-section" id="aportacion" tabIndex={-1} aria-labelledby="titulo-aportacion">
        <EncabezadoSeccion id="titulo-aportacion" indice="02 — Cómo aporto" titulo="Una perspectiva que conecta diferentes disciplinas.">
          {portada && "Mi experiencia empresarial complementa mi formación tecnológica. Me ayuda a entender el contexto, organizar decisiones y participar en soluciones que tienen sentido para quienes las utilizan."}
        </EncabezadoSeccion>
        {portada && (
          <div className="editorial-abilities">
            {portada.capacidades.map(({ titulo, descripcion }, indice) => (
              <article key={titulo}>
                <span aria-hidden="true">0{indice + 1}</span>
                <div><h3>{titulo}</h3><p>{descripcion}</p></div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="editorial-about" id="sobre-mi" tabIndex={-1} aria-labelledby="titulo-sobre-mi">
        <div className="editorial-wrap">
          <EncabezadoSeccion id="titulo-sobre-mi" indice="03 — Sobre mí" titulo="Entender antes de construir.">
            {portada && "Me motiva comprender por qué una solución importa y cómo puede contribuir al trabajo de otras personas."}
          </EncabezadoSeccion>
          <div className="editorial-about__copy">
            <div>{(portada?.trayectoria ?? sobreMi)?.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}</div>
            {portada && (
              <dl className="editorial-facts">
                {portada.datos.map(({ titulo, descripcion }) => (
                  <div key={titulo}><dt>{titulo}</dt><dd>{descripcion}</dd></div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="editorial-contact" id="contacto" tabIndex={-1} aria-labelledby="titulo-contacto">
        <div className="editorial-wrap">
          <EncabezadoSeccion id="titulo-contacto" indice="04 — Contacto" titulo={<>Trabajemos<br /> juntos.</>}>
            Si consideras que mi perfil puede encajar en tu organización, me gustaría conversar.
          </EncabezadoSeccion>
          <div className="editorial-actions editorial-contact__actions">
            {mailto && <a className="editorial-button editorial-button--primary" href={`${mailto}?subject=${asunto}`}>Escribirme por correo <Flecha /></a>}
            {whatsapp && <a className="editorial-button" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <Flecha /></a>}
            <EnlaceCv pdf={cvPdf} className="editorial-button" flecha />
          </div>
          <footer className="editorial-footer">
            <a className="editorial-brand" href="#inicio" aria-label="RZ. Volver al inicio"><MarcaRz /></a>
            {nombre && <span>{nombre}{portada && " · Ecuador"}</span>}
            <div className="editorial-footer__links">
              {perfiles.map(({ titulo, url }) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer">{titulo} <Flecha /></a>
              ))}
              {mailto && <a href={mailto}>Correo <Flecha /></a>}
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
