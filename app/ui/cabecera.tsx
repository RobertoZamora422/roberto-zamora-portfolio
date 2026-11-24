import { paths } from "../rutas";
import { MarcaRz } from "./marca-rz";
import { EnlaceCv } from "./enlace-cv";

function Navegacion({ cvPdf }: { cvPdf?: string }) {
  return (
    <nav className="editorial-nav" aria-label="Principal">
      <a href={paths.trabajo}>Mi trabajo</a>
      <a href={paths.aportacion}>Cómo aporto</a>
      <a href={paths.sobreMi}>Sobre mí</a>
      <EnlaceCv pdf={cvPdf} abreviar />
      <a href={paths.contacto} className="editorial-nav__cta">Hablemos <span aria-hidden="true">↗</span></a>
    </nav>
  );
}

export function Cabecera({ nombre, cvPdf }: { nombre?: string; cvPdf?: string }) {
  return (
    <header className="editorial-header">
      <div className="editorial-wrap editorial-header__inner">
        <a className="editorial-brand" href={paths.inicio} aria-label={nombre ? `RZ. ${nombre}, volver al inicio` : "RZ. Volver al inicio"}>
          <MarcaRz />
        </a>
        <div className="editorial-header__desktop"><Navegacion cvPdf={cvPdf} /></div>
        <details className="editorial-menu"
          onClick={({ target, currentTarget }) => {
            const enlace = (target as HTMLElement).closest<HTMLAnchorElement>("a");
            if (!enlace) return;
            currentTarget.open = false;
            if (enlace.target === "_blank") currentTarget.querySelector("summary")?.focus();
          }}
          onKeyDown={(evento) => {
            if (evento.key !== "Escape" || !evento.currentTarget.open) return;
            evento.preventDefault();
            evento.currentTarget.open = false;
            evento.currentTarget.querySelector("summary")?.focus();
          }}
        >
          <summary aria-label="Menú principal"><span aria-hidden="true"></span></summary>
          <Navegacion cvPdf={cvPdf} />
        </details>
      </div>
    </header>
  );
}
