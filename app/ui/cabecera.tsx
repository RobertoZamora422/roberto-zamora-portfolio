import { Link, NavLink, useLocation } from "react-router";
import { paths } from "../rutas";

function QuickLinks({ variant }: { variant: "wide" | "narrow" }) {
  const { pathname, hash } = useLocation();
  const onCv = pathname === "/cv" || pathname === paths.cv;
  const onContact = onCv && hash === "#contacto";

  return (
    <nav className={`quick-links quick-links--${variant}`} aria-label="CV y contacto">
      <Link to={paths.cv} aria-current={onCv && !onContact ? "page" : undefined}>CV</Link>
      <Link to={paths.contacto} aria-current={onContact ? "location" : undefined}>Contacto</Link>
    </nav>
  );
}

export function SiteHeader({ nombre }: { nombre?: string }) {
  return (
    <header className="site-header">
      <NavLink to={paths.inicio} className="site-brand" end>
        <span className="site-brand__name">{nombre ?? "Portafolio"}</span>
        <span className="site-brand__role">Ingeniería en Software</span>
      </NavLink>
      <QuickLinks variant="narrow" />
      <nav className="site-nav" aria-label="Principal">
        <NavLink to={paths.proyectos}>Proyectos</NavLink>
        <NavLink to={paths.casos}>Casos de estudio</NavLink>
        <NavLink to={paths.perfil}>Sobre mí</NavLink>
      </nav>
      <QuickLinks variant="wide" />
    </header>
  );
}
