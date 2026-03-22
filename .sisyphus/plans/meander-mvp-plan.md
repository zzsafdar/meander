# Meander MVP Implementation Plan

## Project Overview

**Meander** - A cross-platform mobile app (iOS + Android) combining AI-powered itinerary planning with mapping.

### Tech Stack
- **Framework**: React Native with Expo SDK 51+ (managed workflow + custom dev client)
- **AI**: OpenAI GPT-4 API for natural language itinerary planning
- **Maps**: Mapbox GL RN v10+ for map rendering, geocoding, and walking directions
- **Storage**: AsyncStorage (session-only, cleared on cold launch)
- **Navigation**: React Navigation with React Native Paper (Material Design 3)
- **Testing**: Jest + Testing Library + Detox/Maestro

### Critical Constraints
1. **Mapbox requires custom dev client** - Cannot use Expo Go
2. **Mapbox does NOT support public transit routing** - Transit routing must use alternative provider
3. **OpenAI key must not be exposed** - For MVP/simulator testing, use app.config.ts; for production, use backend proxy
4. **No persistence beyond current session** - AsyncStorage cleared on cold launch

---

## Wave Structure

### Wave 0: Foundation (Sequential: W0.1 → W0.2)

#### W0.1: Bootstrap Expo App
**Category**: `quick` | **Skills**: Expo, TypeScript, React Native

**Files to create**:
- `package.json` - Dependencies: expo, react, react-native, @react-navigation/native, @react-navigation/native-stack, react-native-paper, @react-native-async-storage/async-storage, openai, @rnmapbox/maps, expo-location, expo-dev-client
- `app.config.ts` - Expo config with Mapbox plugin, env extras
- `babel.config.js` - Expo preset
- `tsconfig.json` - Strict TypeScript
- `metro.config.js` - RN Metro config
- `.gitignore` - Standard RN/Expo ignores
- `.env.example` - OPENAI_API_KEY, MAPBOX_ACCESS_TOKEN
- `App.tsx` - Entry point with basic Text element

**Success criteria**:
- `npm install` completes without errors
- `npx expo prebuild` succeeds for both iOS and Android
- `npx expo run:ios` and `npx expo run:android` launch blank app

**Commit**: `chore: bootstrap expo app with dev-client and test tooling`

---

#### W0.2: TDD Test Harness
**Category**: `quick` | **Skills**: Jest, Testing Library

**Files to create**:
- `jest.config.ts` - jest-expo preset, transformIgnorePatterns for @rnmapbox
- `jest.setup.ts` - AsyncStorage mock, Mapbox mock
- `src/test-utils/render.tsx` - Custom render with providers
- `src/test-utils/mapboxMock.tsx` - Mock MapView, Camera, markers
- `src/__tests__/App.test.tsx` - Trivial render test

**Success criteria**:
- `npm test` runs and passes
- Mapbox and AsyncStorage are mockable without native crashes

**Commit**: (combined with W0.1)

---

### Wave 1: Domain & Shell (Parallel: W1.A, W1.B, W1.C)

#### W1.A: Itinerary Domain Contracts
**Category**: `deep` | **Skills**: TypeScript, Zod/io-ts, Jest

**Files to create**:
- `src/features/itinerary/domain/types.ts`:
  ```typescript
  type TransportMode = 'walking' | 'transit';
  type ItineraryStop = {
    id: string;
    name: string;
    description: string;
    suggestedTime: string; // ISO time or HH:MM
    coordinates?: [number, number]; // [lng, lat]
    transportFromPrevious?: TransportMode;
    durationFromPrevious?: number; // minutes
  };
  type Itinerary = {
    id: string;
    title: string;
    summary: string;
    stops: ItineraryStop[];
    createdAt: string;
  };
  ```
- `src/features/itinerary/domain/schema.ts` - Zod schema for validation
- `src/features/itinerary/domain/fixtures.ts` - Test fixtures
- `src/features/itinerary/__tests__/schema.test.ts` - Validation tests

**Success criteria**:
- Tests prove invalid payloads are rejected
- Stops are ordered correctly
- Transport mode constrained to walking/transit

**Commit**: `test: add itinerary schema contracts and fixtures`

---

#### W1.B: Material 3 App Shell
**Category**: `visual-engineering` | **Skills**: React Navigation, React Native Paper

**Files to create**:
- `src/app/providers/AppProviders.tsx` - Paper provider, NavigationContainer
- `src/navigation/RootNavigator.tsx` - Stack navigator (Home → Itinerary)
- `src/navigation/types.ts` - Typed navigation
- `src/screens/HomeScreen.tsx` - Placeholder with title
- `src/screens/ItineraryScreen.tsx` - Placeholder with map area + list area
- `src/theme/theme.ts` - Material 3 colors, typography

