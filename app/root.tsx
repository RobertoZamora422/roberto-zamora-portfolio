import { useEffect, useRef, type ReactNode } from "react";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import "@fontsource/archivo-black/latin-400.css";
import "@fontsource-variable/geist";
import { SiteHeader } from "./ui/cabecera";
import { cargarContenido } from "./contenido/registro.server";
import { paths } from "./rutas";
import { NoEncontrada } from "./routes/no-encontrada";
import { PageIntro } from "./ui/elementos";
import "./styles.css";

export const meta = () => [{ title: "Portafolio profesional" }];

export async function loader() {
  const { perfil } = await cargarContenido();
  return { nombre: perfil?.nombre };
}

export function Layout({ children }: { children: ReactNode }) {
  const { key, hash, pathname } = useLocation();
  const lastKey = useRef(key);
  const main = useRef<HTMLElement>(null);
  const datos = useRouteLoaderData<typeof loader>("root");
  const staticError = pathname.replace(/\/$/, "") === "/404";
  const contactoActivo = pathname.replace(/\/$/, "") === "/cv" && hash === "#contacto";

  useEffect(() => {
    if (key === lastKey.current) return;
    lastKey.current = key;
    const anchor = hash === "#contacto" ? document.getElementById("contacto") : null;
    (anchor ?? main.current)?.focus({ preventScroll: true });
  }, [key, hash]);

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {process.env.PORTFOLIO_PREVIEW === "1" && !staticError && <meta name="robots" content="noindex" />}
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <div className="site-frame">
          <SiteHeader nombre={datos?.nombre} />
          <main className="main" id="contenido" ref={main} tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer">
            <Link to={paths.contacto} aria-current={contactoActivo ? "location" : undefined}>Contacto</Link>
          </footer>
        </div>
        {!staticError && (
          <>
            <ScrollRestoration />
            <Scripts />
          </>
        )}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NoEncontrada />;
  return <PageIntro title="No se pudo cargar esta página" />;
}
