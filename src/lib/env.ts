export const env = {
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
} as const;

export function assertEnv(): void {
  if (!env.openaiApiKey) {
    throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY. Add it to your .env file.');
  }
  if (!env.mapboxAccessToken) {
    throw new Error('Missing EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN. Add it to your .env file.');
  }
}

export function hasRequiredEnv(): boolean {
  return Boolean(env.openaiApiKey && env.mapboxAccessToken);
}
