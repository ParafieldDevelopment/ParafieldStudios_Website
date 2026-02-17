export async function onRequest(context) {
  // Fetch the static 403.html page
  const response = await context.env.ASSETS.fetch(new Request(new URL("/errors/403.html", context.request.url)));
  
  // Return the response with the 403 status code
  return new Response(response.body, {
    status: 403,
    statusText: "Forbidden",
    headers: response.headers
  });
}