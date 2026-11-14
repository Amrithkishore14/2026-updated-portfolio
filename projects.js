/* ─────────────────────────────────────────────────────────────
   PROJECT DATA — edit this file to add, remove or reorder projects.
   Each object becomes a card. No HTML editing needed.

   Fields:
     title      (required) project name
     context    (required) e.g. "MSc Dissertation", "Client project"
     stack      short tech line shown as a tag
     summary    (required) 2–3 sentences: problem, what you did, result
     tags       array of short outcome tags
     link       optional URL (live site, repo, case study)
     linkLabel  optional button text (default "View project")
     image      optional path, e.g. "assets/design/elmar-home.jpg"
     imageAlt   describe the image for screen readers
     featured   true = purple top border
   ───────────────────────────────────────────────────────────── */

const WORK_PROJECTS = [
  {
    title: "CAIM-MC: Cloud AI Identity Manager",
    context: "MSc Dissertation · AWS & Azure",
    stack: "Python · Lambda · scikit-learn",
    summary: "Cross-cloud identity federation framework authenticating AI agents to AWS and Azure via OIDC, with 15-minute STS credentials. Real-time anomaly detection with Isolation Forest on CloudTrail and Azure Monitor logs, revoking access across both clouds automatically. Validated across 15 attack simulations with 100% detection at a 4.3% false-positive rate.",
    tags: ["OIDC/STS", "Anomaly Detection", "Multi-Cloud"],
    featured: true
  },
  {
    title: "Student Event Booking REST API",
    context: "University Project",
    stack: "Java · MongoDB · Docker",
    summary: "RESTful API following SOA principles for event creation, attendance management, capacity controls and post-event ratings. Integrated the Skiddle and Maps APIs, containerised with Docker, and load-tested with JMeter.",
    tags: ["SOA Principles", "JMeter Tested", "Containerised"]
  },
  {
    title: "Serverless Sentiment-Based Message Router",
    context: "Freelance Project",
    stack: "Lambda · Comprehend · S3",
    summary: "Fully serverless, event-driven pipeline using Lambda and Amazon Comprehend to classify and route messages by sentiment priority, with IAM least-privilege policies and CloudWatch monitoring for full observability.",
    tags: ["Serverless", "Event-Driven", "IAM Security"]
  },
  {
    title: "Cloud Load Balancer System",
    context: "University Project",
    stack: "Java · MySQL · Docker · JavaFX",
    summary: "Cloud-based load balancer supporting Round Robin, Weighted and Dynamic scheduling algorithms. Containerised with Docker, with real-time performance dashboards built in JavaFX.",
    tags: ["Resilience", "Live Dashboards", "Scalability"]
  }
];

const DESIGN_PROJECTS = [
  {
    title: "Elmar Risk Management: Website Redesign",
    context: "Client project · Jul – Nov 2026",
    stack: "Astro · Tailwind · GSAP · SVG",
    summary: "Redesigned a Gloucester compliance consultancy's Wix site into a dark-first, 12-page responsive website with custom SVG motifs, a navy and amber brand palette and subtle motion. Ran screen-by-screen reviews with the founder, met WCAG AAA colour contrast, and launched on Cloudflare with a live DNS cutover.",
    tags: ["Branding & UI", "Responsive", "WCAG AAA", "Live"],
    link: "https://www.elmarrisk.co.uk",
    linkLabel: "Visit live site",
    featured: true
  },
  {
    title: "Personal Portfolio",
    context: "Self-initiated · 2026",
    stack: "HTML · CSS · Bootstrap · SVG",
    summary: "Designed this site's cloud-network visual identity: an animated topology background, custom SVG architecture diagram, glass cards and a high-contrast dark palette tuned for readability.",
    tags: ["Visual Identity", "SVG", "Accessibility"]
  },
  {
    title: "EquityInvestorClub & YouTube Content",
    context: "Founder & creator · 2023 – present",
    stack: "Graphic design · Video editing",
    summary: "Created a consistent visual identity and social graphics for a financial literacy community on Instagram, and design thumbnails and edit vlogs, Shorts and Reels for my YouTube channel.",
    tags: ["Social Graphics", "Thumbnails", "Brand Consistency"]
  }
];

/* ─── Renderer (no need to edit below) ─── */
(function renderProjects() {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const card = p => `
    <div class="col-lg-6" data-animate>
      <article class="glass-panel project-card h-100${p.featured ? " featured" : ""}">
        ${p.image ? `<img class="project-thumb mb-3" src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" />` : ""}
        <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h3 class="mb-1">${esc(p.title)}</h3>
            <p class="small mb-0 project-context">${esc(p.context)}</p>
          </div>
          ${p.stack ? `<span class="chip tag">${esc(p.stack)}</span>` : ""}
        </div>
        <p class="project-summary mb-3">${esc(p.summary)}</p>
        <div class="d-flex flex-wrap gap-2 align-items-center">
          ${(p.tags || []).map(t => `<span class="chip attr">${esc(t)}</span>`).join("")}
          ${p.link ? `<a class="btn btn-sm btn-outline-accent ms-auto" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel || "View project")} ↗</a>` : ""}
        </div>
      </article>
    </div>`;
  const mount = (id, list) => { const el = document.getElementById(id); if (el) el.innerHTML = list.map(card).join(""); };
  const run = () => { mount("work-grid", WORK_PROJECTS); mount("design-grid", DESIGN_PROJECTS); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
