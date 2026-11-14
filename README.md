# Amrith Kishore — Portfolio

Live: https://2026-updated-portfolio.amrithkishore6.workers.dev

Static site (HTML, CSS, Bootstrap 5, vanilla JS). Hosted on Cloudflare Workers (static assets). Every merge to `main` deploys automatically via Cloudflare Workers Builds; files listed in `.assetsignore` are not published.

## Structure
| File | What it holds |
|---|---|
| `index.html` | Page layout and all fixed content (hero, experience, skills, education, contact) |
| `projects.js` | **Project cards** for the *Work* and *Design & web* sections |
| `style.css` | Theme, colours (`:root` variables), components |
| `script.js` | Scroll reveal, counters, nav highlight |
| `assets/` | Photos, CV PDF (`Amrith_Kishore_M_CV.pdf`), design screenshots (`assets/design/`) |

## Add a new project (no HTML needed)
1. Open `projects.js`.
2. Copy an existing `{ ... }` block into `WORK_PROJECTS` (cloud / engineering) or `DESIGN_PROJECTS` (design / websites).
3. Fill in `title`, `context`, `stack`, `summary`, `tags`; optionally `link`, `image`, `featured: true`.
4. For a screenshot, drop a 16:9 image in `assets/design/` and set `image: "assets/design/your-file.jpg"` plus an `imageAlt`.
5. Commit and push to `main`.

**Summary formula:** what the problem was → what you did (tools) → result (a number if possible).

## Update the CV
Replace `assets/Amrith_Kishore_M_CV.pdf` with a file of the same name; both "Download CV" buttons pick it up.

## Before pushing
- Open `index.html` in a browser (or VS Code Live Server) and check the new card.
- Keep claims consistent with the CV.
