import { paths } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";

export default function Inicio() {
  return (
    <PageIntro title="Portafolio profesional">
      <p className="editorial-line">Comprender problemas. Diseñar soluciones. Generar valor.</p>
      <div className="actions">
        <ActionLink to={paths.proyectos} primary>Ver proyectos</ActionLink>
        <ActionLink to={paths.cv}>Ver CV</ActionLink>
      </div>
    </PageIntro>
  );
}
