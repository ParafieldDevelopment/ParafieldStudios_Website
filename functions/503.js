export async function onRequest(context) {
  // Fetch the static 503.html page
  const response = await context.env.ASSETS.fetch(new Request(new URL("/503.html", context.request.url)));
  
  // Return the response with the 503 status code
  return new Response(response.body, {
    status: 503,
    statusText: "Service Unavailable",
    headers: response.headers
  });
}