**Success criteria**:
- Navigation smoke test passes
- Theme loads correctly
- Can navigate from Home to Itinerary screen

**Commit**: `feat: add navigation shell and material theme`

---

#### W1.C: Runtime Config & Errors
**Category**: `quick` | **Skills**: Expo config, Error handling

**Files to create**:
- `src/lib/env.ts`:
  ```typescript
  export const env = {
    openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
  };
  export const assertEnv = () => {
    if (!env.openaiApiKey) throw new ConfigError('Missing OPENAI_API_KEY');
    if (!env.mapboxAccessToken) throw new ConfigError('Missing MAPBOX_ACCESS_TOKEN');
  };
  ```
- `src/lib/errors.ts` - ConfigError, ApiError, GeocodingError classes
- `src/lib/constants.ts` - App-wide constants

**Success criteria**:
- Missing env values fail loudly in development
- No hardcoded secrets in source

**Commit**: `feat: add runtime config and session cache`

---

### Wave 2: Services (Parallel: W2.A, W2.B, W2.C)

#### W2.A: AI Itinerary Generation
**Category**: `deep` | **Skills**: OpenAI SDK, Prompt Engineering

**Files to create**:
- `src/features/itinerary/services/openaiItineraryService.ts`:
  ```typescript
  export async function generateItinerary(prompt: string): Promise<Itinerary> {
    const systemPrompt = buildPrompt(prompt);
    const response = await openai.chat.completions.create({...});
    return normalizeResponse(response);
  }
  ```
- `src/features/itinerary/services/promptBuilder.ts` - System prompt construction
- `src/features/itinerary/services/normalizer.ts` - JSON → typed Itinerary
- `src/features/itinerary/__tests__/openaiItineraryService.test.ts`

**Success criteria**:
- Mocked OpenAI responses produce typed itineraries
- Malformed output handled with recoverable error state
- Transport modes normalized to walking/transit only

**Commit**: `feat: generate validated itineraries from AI prompts`

---

#### W2.B: Session State & Cache
**Category**: `deep` | **Skills**: AsyncStorage, State Management

**Files to create**:
- `src/features/planner/state/plannerReducer.ts`:
  ```typescript
  type PlannerState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    itinerary: Itinerary | null;
    error: string | null;
  };
  ```
- `src/features/storage/sessionCache.ts`:
  ```typescript
  export const sessionCache = {
    save: (itinerary: Itinerary) => AsyncStorage.setItem(CACHE_KEY, JSON.stringify(itinerary)),
    restore: async () => { /* with session timestamp check */ },
    clear: () => AsyncStorage.multiRemove([CACHE_KEY, SESSION_ID_KEY]),
  };
  ```
- `src/features/storage/__tests__/sessionCache.test.ts`

**Success criteria**:
- Current itinerary restorable during session
- Cold launch clears stale data
- Session ID generated on first launch

**Commit**: (combined with W1.C)

---

#### W2.C: Mapbox Geocoding
**Category**: `deep` | **Skills**: Mapbox API, HTTP

**Files to create**:
- `src/features/geocoding/services/mapboxGeocodingService.ts`:
  ```typescript
  export async function geocodePlace(name: string, context?: { near?: [number, number] }): Promise<Coordinates | null>;
  export async function enrichItinerary(itinerary: Itinerary): Promise<Itinerary>;
  ```
- `src/features/geocoding/__tests__/mapboxGeocodingService.test.ts`

**Success criteria**:
- Place names resolve to coordinates
- Unresolved stops surfaced clearly for UI fallback
- Rate limiting handled gracefully

**Commit**: `feat: geocode itinerary stops with mapbox`

---

### Wave 3: UI & Routing (Parallel: W3.A, W3.B, W3.C)

#### W3.A: Planner Search & Itinerary List
**Category**: `visual-engineering` | **Skills**: React Native UI, Forms

**Files to create**:
- `src/features/search/components/PlannerSearchBar.tsx` - Search input with submit
- `src/features/itinerary/components/StopCard.tsx` - Material 3 card for stop
- `src/features/itinerary/components/ItineraryList.tsx` - FlatList of stops
- `src/screens/HomeScreen.tsx` - Updated with search bar
- `src/features/search/__tests__/PlannerSearchBar.test.tsx`

**Success criteria**:
- User can enter prompt and submit
- Loading state displays
- Stops render with times and descriptions
- Material 3 styling consistent

**Commit**: `feat: render itinerary list and planner search flow`

---

