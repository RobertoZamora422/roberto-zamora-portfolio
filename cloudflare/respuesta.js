// Las páginas HTML aprobadas están excluidas en _routes.json. El resto del HTML que
// devuelve ASSETS es el fallback de Inicio, incluso para peticiones parciales.
export default {
  async fetch(request, env) {
    const asset = await env.ASSETS.fetch(request);
    if (![200, 206, 304].includes(asset.status)) return asset;
    // Un 304 puede omitir Content-Type. Consultar las cabeceras sin condiciones
    // permite distinguir un archivo en caché del fallback de una URL inexistente.
    const headers = asset.status === 304
      ? (await env.ASSETS.fetch(new Request(request.url, { method: "HEAD" }))).headers
      : asset.headers;
    if (!headers.get("content-type")?.startsWith("text/html")) return asset;
    return new Response(request.method === "HEAD" ? null :
      '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Enlace no disponible</title><main><h1>Enlace no disponible</h1><p><a href="/">Volver al inicio del portafolio</a></p></main></html>', {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  },
};
