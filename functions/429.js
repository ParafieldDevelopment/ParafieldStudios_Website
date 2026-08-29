export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/429.html", context.request.url)));
  return new Response(response.body, {
    status: 429,
    statusText: "Too Many Requests",
    headers: response.headers
  });
}
