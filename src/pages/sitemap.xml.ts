import { getCollection } from 'astro:content';
export async function GET({ site }: { site: URL }) {
  const projects = await getCollection('projects');
  const urls = ['/', ...projects.map((p) => `/work/${p.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${new URL(u, site)}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
