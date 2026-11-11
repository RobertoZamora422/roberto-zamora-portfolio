import { NavLink } from "react-router";
import { paths } from "../rutas";

function CvLink({ variant }: { variant: "wide" | "narrow" }) {
  return (
    <NavLink to={paths.cv} className={`header-contact header-contact--${variant}`}>CV y contacto</NavLink>
  );
}

export function SiteHeader({ nombre }: { nombre?: string }) {
  return (
    <header className="site-header">
      <NavLink to={paths.inicio} className="site-brand" end aria-label={nombre ? `RZ. ${nombre}. Volver a Inicio` : "RZ. Volver a Inicio"}>
        RZ<span>.</span>
      </NavLink>
      <CvLink variant="narrow" />
      <nav className="site-nav" aria-label="Principal">
        <NavLink to={paths.inicio} end>Inicio</NavLink>
        <NavLink to={paths.proyectos}>Proyectos</NavLink>
        <NavLink to={paths.casos}>Casos de estudio</NavLink>
        <NavLink to={paths.perfil}>Sobre mí</NavLink>
      </nav>
      <CvLink variant="wide" />
    </header>
  );
}
