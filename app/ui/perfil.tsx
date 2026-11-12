import type { PerfilProfesional } from "../contenido/perfil.server";
import { TextLink } from "./elementos";

export function Formacion({ entradas }: { entradas: PerfilProfesional["formacion"] }) {
  return <ul className="perfil-lista" role="list">
    {entradas.map(({ programa, institucion, periodo }, indice) => (
      <li key={indice}>
        <h3>{programa}</h3>
        {(institucion || periodo) && <p>{[institucion, periodo].filter(Boolean).join(" · ")}</p>}
      </li>
    ))}
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
