export async function onRequest(context) {
  const url = new URL(context.request.url);
  let response;

  // --- Maintenance Mode Check ---
  try {
    const configResponse = await context.env.ASSETS.fetch(new Request(new URL("/config.json", context.request.url)));
    if (configResponse.ok) {
      const config = await configResponse.json();
      if (config.maintenanceMode === true) {
        // Allow access to static assets and the 503 error page even in maintenance mode
        if (url.pathname.startsWith('/assets/') || 
            url.pathname.startsWith('/css/') || 
            url.pathname.startsWith('/js/') || 
            url.pathname === '/config.json' ||
            url.pathname === '/errors/503.html') {
            return context.next(); 
        }

        const maintenancePage = await context.env.ASSETS.fetch(new Request(new URL("/errors/503.html", context.request.url)));
        return new Response(maintenancePage.body, {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/html" }
        });
      }
    }
  } catch (err) {
    console.error("Failed to load config:", err);
  }
  // --- End Maintenance Mode Check ---

  // Proceed with the request if not in maintenance mode or config failed
  response = await context.next();

  // --- 404 Handling (always last) ---
  if (response.status === 404) {
    const custom404Page = await context.env.ASSETS.fetch(new Request(new URL("/errors/404.html", context.request.url)));
    return new Response(custom404Page.body, {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/html" }
    });
  }

  return response;
}