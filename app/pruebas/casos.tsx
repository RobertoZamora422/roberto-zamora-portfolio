import { ActionLink, PageIntro } from "../ui/elementos";
import { caseFixture } from "./datos";

export { meta } from "../routes/casos";

export default function CasosDePrueba() {
  return (
    <div className="page-stack">
      <PageIntro title="Casos de estudio" />
      <article className="panel panel--sample">
        <p className="technical-label">Datos de prueba</p>
        <h2>{caseFixture.title}</h2>
        <ActionLink to={caseFixture.path}>Abrir caso de prueba</ActionLink>
      </article>
    </div>
  );
}
