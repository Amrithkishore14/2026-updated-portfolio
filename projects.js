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
     gallery    optional extra screenshots: [{ src: "assets/design/x.jpg", alt: "..." }]
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
    title: "Equity Investor Club Platform",
    context: "Founder · Full-stack web app",
    stack: "Node.js · Express · SQLite",
    summary: "Finance-education platform for my investing community, with session auth using bcrypt and peppered hashes, an admin dashboard (users, scheduled posts, comment moderation, login logs), a learning hub, SIP calculator, risk-profile quiz and PDF certificates. Containerised with Docker and set up for Render.",
    tags: ["Auth & Security", "Admin Dashboard", "Docker"],
    link: "https://github.com/Amrithkishore14/equity",
    linkLabel: "View code"
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
    summary: "Redesigned a Gloucester compliance consultancy's Wix site into a modern 12-page responsive website with a navy and amber brand palette, custom SVG illustrations for each service and subtle motion. Ran screen-by-screen reviews with the founder, met WCAG AAA colour contrast, and launched on Cloudflare with a live DNS cutover.",
    tags: ["Branding & UI", "Responsive", "WCAG AAA", "Live"],
    link: "https://www.elmarrisk.co.uk",
    linkLabel: "Visit live site",
    image: "assets/design/elmar-home.jpg",
    imageAlt: "Elmar Risk Management homepage: navy hero with the headline Compliance expertise, without the overhead",
    gallery: [
      { src: "assets/design/elmar-services.jpg", alt: "Services overview page with custom SVG illustration" },
      { src: "assets/design/elmar-about.jpg", alt: "About page introducing the founder" },
      { src: "assets/design/elmar-gdpr.jpg", alt: "Data Protection and UK GDPR service page" },
      { src: "assets/design/elmar-home-mobile.jpg", alt: "Homepage on a mobile phone" }
    ],
    featured: true
  },
  {
    title: "NEXUS X1: Electric Car Microsite",
    context: "Self-initiated · 10-page site",
    stack: "HTML · CSS · JavaScript",
    summary: "Multi-page launch site for a concept electric performance car, with performance, engineering, interior, technology, a gallery with film, a journal and an interactive configurator, tied together by a neon-on-black visual system.",
    tags: ["Multi-page", "Configurator", "Motion & Video"],
    link: "projects/nexus-x1/",
    linkLabel: "View live site",
    image: "assets/design/projects/nexus-hero.jpg",
    imageAlt: "NEXUS X1 homepage: The Next Machine",
    gallery: [
      { src: "assets/design/projects/nexus-s1.jpg", alt: "Intelligence section" },
      { src: "assets/design/projects/nexus-s2.jpg", alt: "By the numbers" },
      { src: "assets/design/projects/nexus-s3.jpg", alt: "Explore the car" },
      { src: "assets/design/projects/nexus-mobile.jpg", alt: "Homepage on mobile" }
    ]
  },
  {
    title: "Vantage Risk: Consultancy Website",
    context: "Self-initiated · 2026",
    stack: "HTML · CSS · JavaScript",
    summary: "Website for a fictional risk consultancy with an animated risk-radar hero, service areas from cyber to financial risk, and an interactive likelihood-and-impact heat map for exploring risk categories.",
    tags: ["B2B", "Data Visualisation", "Interaction"],
    link: "https://amrithkishore14.github.io/vantage-risk/",
    linkLabel: "View live site",
    image: "assets/design/projects/vantage-hero.jpg",
    imageAlt: "Vantage Risk homepage: Risk shouldn't be reactive",
    gallery: [
      { src: "assets/design/projects/vantage-s2.jpg", alt: "Risk service areas" },
      { src: "assets/design/projects/vantage-s3.jpg", alt: "Interactive risk heat map" },
      { src: "assets/design/projects/vantage-mobile.jpg", alt: "Homepage on mobile" }
    ]
  },
  {
    title: "MOUNAM: Zero-Waste Fashion",
    context: "Client project · 7 pages",
    stack: "HTML · CSS · JavaScript",
    summary: "Editorial portfolio site for a zero-waste fashion collection, with a Bodoni and red-accent identity, a visual story, an eight-garment collection, the zero-waste process and a designer page.",
    tags: ["Fashion", "Editorial Type", "Client Delivery"],
    link: "https://amrithkishore14.github.io/GOPIKA-PROJECT/",
    linkLabel: "View live site",
    image: "assets/design/projects/mounam-hero.jpg",
    imageAlt: "MOUNAM homepage: Fashion With No Waste",
    gallery: [
      { src: "assets/design/projects/mounam-s2.jpg", alt: "Brand statement and stats" },
      { src: "assets/design/projects/mounam-mobile.jpg", alt: "Homepage on mobile" }
    ]
  },
  {
    title: "AURA: Fashion E-commerce",
    context: "Self-initiated · 2026",
    stack: "HTML · CSS · JavaScript",
    summary: "Storefront concept for a premium fashion label with a bold typographic hero, lookbook, collection grid, wishlist and basket counters, and a newsletter sign-up.",
    tags: ["E-commerce", "Typography", "Responsive"],
    link: "https://amrithkishore14.github.io/AURA/",
    linkLabel: "View live site",
    image: "assets/design/projects/aura-hero.jpg",
    imageAlt: "AURA homepage: Wear Your Standard",
    gallery: [
      { src: "assets/design/projects/aura-mobile.jpg", alt: "Homepage on mobile" }
    ]
  },
  {
    title: "Kaapi & Kothu: Restaurant Website",
    context: "Concept project · AI-assisted design",
    stack: "HTML · CSS · SVG",
    summary: "Website concept for a fictional Chennai street-food kitchen in Nottingham. A hand-built banana-leaf illustration leads the hero, the menu changes with the time of day, and online ordering and table booking stay one tap away on mobile.",
    tags: ["Brand Identity", "Illustration", "Responsive"],
    link: "concepts/kaapi/",
    linkLabel: "View live concept",
    image: "assets/design/concepts/kaapi-hero.jpg",
    imageAlt: "Kaapi & Kothu homepage with a banana-leaf meal illustration",
    gallery: [
      { src: "assets/design/concepts/kaapi-s1.jpg", alt: "Menu by time of day: tiffin, meals, kothu" },
      { src: "assets/design/concepts/kaapi-s2.jpg", alt: "Most-ordered dishes with prices" },
      { src: "assets/design/concepts/kaapi-s3.jpg", alt: "Filter coffee feature" },
      { src: "assets/design/concepts/kaapi-mobile.jpg", alt: "Homepage on mobile" }
    ]
  },
  {
    title: "Kestrel: Credit-Builder Card",
    context: "Concept project · AI-assisted design",
    stack: "HTML · CSS",
    summary: "Fintech landing page concept for a fictional credit card that helps students and new arrivals build UK credit. Explains a complex product through a first-year timeline, a limit picker and a plain-English cost box with the representative APR.",
    tags: ["Fintech UI", "Information Design", "Accessible Copy"],
    link: "concepts/kestrel/",
    linkLabel: "View live concept",
    image: "assets/design/concepts/kestrel-hero.jpg",
    imageAlt: "Kestrel landing page with a tilted credit card and a rising credit score chart",
    gallery: [
      { src: "assets/design/concepts/kestrel-s1.jpg", alt: "First-year timeline of how credit builds" },
      { src: "assets/design/concepts/kestrel-s2.jpg", alt: "Card features and limit picker" },
      { src: "assets/design/concepts/kestrel-s3.jpg", alt: "Representative example of costs" },
      { src: "assets/design/concepts/kestrel-mobile.jpg", alt: "Landing page on mobile" }
    ]
  },
  {
    title: "Hollowbrook Primary: School Website",
    context: "Concept project · AI-assisted design",
    stack: "HTML · CSS · SVG",
    summary: "Website concept for a fictional primary school in a multi-academy trust. Puts what parents need most first (term dates, lunch menu, trip payments, absences), with a weekly events list, admissions deadlines and translate and larger-text options.",
    tags: ["Education", "UX for Parents", "Accessibility"],
    link: "concepts/hollowbrook/",
    linkLabel: "View live concept",
    image: "assets/design/concepts/hollowbrook-hero.jpg",
    imageAlt: "Hollowbrook Primary homepage with an illustrated school and parent quick links",
    gallery: [
      { src: "assets/design/concepts/hollowbrook-s1.jpg", alt: "This week's events for parents" },
      { src: "assets/design/concepts/hollowbrook-s2.jpg", alt: "Headteacher welcome" },
      { src: "assets/design/concepts/hollowbrook-s3.jpg", alt: "Reception admissions deadlines" },
      { src: "assets/design/concepts/hollowbrook-mobile.jpg", alt: "Homepage on mobile" }
    ]
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
        ${p.image ? `<a href="${esc(p.image)}" target="_blank" rel="noopener"><img class="project-thumb mb-3" src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" /></a>` : ""}
        <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h3 class="mb-1">${esc(p.title)}</h3>
            <p class="small mb-0 project-context">${esc(p.context)}</p>
          </div>
          ${p.stack ? `<span class="chip tag">${esc(p.stack)}</span>` : ""}
        </div>
        <p class="project-summary mb-3">${esc(p.summary)}</p>
        ${(p.gallery || []).length ? `<div class="project-gallery mb-3">${p.gallery.map(g => `<a href="${esc(g.src)}" target="_blank" rel="noopener"><img src="${esc(g.src)}" alt="${esc(g.alt || "")}" loading="lazy" /></a>`).join("")}</div>` : ""}
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
