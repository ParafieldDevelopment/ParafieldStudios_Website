export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/502.html", context.request.url)));
  return new Response(response.body, {
    status: 502,
    statusText: "Bad Gateway",
    headers: response.headers
  });
}
