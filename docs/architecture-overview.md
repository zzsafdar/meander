# Architecture Overview

This document summarizes the MVP architecture for the London-only itinerary app.

## Scope
- London-only MVP focused on POI + food
- Free/open-source APIs only
- Default routing: mixed transit + walk

## High-Level Flow
1) User enters a prompt and optional constraints
2) System resolves start location (prompt -> device -> centroid)
3) Fetch POIs/food from OSM/Overpass
4) Rank and assemble itinerary with meal stops
5) Build route legs (TfL transit+walk by default)
6) Render map + timeline in client

## Clients
- Mobile: React Native (Expo)
- Web: Next.js (lightweight web planner)
- Maps: MapLibre GL with OSM tiles

## Backend
- FastAPI service with modular adapters
- Postgres for users/itineraries
- Redis for caching

## External Data Sources (Free)
- POI + food: OpenStreetMap via Overpass API
- Geocoding: Nominatim (rate limited + cached)
- Transit routing: TfL Journey Planner API
- Walk/Cycle routing: OSRM

## Core Services
- Itinerary Orchestrator
  - Prompt parsing (theme + constraints)
  - Ranking (theme match, distance clustering, diversity)
  - Meal insertion based on time window
  - Stop ordering with time windows
- Routing Service
  - Mode: transit_walk (default), walk, cycle
  - TfL adapter for transit+walk
  - OSRM adapter for walk/cycle
- Places Service
  - Overpass adapter for POIs + food
- Geocoding Service
  - Nominatim adapter with caching + throttling

## Defaults and Rules
- Time window optional; default 10:00-20:00 local
- Start location:
  1) From prompt (Nominatim)
  2) Else device location if within London
  3) Else London centroid
- Routing:
  - Default: transit + walk (TfL Journey Planner)
  - Toggle: walk-only or cycle-only (OSRM)

## Error and Warning Schema
- Error: { error: { code, message, details } }
- Warning: { warning: { code, message, details }, data }
- Example warnings: TFL_KEYS_MISSING
- Example errors: INVALID_REQUEST, GEOCODE_NOT_FOUND, OVERPASS_UNAVAILABLE

## Endpoints (MVP)
- POST /itineraries/generate
- GET /places/search
- POST /routes/plan

## Caching & Rate Limiting
- Nominatim: 1 req/sec per process, cached 12-24h
- Overpass: cached 12-24h
- TfL routing: cached by origin/destination/mode/time bucket

## TfL Keys Strategy
- If TFL_APP_ID or TFL_APP_KEY missing, return stubbed routes with warning
- Use env vars in production and local dev

## MVP Data Model (simplified)
- Place: id, name, category, lat/lng, opening_hours, tags
- Stop: place_id, start_time, duration, type
- Itinerary: id, user_id, prompt, date, time_window, mode
- RouteLeg: from_stop, to_stop, duration, distance, steps
