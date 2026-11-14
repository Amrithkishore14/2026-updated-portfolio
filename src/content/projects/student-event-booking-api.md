---
title: "Student Event Booking API"
category: "cloud"
featured: false
order: 4
year: "2026"
role: "University project"
summary: "A REST API for creating and booking student events, with live weather and maps data, packaged in Docker and load-tested."
stack: ["Java", "JAX-RS", "MongoDB", "Docker", "JMeter", "OpenWeatherMap"]
outcomes: ["Follows service-oriented design principles", "Falls back to in-memory storage if MongoDB is down", "Load-tested with JMeter"]
live: ""
liveLabel: "Open the live site"
code: ""
cover: ""
gallery: []
concept: false
---

## What it does
Students create events, book places and rate them afterwards. Each event can pull live weather from OpenWeatherMap and location data from a maps API.

## Engineering notes
- JAX-RS on Tomcat, with MongoDB for storage and an in-memory fallback so demos never break.
- Containerised with Docker and load-tested with JMeter to find the point where response times climb.