#### W3.B: Map View with Markers
**Category**: `visual-engineering` | **Skills**: Mapbox RN, GeoJSON

**Files to create**:
- `src/features/map/components/ItineraryMap.tsx`:
  ```tsx
  <MapView styleURL="mapbox://styles/mapbox/streets-v12">
    <Camera />
    <StopMarkers stops={stops} selectedId={selectedId} />
    <RouteLines routes={routes} />
  </MapView>
  ```
- `src/features/map/components/StopMarkers.tsx` - PointAnnotation for each stop
- `src/features/map/hooks/useFitCamera.ts` - Fit all markers in view
- `src/features/map/__tests__/ItineraryMap.test.tsx`

**Success criteria**:
- Markers render from itinerary data
- Selecting stop updates marker focus
- Camera fits all markers automatically

**Commit**: `feat: show itinerary stops on mapbox map`

---

#### W3.C: Routing Service Layer
**Category**: `deep` | **Skills**: Mapbox Directions, Transit APIs

**Files to create**:
- `src/features/routing/types.ts`:
  ```typescript
  type RouteSegment = {
    mode: 'walking' | 'transit';
    duration: number; // minutes
    distance: number; // meters
    geometry?: GeoJSON.LineString;
    transitDetails?: TransitDetails;
  };
  ```
- `src/features/routing/services/mapboxWalkingService.ts` - Mapbox Directions walking profile
- `src/features/routing/services/transitRouteService.ts` - Adapter for transit provider (OpenTripPlanner/Google)
- `src/features/routing/services/routingService.ts` - Unified routing interface
- `src/features/routing/__tests__/routingService.test.ts`

**Success criteria**:
- Walking routes return geometry and summaries
- Transit routes normalized through adapter
- Graceful degradation when transit unavailable

**Commit**: `feat: add walking and transit routing adapters`

---

### Wave 4: Integration (Parallel: W4.A, W4.B, W4.C)

#### W4.A: End-to-End Orchestration
**Category**: `deep` | **Skills**: Async Flow, State Management

**Files to create**:
- `src/features/planner/hooks/usePlanTrip.ts`:
  ```typescript
  export function usePlanTrip() {
    const [state, dispatch] = useReducer(plannerReducer, initialState);
    
    const planTrip = async (prompt: string) => {
      dispatch({ type: 'START' });
      try {
        const itinerary = await generateItinerary(prompt);
        const enriched = await enrichItinerary(itinerary);
        const routes = await computeRoutes(enriched.stops);
        dispatch({ type: 'SUCCESS', itinerary: enriched, routes });
      } catch (error) {
        dispatch({ type: 'ERROR', error });
      }
    };
    
    return { state, planTrip };
  }
  ```
- Update `src/screens/HomeScreen.tsx` - Wire up usePlanTrip
- Update `src/screens/ItineraryScreen.tsx` - Display results

**Success criteria**:
- Single prompt produces full itinerary
- Results visible in list and map views
- Error states handled gracefully

**Commit**: `feat: orchestrate end-to-end planning flow`

---

#### W4.B: Permissions & Error States
**Category**: `visual-engineering` | **Skills**: Expo Permissions, UX

**Files to create**:
- `src/features/location/hooks/useForegroundLocation.ts` - expo-location wrapper
- `src/components/StateView.tsx` - Empty/loading/error states
- `src/components/ErrorNotice.tsx` - Retryable error display
- Update `src/screens/ItineraryScreen.tsx` - Integrate states

**Success criteria**:
- Location denial doesn't break planning
- API/network failures show retryable states
- Material 3 consistent styling

**Commit**: `feat: add permission handling and error states`

---

#### W4.C: Simulator Smoke Tests
**Category**: `unspecified-low` | **Skills**: Detox or Maestro

**Files to create**:
- `e2e/planner.smoke.e2e.ts`:
  ```typescript
  describe('Planner Flow', () => {
    it('completes search to itinerary flow', async () => {
      await element(by.id('search-input')).typeText('Coffee shops in Shoreditch');
      await element(by.id('search-submit')).tap();
      await waitFor(element(by.id('itinerary-list'))).toBeVisible();
      await element(by.id('view-map-button')).tap();
      await waitFor(element(by.id('itinerary-map'))).toBeVisible();
    });
  });
  ```
- `.detoxrc.js` or `maestro/planner-smoke.yaml`

**Success criteria**:
- Test runs on iOS Simulator
- Test runs on Android Emulator
- Covers: prompt entry → itinerary render → map screen → markers present

**Commit**: `test: add simulator smoke coverage for planner flow`

---

### Wave 5: Polish

#### W5.1: Hardening
**Category**: `unspecified-low` | **Skills**: TypeScript, Refactoring

