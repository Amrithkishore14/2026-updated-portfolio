// Downloads each employer's logo (site icon) into public/logos at build time.
// If a download fails, the page shows an initials badge instead, so the build never breaks.
import fs from 'node:fs';
const exp = JSON.parse(fs.readFileSync('src/data/experience.json', 'utf8'));
fs.mkdirSync('public/logos', { recursive: true });
for (const x of exp.items) {
  if (!x.domain) continue;
  const out = `public/logos/${x.domain}.png`;
  try {
    const r = await fetch(`https://www.google.com/s2/favicons?domain=${x.domain}&sz=128`, { signal: AbortSignal.timeout(8000) });
    const buf = Buffer.from(await r.arrayBuffer());
    if (r.ok && buf.length > 300) { fs.writeFileSync(out, buf); console.log('logo', x.domain, buf.length); }
    else console.log('no logo for', x.domain);
  } catch (e) { console.log('logo fetch failed', x.domain, e.message); }
}
