export function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // ✅ Let static assets load properly
  if (
    path.startsWith('/css_js/') ||
    path.startsWith('/icons/') ||
    path.startsWith('/images/') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.webp') ||
    path.endsWith('.ico')
  ) {
    return context.env.ASSETS.fetch(context.request);
  }

  // ✅ Allow JSON data
  if (path.startsWith('/kelimeavi/data/')) {
    return context.env.ASSETS.fetch(context.request);
  }

  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1];

  // ✅ Handle SEO URLs
  if (/^\d{4}-\d{2}-\d{2}$/.test(last)) {
    return context.env.ASSETS.fetch(
      new Request(new URL('/kelimeavi/kelimeavi.html', url))
    );
  }

  return context.env.ASSETS.fetch(context.request);
}