**Files to modify**: Touch-ups across `src/` based on test/build failures

**Success criteria**:
- No TypeScript errors
- All tests green
- No duplicate data transformations
- Clean error boundaries

**Commit**: `fix: address edge cases and integration issues`

---

#### W5.2: Documentation
**Category**: `writing` | **Skills**: Technical Writing

**Files to modify**:
- `README.md`:
  ```markdown
  # Meander
  
  AI-powered itinerary planner with maps.
  
  ## Setup
  
  1. Install dependencies: `npm install`
  2. Copy `.env.example` to `.env` and add keys
  3. Run prebuild: `npx expo prebuild`
  4. Run on iOS: `npx expo run:ios`
  5. Run on Android: `npx expo run:android`
  
  ## Known Limitations
  
  - Public transit routing requires external provider (Mapbox doesn't support it)
  - OpenAI key exposed in client - use backend proxy for production
  
  ## Testing
  
  - Unit: `npm test`
  - E2E: `npm run test:e2e`
  ```

**Success criteria**:
- Fresh developer can run app from README
- Transit/OpenAI caveats documented

**Commit**: `docs: document local setup and known platform limits`

---

## Parallel Execution Graph

```
Wave 0: W0.1 ──► W0.2
         │
         ▼
Wave 1: ┌─────┬─────┬─────┐
        │W1.A │W1.B │W1.C │  (parallel)
        └─────┴─────┴─────┘
              │
              ▼
Wave 2: ┌─────┬─────┬─────┐
        │W2.A │W2.B │W2.C │  (parallel)
        └─────┴─────┴─────┘
              │
              ▼
Wave 3: ┌─────┬─────┬─────┐
        │W3.A │W3.B │W3.C │  (parallel)
        └─────┴─────┴─────┘
              │
              ▼
Wave 4: ┌─────┬─────┬─────┐
        │W4.A │W4.B │W4.C │  (parallel)
        └─────┴─────┴─────┘
              │
              ▼
Wave 5: W5.1 ──► W5.2
```

---

## Verification Gates

| Gate | Wave | Criteria |
|------|------|----------|
| G1 | W0 | Bootstrap builds on both `expo run:ios` and `expo run:android` |
| G2 | W1 | Unit/component tests green |
| G3 | W2 | Prompt → structured itinerary → geocoded stops works with mocked network |
| G4 | W3 | Live simulator shows search results, map markers, route overlays |
| G5 | W4 | Cold relaunch clears prior itinerary (session-only behavior) |
| G6 | W5 | README reproduces local dev-client setup |

---

## Atomic Commit Strategy

1. `chore: bootstrap expo app with dev-client and test tooling` (W0)
2. `test: add itinerary schema contracts and fixtures` (W1.A)
3. `feat: add navigation shell and material theme` (W1.B)
4. `feat: add runtime config and session cache` (W1.C + W2.B)
5. `feat: generate validated itineraries from AI prompts` (W2.A)
6. `feat: geocode itinerary stops with mapbox` (W2.C)
7. `feat: render itinerary list and planner search flow` (W3.A)
8. `feat: show itinerary stops on mapbox map` (W3.B)
9. `feat: add walking and transit routing adapters` (W3.C)
10. `feat: orchestrate end-to-end planning flow` (W4.A)
11. `feat: add permission handling and error states` (W4.B)
12. `test: add simulator smoke coverage for planner flow` (W4.C)
13. `fix: address edge cases and integration issues` (W5.1)
14. `docs: document local setup and known platform limits` (W5.2)

---

## Transit Routing Decision

**Problem**: Mapbox Directions API does NOT support public transit routing.

**Solution Options**:
1. **OpenTripPlanner** (recommended) - Open-source, self-hosted, GTFS-compatible
2. **Google Directions API** - Paid, supports transit, requires separate key
3. **Citymapper/TfL APIs** - Limited coverage, city-specific

**Default Choice**: OpenTripPlanner adapter behind `transitRouteService.ts`

**If user prefers different provider**: Only Wave 3 task W3.C needs adjustment.

---

## Environment Variables Required

```bash
# .env
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...

# For EAS Build (set in secrets)
RNMAPBOX_MAPS_DOWNLOAD_TOKEN=sk.ey...  # With DOWNLOADS:READ scope
```

---

## Commands Reference

```bash
# Development
npm install
npx expo prebuild
npx expo run:ios
npx expo run:android

# Testing
npm test
npm run test:watch
npm run test:coverage

# E2E
npm run test:e2e:ios
npm run test:e2e:android

# Build
eas build --profile development --platform ios
eas build --profile development --platform android
```
