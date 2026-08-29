export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/402.html", context.request.url)));
  return new Response(response.body, {
    status: 402,
    statusText: "Payment Required",
    headers: response.headers
  });
}
