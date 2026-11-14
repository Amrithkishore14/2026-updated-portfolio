---
title: "CAIM-MC: Cloud AI Identity Manager"
category: "cloud"
featured: true
order: 1
year: "2026"
role: "MSc dissertation · Sole developer"
summary: "A security platform that watches what AI agents do in AWS and Azure, spots unusual behaviour with machine learning, and revokes their access in both clouds automatically."
stack: ["Python", "FastAPI", "React", "AWS STS", "Azure Entra ID", "OIDC", "scikit-learn"]
outcomes: ["1.57 s to revoke credentials in both clouds", "4.3% false-positive rate across 15 attack simulations", "Found and worked around an undocumented Entra ID limitation"]
live: "https://amrithkishore14.github.io/caim-mc-demo/"
liveLabel: "Open the live dashboard"
code: ""
cover: "/assets/work/caim/caim-dashboard.jpg"
gallery: ["/assets/work/caim/caim-agent.jpg", "/assets/work/caim/caim-alerts.jpg", "/assets/work/caim/caim-simulations.jpg"]
concept: false
---

## The problem
Companies are starting to give AI agents real cloud permissions. If an agent is tricked or misbehaves, it can read data or change permissions faster than a person can react, and the evidence is split between AWS and Azure logs.

## What I built
- **Cross-cloud identity:** two Claude Haiku agents (Lenny on AWS, Betty on Azure) authenticate through OIDC federation and get 15-minute credentials, so there are no long-lived keys to steal.
- **Detection:** CloudTrail and Azure Monitor events are normalised into one format, then scored by an Isolation Forest model trained on each agent's normal behaviour.
- **Response:** when a score crosses the threshold, the platform revokes the agent's access in both clouds at once and raises an alert.
- **Dashboard:** a React and FastAPI console for agents, events, alerts, model status and attack simulations.

## What I learned
An Azure service principal can't disable itself through its own token, even with `Application.ReadWrite.All`. This isn't documented anywhere obvious. I routed revocation through a tenant-admin call instead, and made "never let an identity revoke itself" a design rule.

## Try it
The live dashboard runs in demo mode with simulated data, because the real system needs live AWS and Azure accounts. Open **Simulations**, pick an attack and watch the alert and revocation appear.
