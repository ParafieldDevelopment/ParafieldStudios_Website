export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/405.html", context.request.url)));
  return new Response(response.body, {
    status: 405,
    statusText: "Method Not Allowed",
    headers: response.headers
  });
}
