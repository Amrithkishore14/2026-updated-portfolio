// Cloudflare Worker: serves the static site and accepts recommendation submissions.
// Submissions are committed to GitHub as *unapproved* JSON files; they only appear
// on the site after you tick "Approved" in the CMS (/admin).
//
// Required secret (Cloudflare dashboard -> Worker -> Settings -> Variables and secrets):
//   GITHUB_TOKEN  fine-grained token with Contents: Read and write on this repo only.

const REPO = 'Amrithkishore14/2026-updated-portfolio';
const BRANCH = 'main';
const DIR = 'src/content/testimonials';
const LIMITS = { name: 80, role: 100, company: 100, relationship: 40, about: 120, quote: 1200, linkedin: 200 };
const RELATIONSHIPS = ['Client', 'Manager', 'Colleague', 'Lecturer', 'Mentor', 'Other'];
const recent = new Map(); // simple per-IP rate limit (per Worker instance)

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'someone';
const b64 = (str) => btoa(String.fromCharCode(...new TextEncoder().encode(str)));

async function submit(request, env) {
  const origin = request.headers.get('Origin');
  // Only accept submissions sent by the site's own form (blocks scripts posting from elsewhere).
  let sameSite = false;
  try { sameSite = !!origin && new URL(origin).host === new URL(request.url).host; } catch {}
  if (!sameSite) return json({ ok: false, error: 'Forbidden' }, 403);
  if (Number(request.headers.get('Content-Length') || 0) > 16_384) return json({ ok: false, error: 'Submission too large.' }, 413);
  if (!env.GITHUB_TOKEN) return json({ ok: false, error: 'Recommendations are not switched on yet. Please email instead.' }, 503);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  // Global rate limit across all Cloudflare locations (binding RL in wrangler.jsonc).
  if (env.RL) { const { success } = await env.RL.limit({ key: `rec:${ip}` }); if (!success) return json({ ok: false, error: 'Too many submissions. Please try again later.' }, 429); }
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 3) return json({ ok: false, error: 'Too many submissions from this connection. Please try again later.' }, 429);

  let body;
  const type = request.headers.get('Content-Type') || '';
  try {
    body = type.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
  } catch { return json({ ok: false, error: 'Could not read the form.' }, 400); }

  if (body.website) return json({ ok: true }); // honeypot: bots fill hidden field
  const t = {
    name: clean(body.name, LIMITS.name),
    role: clean(body.role, LIMITS.role),
    company: clean(body.company, LIMITS.company),
    relationship: RELATIONSHIPS.includes(body.relationship) ? body.relationship : 'Other',
    about: clean(body.about, LIMITS.about),
    quote: String(body.quote ?? '').replace(/\r/g, '').trim().slice(0, LIMITS.quote),
    linkedin: clean(body.linkedin, LIMITS.linkedin),
  };
  if (t.linkedin && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(t.linkedin)) t.linkedin = '';
  if (t.name.length < 2) return json({ ok: false, error: 'Please add your name.' }, 400);
  if (t.quote.length < 30) return json({ ok: false, error: 'Please write at least a couple of sentences.' }, 400);
  if (body.consent !== 'on' && body.consent !== true && body.consent !== 'true') return json({ ok: false, error: 'Please tick the box to agree to your words being shown.' }, 400);

  const submittedAt = new Date().toISOString();
  const id = `${submittedAt.slice(0, 10)}-${slugify(t.name)}-${Math.random().toString(36).slice(2, 6)}`;
  const record = { ...t, approved: false, featured: false, order: 50, submittedAt };
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${DIR}/${id}.json`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'User-Agent': 'portfolio-recommendations', Accept: 'application/vnd.github+json' },
    body: JSON.stringify({ message: `Recommendation from ${t.name} (awaiting approval)`, content: b64(JSON.stringify(record, null, 2) + '\n'), branch: BRANCH }),
  });
  if (!res.ok) return json({ ok: false, error: 'Something went wrong saving your recommendation. Please email instead.' }, 502);
  hits.push(now); recent.set(ip, hits);
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/recommendations') {
      if (request.method === 'POST') return submit(request, env);
      return json({ ok: false, error: 'Method not allowed' }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};
