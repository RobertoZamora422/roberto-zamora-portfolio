import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ActionLink, PageIntro } from "../ui/elementos";
import { caseFixture, projectFixture } from "./datos";

export const meta = () => [{ title: "Caso de prueba" }, { name: "robots", content: "noindex" }];

export function loader({ params }: LoaderFunctionArgs) {
  if (params.slug !== caseFixture.slug) throw new Response(null, { status: 404 });
  return { ...caseFixture, projectPath: projectFixture.path };
}

export default function CasoDePrueba() {
  const study = useLoaderData<typeof loader>();
  return (
    <PageIntro title={study.title}>
      <p className="technical-label">Datos de prueba</p>
      <p>{study.description}</p>
      <div className="actions">
        <ActionLink to={study.projectPath}>Volver al proyecto de prueba</ActionLink>
      </div>
    </PageIntro>
  );
}
