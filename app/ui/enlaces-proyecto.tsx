export function EnlacesProyecto({ nombre, aplicacion, repositorio, soloRepositorio }: {
  nombre: string;
  aplicacion?: string;
  repositorio: string;
  soloRepositorio?: boolean;
}) {
  return <>
    {aplicacion && <a href={aplicacion} target="_blank" rel="noopener noreferrer"
      aria-label={`Ver aplicación de ${nombre}`}>Ver aplicación <span aria-hidden="true">↗</span></a>}
    <a href={repositorio} target="_blank" rel="noopener noreferrer"
      aria-label={`${soloRepositorio ? "Consultar repositorio" : "Repositorio"} de ${nombre} en GitHub`}>
      {soloRepositorio ? "Consultar repositorio" : "Repositorio"} <span aria-hidden="true">↗</span>
    </a>
  </>;
}
