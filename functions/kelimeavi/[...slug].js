if (context.request.method !== "GET") {
  return context.next();
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Allow JSON data
  if (path.startsWith('/kelimeavi/data/')) {
    return context.next();
  }

  // Allow static assets
if (
  path.startsWith('/css_js/') ||
  path.startsWith('/icons/') ||
  path.startsWith('/images/') ||
  path.includes('/css_js/') ||
  path.includes('/icons/') ||
  path.includes('/images/') ||
  path.endsWith('.css') ||
  path.endsWith('.js') ||
  path.endsWith('.png') ||
  path.endsWith('.jpg') ||
  path.endsWith('.webp') ||
  path.endsWith('.ico')
) {
  return context.next();
}

  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1];

  // Match YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(last)) {
    return context.env.ASSETS.fetch(
      new Request(new URL('/kelimeavi/kelimeavi.html', url))
    );
  }

  return context.env.ASSETS.fetch(context.request);
}