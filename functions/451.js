export async function onRequest(context) {
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/451.html", context.request.url)));
  return new Response(response.body, {
    status: 451,
    statusText: "Unavailable For Legal Reasons",
    headers: response.headers
  });
}
