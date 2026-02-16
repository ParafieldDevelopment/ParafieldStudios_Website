export async function onRequest(context) {
  // Fetch the static 418.html page
  const response = await context.env.ASSETS.fetch(new Request(new URL("/418.html", context.request.url)));
  
  // Return the response with the 418 status code
  return new Response(response.body, {
    status: 418,
    statusText: "I'm a teapot",
    headers: response.headers
  });
}