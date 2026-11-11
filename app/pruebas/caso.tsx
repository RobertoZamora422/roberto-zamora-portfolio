import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { rutaProyecto } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";

export async function loader({ params }: LoaderFunctionArgs) {
  const { casos, paginas } = await cargarContenido();
  const caso = casos.find(({ slug }) => slug === params.slug);
  if (!caso) throw new Response(null, { status: 404 });
  return {
    titulo: caso.titulo,
    resumen: caso.resumen,
    proyecto: paginas.some(({ slug }) => slug === caso.proyecto) ? rutaProyecto(caso.proyecto) : undefined,
  };
}

export default function CasoDePrueba() {
  const study = useLoaderData<typeof loader>();
  return (
    <PageIntro title={study.titulo} kicker={<p className="technical-label">Vista local de revisión</p>}>
      <p>{study.resumen}</p>
      {study.proyecto && <ActionLink to={study.proyecto}>Volver al proyecto</ActionLink>}
    </PageIntro>
  );
}
