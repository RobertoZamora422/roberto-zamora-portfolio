import { PageIntro } from "../ui/elementos";

export const meta = () => [{ title: "CV y contacto · Portafolio profesional" }];

export default function Cv() {
  return (
    <div className="page-stack">
      <PageIntro title="CV y contacto" />
      <div className="module-grid">
        <section className="panel" aria-labelledby="formacion-titulo">
          <h2 id="formacion-titulo">Formación</h2>
        </section>
        <section className="panel" id="contacto" tabIndex={-1} aria-labelledby="contacto-titulo">
          <h2 id="contacto-titulo">Contacto</h2>
        </section>
      </div>
    </div>
  );
}
