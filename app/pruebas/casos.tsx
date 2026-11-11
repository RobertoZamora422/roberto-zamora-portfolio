import { useLoaderData } from "react-router";
import { cargarContenido } from "../contenido/registro.server";
import { rutaCaso } from "../rutas";
import { ActionLink, PageIntro } from "../ui/elementos";

export { meta } from "../routes/casos";

export async function loader() {
  const { casos } = await cargarContenido();
  return casos.map(({ slug, titulo }) => ({ titulo, ruta: rutaCaso(slug) }));
}

export default function CasosDePrueba() {
  const casos = useLoaderData<typeof loader>();

  return (
    <div className="page-stack">
      <PageIntro title="Casos de estudio" />
      {casos.map(({ titulo, ruta }) => (
        <article className="panel panel--sample" key={ruta}>
          <p className="technical-label">Vista local de revisión</p>
          <h2>{titulo}</h2>
          <ActionLink to={ruta}>Abrir caso</ActionLink>
        </article>
      ))}
    </div>
  );
}
