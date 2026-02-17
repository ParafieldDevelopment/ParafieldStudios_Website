export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Always allow access to assets (css, js, images) and the config file itself
  if (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/css/') ||
      url.pathname.startsWith('/js/') ||
      url.pathname === '/config.json' ||
      url.pathname === '/errors/503.html') {
    return context.next();
  }

  try {
    // Fetch the config.json file
    // We use context.env.ASSETS to fetch the static file from the deployment
    const configResponse = await context.env.ASSETS.fetch(new Request(new URL("/config.json", context.request.url)));

    if (configResponse.ok) {
      const config = await configResponse.json();

      // Check if maintenance mode is enabled
      if (config.maintenanceMode === true) {
        // Fetch and return the 503 page
        const maintenancePage = await context.env.ASSETS.fetch(new Request(new URL("/errors/503.html", context.request.url)));

        return new Response(maintenancePage.body, {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/html" }
        });
      }
    }
  } catch (err) {
    // If config fails to load, proceed as normal to avoid breaking the site
    console.error("Failed to load config:", err);
  }

  // If not in maintenance mode, proceed with the request
  return context.next();
}