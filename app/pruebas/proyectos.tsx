import { ActionLink, PageIntro } from "../ui/elementos";
import { projectFixture } from "./datos";

export { meta } from "../routes/proyectos";

export default function ProyectosDePrueba() {
  return (
    <div className="page-stack">
      <PageIntro title="Proyectos" />
      <article className="panel panel--sample">
        <p className="technical-label">Datos de prueba</p>
        <h2>{projectFixture.title}</h2>
        <ActionLink to={projectFixture.path}>Abrir proyecto de prueba</ActionLink>
      </article>
    </div>
  );
}
