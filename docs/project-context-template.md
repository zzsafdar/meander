# Project Context Template

Copy this into a new issue comment or agent prompt and fill in the brackets.

## Goal
- [Agent prompt]

## Architecture Overview (short)
- Stack: FastAPI + Postgres + Redis + React Native (Expo) + Next.js + MapLibre
- Data sources: OSM/Overpass, Nominatim, TfL Journey Planner, OSRM
- London-only MVP; free APIs only

## Key Constraints
- TDD first: write failing tests before implementation
- Keep changes scoped to this ticket
- Use free/open-source APIs only
- Default routing: transit + walk via TfL
- If TfL keys missing, return stubbed routes with warning

## Behaviors & Defaults
- Time window optional; default 10:00-20:00 local
- Start location rules:
  1) From prompt (Nominatim)
  2) Else device location if in London
  3) Else London centroid
- Geocoding: Nominatim with strict rate limiting + cache

## Error & Warning Schema
- Errors: { error: { code, message, details } }
- Warnings: { warning: { code, message, details }, data }

## Relevant Docs
- Architecture overview: docs/architecture-overview.md
- Decision log: docs/decisions.md
