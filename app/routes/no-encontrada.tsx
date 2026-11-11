import { paths } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";

export const meta = () => [
  { title: "Página no encontrada · Portafolio profesional" },
  { name: "robots", content: "noindex" },
];

export function NoEncontrada() {
  return (
    <PageIntro title="Página no encontrada">
      <p>La dirección solicitada no está disponible.</p>
      <div className="actions">
        <ActionLink to={paths.inicio} primary>Volver a Inicio</ActionLink>
        <ActionLink to={paths.casos}>Ver casos de estudio</ActionLink>
      </div>
    </PageIntro>
  );
}

export default NoEncontrada;
