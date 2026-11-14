# Amrith Kishore — portfolio

Live: https://2026-updated-portfolio.amrithkishore6.workers.dev
Admin (CMS): https://2026-updated-portfolio.amrithkishore6.workers.dev/admin/

Built with Astro. Hosted on Cloudflare Workers (static assets). Every push to `main` builds and deploys automatically (Cloudflare Workers Builds: build `npm run build`, deploy `npx wrangler deploy`).

## Editing content without code
Open `/admin/`, choose **Sign in with token**, and paste a GitHub fine-grained token that has *Contents: Read and write* on this repository only. Edits commit straight to `main` and go live in about a minute.

- **Projects** → `src/content/projects/*.md` (case studies; `featured` puts one in the big rows)
- **Site content** → `src/data/*.json` (about, experience, education, certifications, awards)
- Uploaded images → `public/assets/uploads/`

## Run locally
```
npm install
npm run dev
```
