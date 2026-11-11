import type { Evidencia } from "../contenido/modelo";
import { Arrow } from "./elementos";

type EvidenciaConsultable = Pick<Evidencia, "id" | "titulo" | "tipo" | "afirmacion" | "fuente" | "autoria"> & {
  url: string;
};

function FichaEvidencia({ titulo, tipo, afirmacion, fuente, autoria, url }: EvidenciaConsultable) {
  return (
    <article className="panel evidence-card">
      <div className="evidence-card__title">
        <p className="technical-label">{tipo}</p>
        <h3>{titulo}</h3>
      </div>
      <dl className="evidence-card__details">
        <div><dt>Qué demuestra</dt><dd>{afirmacion}</dd></div>
        <div><dt>Fuente o versión</dt><dd>{fuente}</dd></div>
        <div><dt>Autoría</dt><dd>{autoria}</dd></div>
      </dl>
      <a className="text-link" href={url} aria-label={`Consultar evidencia «${titulo}»`}>
        <span className="text-link__label">Consultar evidencia</span><Arrow />
      </a>
    </article>
  );
}

export function ListaEvidencias({ evidencias }: { evidencias: readonly EvidenciaConsultable[] }) {
  return (
    <ul className="evidence-list" role="list">
      {evidencias.map((evidencia) => <li key={evidencia.id}><FichaEvidencia {...evidencia} /></li>)}
    </ul>
  );
}
