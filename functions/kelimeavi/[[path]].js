export function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // ✅ ONLY handle kelimeavi pages
  if (!path.startsWith('/kelimeavi/')) {
    return context.env.ASSETS.fetch(context.request);
  }

  // ✅ Allow assets inside kelimeavi
  if (
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
    return context.env.ASSETS.fetch(context.request);
  }

  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1];

  // ✅ Only rewrite valid date URLs
  if (/^\d{4}-\d{2}-\d{2}$/.test(last)) {
    return context.env.ASSETS.fetch(
      new Request(new URL('/kelimeavi/kelimeavi.html', url))
    );
  }

  // ✅ Default kelimeavi behavior
  return context.env.ASSETS.fetch(context.request);
}