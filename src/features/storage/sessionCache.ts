import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../lib/constants';
import type { Itinerary } from '../itinerary/domain/types';

const SESSION_TIMESTAMP_KEY = '@meander/session_timestamp';

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function initializeSession(): Promise<string> {
  const existingId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const existingTimestamp = await AsyncStorage.getItem(SESSION_TIMESTAMP_KEY);

  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);

  if (existingId && existingTimestamp) {
    const timestamp = parseInt(existingTimestamp, 10);
    if (timestamp > fiveMinutesAgo) {
      await AsyncStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
      return existingId;
    }
  }

  await clearSession();
  const newId = generateSessionId();
  await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, newId);
  await AsyncStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
  return newId;
}

export async function saveItinerary(itinerary: Itinerary): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ITINERARY_CACHE, JSON.stringify(itinerary));
}

export async function restoreItinerary(): Promise<Itinerary | null> {
  const cached = await AsyncStorage.getItem(STORAGE_KEYS.ITINERARY_CACHE);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as Itinerary;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ITINERARY_CACHE,
    STORAGE_KEYS.SESSION_ID,
    SESSION_TIMESTAMP_KEY,
  ]);
}

export async function getSessionId(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
}
