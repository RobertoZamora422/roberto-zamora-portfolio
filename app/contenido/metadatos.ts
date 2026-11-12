import { tarjetaSocial } from "./publicacion.ts";

interface Pagina {
  titulo: string;
  descripcion: string;
  ruta: string;
  tipo?: "website" | "article";
}

export function metadatosPagina({ titulo, descripcion, ruta, tipo = "website" }: Pagina, origen = process.env.PORTFOLIO_ORIGEN) {
  const meta = [
    { title: titulo },
    { name: "description", content: descripcion },
    { property: "og:title", content: titulo },
    { property: "og:description", content: descripcion },
    { property: "og:type", content: tipo },
    { property: "og:site_name", content: "Portafolio RZ." },
    { property: "og:locale", content: "es_EC" },
  ];
  if (!origen) return meta;
  const url = new URL(ruta, origen).href;
  return [
    ...meta,
    { tagName: "link" as const, rel: "canonical", href: url },
    { property: "og:url", content: url },
    { property: "og:image", content: new URL(tarjetaSocial, origen).href },
    { property: "og:image:alt", content: "RZ. · Portafolio profesional de Roberto Zamora" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
  ];
}
