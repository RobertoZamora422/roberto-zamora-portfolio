import type { PerfilProfesional } from "../contenido/perfil.server";
import { TextLink } from "./elementos";

export function EnlaceCv({ pdf, className }: { pdf?: string; className?: string }) {
  if (!pdf) return null;
  return (
    <a href={pdf} className={className} target="_blank" rel="noopener"
      aria-label="Ver CV (PDF, abre en una pestaña nueva)">Ver CV</a>
  );
}

export function PerfilesPublicos({ enlaces }: { enlaces: NonNullable<PerfilProfesional["enlaces"]> }) {
  return <ul className="perfil-enlaces" aria-label="Perfiles públicos" role="list">
    {enlaces.map(({ titulo, url }) => <li key={url}><a href={url}>{titulo}</a></li>)}
  </ul>;
}

export function Formacion({ entradas }: { entradas: PerfilProfesional["formacion"] }) {
  return <ul className="perfil-lista" role="list">
    {entradas.map(({ programa, institucion, estado, periodo }, indice) => {
      const detalle = [institucion, estado, periodo].filter(Boolean).join(" · ");
      return <li key={indice}><h3>{programa}</h3>{detalle && <p>{detalle}</p>}</li>;
    })}
  </ul>;
}

export function Trayectoria({ entradas }: { entradas: PerfilProfesional["trayectoria"] }) {
  return <ul className="perfil-lista perfil-trayectoria" role="list">
    {entradas.map(({ titulo, descripcion, evidencias }, indice) => (
      <li key={indice}>
        {titulo && <h3>{titulo}</h3>}
        <p>{descripcion}</p>
        {evidencias.length > 0 && (
          <ul className="perfil-enlaces perfil-enlaces--evidencias" aria-label="Evidencias" role="list">
            {evidencias.map(({ titulo, url }) => <li key={url}><a href={url}>{titulo}</a></li>)}
          </ul>
        )}
      </li>
    ))}
  </ul>;
}

export function CasosPerfil({ casos }: { casos: PerfilProfesional["casos"] }) {
  return <ul className="perfil-enlaces" role="list">
    {casos.map(({ titulo, url }) => <li key={url}><TextLink to={url}>{titulo}</TextLink></li>)}
  </ul>;
}
