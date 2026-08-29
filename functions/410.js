export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/410.html", context.request.url)));
  return new Response(response.body, {
    status: 410,
    statusText: "Gone",
    headers: response.headers
  });
}
