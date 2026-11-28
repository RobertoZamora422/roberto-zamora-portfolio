import { useEffect, useRef, type ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useRouteLoaderData } from "react-router";
import "@fontsource/archivo-black/latin-400.css";
import { Cabecera } from "./ui/cabecera";
import { MarcaRz } from "./ui/marca-rz";
import { contenido } from "./contenido/registro.server";
import { favicon } from "./contenido/publicacion";
import { paths, rutaRecursoPublico } from "./rutas";
import "./inicio.css";
import "./styles.css";

export function loader() {
  const { perfil } = contenido;
  return {
    nombre: perfil?.nombre,
    cvPdf: perfil?.cvPdf?.revision === "aprobado" ? rutaRecursoPublico(perfil.cvPdf.archivo) : undefined,
    correo: perfil?.correo,
    mailto: perfil?.correo && `mailto:${encodeURIComponent(perfil.correo).replace("%40", "@")}`,
    enlaces: perfil?.enlaces,
  };
}

export function Layout({ children }: { children: ReactNode }) {
  const { key, hash, pathname } = useLocation();
  const lastKey = useRef(key);
  const main = useRef<HTMLElement>(null);
  const datos = useRouteLoaderData<typeof loader>("root");

  useEffect(() => {
    if (key === lastKey.current) return;
    lastKey.current = key;
    const destino = hash ? document.getElementById(hash.slice(1)) : null;
    (destino ?? main.current)?.focus({ preventScroll: true });
  }, [key, hash]);

  return (
    <html lang="es" className="tema-editorial">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f7f6f1" />
        <link rel="icon" href={favicon.ruta}
          sizes={favicon.tamanos} type="image/vnd.microsoft.icon" />
        {process.env.PORTFOLIO_INDEXAR !== "1" && <meta name="robots" content="noindex" />}
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <div className="marco-editorial">
          <Cabecera nombre={datos?.nombre} cvPdf={datos?.cvPdf} />
          <main className={pathname === paths.inicio ? undefined : "editorial-wrap interior"} id="contenido" ref={main} tabIndex={-1}>
            {children}
          </main>
          <footer className="pie-global">
            <div className="editorial-wrap editorial-footer">
              <a className="editorial-brand" href="/" aria-label="RZ. Volver al inicio"><MarcaRz /></a>
              <div className="editorial-footer__links">
                {datos?.enlaces?.map(({ titulo, url }) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">{titulo} <span aria-hidden="true">↗</span></a>
                ))}
                {datos?.mailto && <a href={datos.mailto}>Correo <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
