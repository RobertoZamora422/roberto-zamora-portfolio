// Sec-Fetch-Dest distingue una visita de las solicitudes internas del navegador.
// Sin esa cabecera, Accept y la ruta permiten atender también clientes HTTP sencillos.
export function esNavegacion(ruta, destino, acepta) {
  if (/^\/(?:assets|recursos|api|__manifest|\.well-known)(?:\/|$)/.test(ruta)) return false;
  if (/\/[^/]*\.[^/]+\/?$/.test(ruta) && !ruta.endsWith(".html")) return false;
  if (destino && !["document", "iframe"].includes(destino)) return false;
  const tipos = acepta?.trim();
  return !tipos || tipos === "*/*" || /(?:^|,)\s*(?:text\/html|application\/xhtml\+xml)(?:\s*[,;]|$)/i.test(tipos);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // El marcador 404.html del servicio estático no es una página visitable.
    const marcador = /^\/404(?:\.html)?\/?$/.test(url.pathname);
    const respuesta = marcador ? new Response(null, { status: 404 }) : await env.ASSETS.fetch(request);
    if (respuesta.status === 404 && ["GET", "HEAD"].includes(request.method)
      && esNavegacion(url.pathname, request.headers.get("Sec-Fetch-Dest"), request.headers.get("Accept"))) {
      return Response.redirect(new URL("/", url), 302);
    }
    return respuesta;
  },
};
