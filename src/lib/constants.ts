export const APP_NAME = 'Meander';

export const STORAGE_KEYS = {
  ITINERARY_CACHE: '@meander/itinerary_cache',
  SESSION_ID: '@meander/session_id',
  USER_PREFERENCES: '@meander/user_preferences',
} as const;

export const MAPBOX = {
  DEFAULT_STYLE: 'mapbox://styles/mapbox/streets-v12',
  DEFAULT_ZOOM: 12,
  DEFAULT_PADDING: 50,
} as const;

export const ROUTING = {
  WALKING_SPEED_KMH: 5,
  TRANSIT_BUFFER_MINUTES: 5,
} as const;

export const AI = {
  MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
} as const;
