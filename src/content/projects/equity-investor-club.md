---
title: "Equity Investor Club platform"
category: "fullstack"
featured: true
order: 3
year: "2023 – now"
role: "Founder · Full-stack developer"
summary: "The web platform behind the financial-literacy community I founded: accounts, an admin dashboard and learning tools."
stack: ["Node.js", "Express", "SQLite", "bcrypt", "Docker", "Render"]
outcomes: ["Secure login with peppered bcrypt hashes and session auth", "Admin tools for users, scheduled posts and moderation", "SIP calculator, risk-profile quiz and PDF certificates"]
live: ""
liveLabel: "Open the live site"
code: "https://github.com/Amrithkishore14/equity"
cover: ""
gallery: []
concept: false
---

## Why it exists
I started Equity Investor Club in 2023 to explain investing in plain language. As the community grew, it needed a home of its own instead of scattered posts.

## What it does
- Public learning hub, glossary and daily market update.
- Member accounts with password reset and a personal dashboard.
- An admin dashboard to manage users, schedule posts, moderate comments and read login logs.
- Tools: SIP calculator, risk-profile quiz and certificate generation.

## Security choices
Passwords are hashed with bcrypt plus an application pepper, and older hashes upgrade automatically on next login. Sessions are stored server-side, and secrets come from environment variables.
