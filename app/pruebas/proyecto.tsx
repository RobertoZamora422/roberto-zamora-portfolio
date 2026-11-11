import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ActionLink, PageIntro } from "../ui/elementos";
import { caseFixture, projectFixture } from "./datos";

export const meta = () => [{ title: "Proyecto de prueba" }, { name: "robots", content: "noindex" }];

export function loader({ params }: LoaderFunctionArgs) {
  if (params.slug !== projectFixture.slug) throw new Response(null, { status: 404 });
  return { ...projectFixture, casePath: caseFixture.path };
}

export default function ProyectoDePrueba() {
  const project = useLoaderData<typeof loader>();
  return (
    <PageIntro title={project.title}>
      <p className="technical-label">Datos de prueba</p>
      <p>{project.description}</p>
      <div className="actions">
        <ActionLink to={project.casePath} primary>Abrir caso de prueba</ActionLink>
      </div>
    </PageIntro>
  );
}
