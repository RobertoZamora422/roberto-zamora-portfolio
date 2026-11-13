import { Link, NavLink } from "react-router";
import { paths, rutaProyecto } from "../rutas";
import { EnlaceCv } from "./perfil";

export function SiteHeader({ nombre, cvPdf, proyectoUnico }: {
  nombre?: string;
  cvPdf?: string;
  proyectoUnico?: string;
}) {
  return (
    <header className={cvPdf ? "site-header site-header--cv" : "site-header"}>
      <NavLink to={paths.inicio} className="site-brand" end aria-label={nombre ? `RZ. ${nombre}. Volver a Inicio` : "RZ. Volver a Inicio"}>
        RZ<span>.</span>
      </NavLink>
      <nav className="site-nav" aria-label="Principal">
        {proyectoUnico ? (
          <NavLink to={rutaProyecto(proyectoUnico)}>Proyecto</NavLink>
        ) : (
          <>
            <NavLink to={paths.proyectos}>Proyectos</NavLink>
            <NavLink to={paths.casos}>Casos de estudio</NavLink>
          </>
        )}
        <NavLink to={paths.perfil}>Sobre mí</NavLink>
      </nav>
      <div className="header-actions">
        <EnlaceCv pdf={cvPdf} />
        <Link to={paths.contacto} className="header-contact">Contacto</Link>
      </div>
    </header>
  );
}
