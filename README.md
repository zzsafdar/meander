# Meander

AI-powered itinerary planner with maps for iOS and Android.

## Overview

Meander combines natural language AI planning with interactive maps to create personalized walking and transit itineraries. Tell the app what you want to explore, and it generates a complete day plan with stops, times, and directions.

## Features

- **AI-Powered Planning**: Describe your ideal day in natural language
- **Interactive Maps**: View all stops on an interactive Mapbox map
- **Walking + Transit Directions**: Get routes between stops
- **Material Design 3**: Clean, modern UI
- **Session-Based**: No accounts, no cloud sync - your data stays on your device

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Mapbox account with access token
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd meander

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env
# EXPO_PUBLIC_OPENAI_API_KEY=sk-...
# EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...
```

### Running the App

```bash
# Generate native projects
npx expo prebuild

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android
```

### Development Build (Required)

**Important**: Mapbox requires a custom development build. You cannot use Expo Go.

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build and run
npx expo prebuild
npx expo run:ios
```

## Project Structure

```
meander/
├── App.tsx                    # App entry point
├── src/
│   ├── app/providers/         # App-wide providers
│   ├── components/            # Shared UI components
│   ├── features/
│   │   ├── geocoding/         # Place → coordinates
│   │   ├── itinerary/         # Itinerary domain & UI
│   │   ├── location/          # Location services
│   │   ├── map/               # Mapbox components
│   │   ├── planner/           # Orchestration layer
│   │   ├── routing/           # Walking + transit routing
│   │   ├── search/            # Search input UI
│   │   └── storage/           # Session cache
│   ├── lib/                   # Utilities & config
│   ├── navigation/            # React Navigation setup
│   ├── screens/               # Screen components
│   └── theme/                 # Material 3 theme
├── e2e/                       # Detox E2E tests
└── __tests__/                 # Jest unit tests
```

## Testing

### Unit Tests

```bash
npm test
npm run test:watch
```

### E2E Tests (Requires built app)

```bash
# iOS
npm run test:e2e:ios

# Android
npm run test:e2e:android
```

## Key Technical Decisions

### Why Custom Dev Client?

Mapbox GL RN requires native modules that aren't available in Expo Go. We use a custom development build to include these dependencies while staying in the managed workflow.

### Transit Routing Limitation

**Mapbox Directions API does not support public transit routing.** For transit directions, you'll need to integrate an additional provider:

- **OpenTripPlanner** (recommended) - Open-source, GTFS-compatible
- **Google Directions API** - Paid, comprehensive transit support
- **City-specific APIs** - TfL, BART, etc.

The `transitRouteService.ts` file is designed as an adapter - swap implementations without changing the rest of the app.

### OpenAI Key Security

For the MVP, the OpenAI key is configured via environment variables and bundled with the app. **For production**, you should:

1. **Never expose keys in client apps**
2. **Use a backend proxy** to make OpenAI calls
3. **Add rate limiting** per device

The architecture is designed to swap `openaiItineraryService.ts` with a backend call without changing UI code.

### Session-Only Storage

Per requirements, itineraries are only stored for the current session. On cold launch, any cached data is cleared. To persist across sessions, modify `sessionCache.ts` to skip the timestamp check.

## Configuration

### Environment Variables

```bash
# .env
EXPO_PUBLIC_OPENAI_API_KEY=sk-...     # OpenAI API key
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey... # Mapbox public token

# For EAS Build (set in secrets)
RNMAPBOX_MAPS_DOWNLOAD_TOKEN=sk.ey... # Mapbox secret token with DOWNLOADS:READ scope
```

### Mapbox Setup

1. Create a Mapbox account
2. Generate a public token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
   - `vision:read`
   - `downloads:read`
3. For EAS builds, create a secret token with `DOWNLOADS:READ` scope

## Known Limitations

1. **No public transit routing** - Mapbox doesn't support it; requires additional provider
2. **OpenAI key in client** - For MVP only; use backend proxy for production
3. **No persistence** - Sessions clear on app restart by design
4. **Custom dev client required** - Cannot use Expo Go

## Architecture Highlights

### Feature-Based Structure

Each feature is self-contained with its own:
- Domain types (`domain/types.ts`)
- Services (`services/`)
- Components (`components/`)
- Tests (`__tests__/`)

### Service Layer Pattern

External APIs are wrapped in service modules:
- `openaiItineraryService.ts` - AI generation
- `mapboxGeocodingService.ts` - Place search
- `mapboxWalkingService.ts` - Walking directions
- `transitRouteService.ts` - Transit adapter

This makes it easy to swap providers without touching UI code.

### State Management

Simple reducer-based state in `plannerReducer.ts`:
- No Redux/Context complexity
- Easy to test
- Clear state transitions

## Troubleshooting

### Map doesn't render

- Verify `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` is set
- Check you've run `npx expo prebuild`
- Ensure you're using `expo run:ios` not Expo Go

### AI generation fails

- Check `EXPO_PUBLIC_OPENAI_API_KEY` is valid
- Verify you have API credits
- Check network connectivity

### Location permission denied

The app works without location. It's used for:
- Centering the map on first load
- Providing context to AI queries

You can still plan itineraries without location access.

## Contributing

1. Feature branches from `main`
2. Tests required for new features
3. Follow existing code patterns
4. Update documentation for API changes

## License

MIT
