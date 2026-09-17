export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/504.html", context.request.url)));
  return new Response(response.body, {
    status: 504,
    statusText: "Gateway Timeout",
    headers: response.headers
  });
}
