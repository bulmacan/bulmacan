export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // ✅ Let static assets pass through ALWAYS
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

  // ✅ Handle clean URLs like /kelimeavi/2026-03-23
  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1];

  if (/^\d{4}-\d{2}-\d{2}$/.test(last)) {
    return context.env.ASSETS.fetch(
      new Request(new URL('/kelimeavi/kelimeavi.html', url))
    );
  }

  // ✅ Default
  return context.env.ASSETS.fetch(context.request);
}