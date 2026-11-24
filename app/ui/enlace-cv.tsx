export function EnlaceCv({ pdf, className, abreviar = false }: {
  pdf?: string;
  className?: string;
  abreviar?: boolean;
}) {
  if (!pdf) return null;
  return (
    <a href={pdf} className={className} target="_blank" rel="noopener"
      aria-label="Ver CV (PDF, abre en una pestaña nueva)">
      {abreviar ? "CV" : "Ver CV"} <span aria-hidden="true">↗</span>
    </a>
  );
}
