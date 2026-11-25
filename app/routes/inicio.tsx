import { useEffect, useState, type ReactNode } from "react";
import { Link, useLoaderData, useRouteLoaderData, type MetaFunction } from "react-router";
import type { loader as loaderGlobal } from "../root";
import { metadatosPagina } from "../contenido/metadatos";
import { contenido } from "../contenido/registro.server";
import { paths, rutaProyecto, rutaRecursoPublico } from "../rutas";
import { EnlacesProyecto } from "../ui/enlaces-proyecto";
import { EnlaceCv } from "../ui/enlace-cv";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => metadatosPagina({
  titulo: "Roberto Zamora · Software Engineering Student",
  descripcion: loaderData?.descripcion ?? "Portafolio de tecnología, procesos y análisis funcional.",
  ruta: paths.inicio,
});

export function loader() {
  const { perfil, proyectos } = contenido;
  const portada = perfil?.portada;
  const retrato = perfil?.retrato?.revision === "aprobado" ? perfil.retrato : undefined;
  const whatsapp = perfil?.whatsapp?.revision === "aprobado" ? perfil.whatsapp : undefined;
  const tarjetas = proyectos.map(({ slug, nombre, estado, categoria, descripcion, repositorio, aplicacion, visual, pagina }) => {
    const captura = visual === "conceptual" ? undefined : pagina?.capturas?.find(
      ({ revision, archivo }) => revision === "aprobado" && archivo === visual.captura,
    );
    return {
      slug, nombre, meta: `${categoria} · ${estado}`, descripcion, repositorio, aplicacion,
      ruta: pagina ? rutaProyecto(slug) : undefined,
      conceptual: visual === "conceptual",
      captura: captura && { src: rutaRecursoPublico(captura.archivo), alt: captura.alt, ancho: captura.ancho, alto: captura.alto },
    };
  });
  return {
    portada, tarjetas,
    descripcion: portada ? `${portada.estudios} ${portada.introduccion}` : undefined,
    retrato: retrato && { src: rutaRecursoPublico(retrato.archivo), alt: retrato.alt },
    whatsapp: whatsapp?.numero,
  };
}

function Flecha() {
  return <span aria-hidden="true">↗</span>;
}

function BotonCopiar({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <button type="button" className="editorial-contact__copy" aria-label={etiqueta} title={etiqueta} onClick={onClick}>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M5 16a2 2 0 0 1-1-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 1" />
      </svg>
    </button>
  );
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
  const { nombre, meta, descripcion, repositorio, aplicacion, ruta, conceptual, captura } = tarjeta;
  return (
    <article className="editorial-project">
      {conceptual && (
        <div className="editorial-art" aria-hidden="true">
          <div className="editorial-art__grid"><span /><span /><span /><span /></div>
        </div>
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
          <EnlacesProyecto nombre={nombre} repositorio={repositorio} aplicacion={aplicacion} soloRepositorio={!ruta} />
        </div>
      </div>
    </article>
  );
}

export default function Inicio() {
  const { portada, tarjetas, retrato, whatsapp } = useLoaderData<typeof loader>();
  const { nombre, cvPdf, correo, mailto } = useRouteLoaderData<typeof loaderGlobal>("root") ?? {};
  const [copiaActiva, setCopiaActiva] = useState(false);
  const [estadoCopia, setEstadoCopia] = useState("");
  useEffect(() => { setCopiaActiva(true); }, []);

  async function copiarContacto(dato: string, confirmacion: string) {
    setEstadoCopia("");
    try {
      await navigator.clipboard.writeText(dato);
      setEstadoCopia(confirmacion);
    } catch {
      setEstadoCopia(`No se pudo copiar automáticamente. Copia este dato: ${dato}`);
    }
  }

  const titular = portada?.titular;
  const asunto = encodeURIComponent(`Oportunidad profesional${nombre ? ` - ${nombre}` : ""}`);
  return (
    <>
      <section className="editorial-wrap editorial-hero" id="inicio" tabIndex={-1} aria-labelledby="titulo-inicio">
        <div className="editorial-hero__copy">
          <p className="editorial-eyebrow">{portada ? `${nombre} · ${portada.area}` : "Portafolio profesional"}</p>
          <h1 id="titulo-inicio">
            {titular ? <>{titular[0]}<br /> {titular[1]} <em>{titular[2]}</em></> : nombre ?? "Portafolio profesional"}
          </h1>
          {portada && (
            <>
              <p className="editorial-hero__intro"><strong>{portada.estudios}</strong> {portada.introduccion}</p>
              {portada.enfoque.map((parrafo) => <p className="editorial-hero__detail" key={parrafo}>{parrafo}</p>)}
            </>
          )}
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
            <EnlaceCv pdf={cvPdf} className="editorial-simple-link" />
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
        <div className="editorial-work">
          {tarjetas.map((tarjeta) => <TarjetaProyecto tarjeta={tarjeta} key={tarjeta.slug} />)}
        </div>
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
            <div>{portada?.trayectoria.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}</div>
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
          <EncabezadoSeccion id="titulo-contacto" indice="04 — Contacto" titulo="Trabajemos juntos.">
            Si consideras que mi perfil puede encajar en tu organización, me gustaría conversar.
          </EncabezadoSeccion>
          <div className="editorial-actions editorial-contact__actions">
            {whatsapp && (
              <div className="editorial-contact__channel">
                <a className="editorial-button editorial-button--primary" href={`https://wa.me/${whatsapp.slice(1)}`}
                  target="_blank" rel="noopener noreferrer">WhatsApp <Flecha /></a>
                {copiaActiva && <BotonCopiar etiqueta="Copiar número de WhatsApp" onClick={() => copiarContacto(whatsapp, "Número copiado")} />}
              </div>
            )}
            {correo && (
              <div className="editorial-contact__channel">
                <a className={whatsapp ? "editorial-button" : "editorial-button editorial-button--primary"}
                  href={`${mailto}?subject=${asunto}`}>Correo <Flecha /></a>
                {copiaActiva && <BotonCopiar etiqueta="Copiar correo" onClick={() => copiarContacto(correo, "Correo copiado")} />}
              </div>
            )}
            <EnlaceCv pdf={cvPdf} className="editorial-button" />
          </div>
          <p className="editorial-contact__status" role="status" aria-atomic="true">{estadoCopia}</p>
        </div>
      </section>
    </>
  );
}
