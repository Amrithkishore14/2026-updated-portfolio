---
title: "PROJECT-SOCT: Student Event Service"
category: "cloud"
featured: false
order: 4
year: "2026"
role: "MSc coursework · Service-Oriented Cloud Technologies"
summary: "A Java REST web service for creating, searching and booking student events, combined with live weather and a public events feed, containerised with Docker."
stack: ["Java 17", "JAX-RS", "Tomcat", "MongoDB", "Docker", "OpenWeatherMap API", "JMeter"]
outcomes: ["REST API with create, search, register and delete endpoints", "Integrates live weather for each event", "Falls back to in-memory storage if MongoDB is down", "Multi-stage Docker build, latency-tested with curl and JMeter"]
live: ""
liveLabel: "Open the live site"
code: ""
cover: ""
gallery: []
concept: false
---

## What it does
Students sign up, log in, then create, search, register for and delete campus events through a REST API and a responsive web front end. Each event can be viewed together with its live weather forecast, and the service also pulls in a feed of public events from an external API.

## How it's built
- **Web service:** JAX-RS on Tomcat 9 (Java 17), with the API under `/api` and the front end served from the same app.
- **Storage:** MongoDB through a repository layer, switched on with environment variables. If MongoDB can't be reached, it falls back to in-memory storage so a demo never breaks.
- **Integration:** calls the OpenWeatherMap API and combines the event and its weather into one response.
- **Clear HTTP responses:** 201 for created, 400 for bad data, 401 for failed login, 404 for not found, 409 for conflicts and 500 if the weather service fails.

## Deployment and testing
- Packaged as a WAR and containerised with a multi-stage Docker build (Maven build stage, then a slim Tomcat image).
- Spot-checked latency with a scripted curl loop and ran a JMeter test plan against `GET /api/events`.
