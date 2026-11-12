export const tarjetaSocial = "/recursos/sitio/rz-social.png";

export function configuracionPublicacion(env: NodeJS.ProcessEnv) {
  const origen = env.PORTFOLIO_ORIGEN?.trim();
  const indicador = env.PORTFOLIO_INDEXAR ?? "0";
  if (indicador !== "0" && indicador !== "1") throw new Error("PORTFOLIO_INDEXAR debe ser 0 o 1");

  let url: URL | undefined;
  if (origen) {
    url = URL.canParse(origen) ? new URL(origen) : undefined;
    const dominio = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/i;
    if (!url || !/^https:\/\/[^:/?#@\\]+\/?$/.test(origen) || !dominio.test(url.hostname)
      || /\.(?:local|localhost|invalid|test|pages\.dev)$/i.test(url.hostname)) {
      throw new Error("PORTFOLIO_ORIGEN debe ser un origen HTTPS con dominio público, sin ruta, credenciales, puerto ni parámetros");
    }
  }
  if (indicador === "1" && !url) throw new Error("PORTFOLIO_INDEXAR=1 requiere PORTFOLIO_ORIGEN");
  if (env.PORTFOLIO_PREVIEW === "1") return { origen: undefined, indexar: false };
  return { origen: url?.origin, indexar: indicador === "1" };
}
