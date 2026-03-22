import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeSession, saveItinerary, restoreItinerary, clearSession } from '../sessionCache';

describe('sessionCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeSession', () => {
    it('creates new session when none exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const sessionId = await initializeSession();
      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('returns existing session if recent', async () => {
      const existingId = 'session_existing_123';
      const recentTimestamp = Date.now().toString();

      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) => {
          if (key.includes('session_id')) return Promise.resolve(existingId);
          if (key.includes('timestamp')) return Promise.resolve(recentTimestamp);
          return Promise.resolve(null);
        });

      const sessionId = await initializeSession();
      expect(sessionId).toBe(existingId);
    });
  });

  describe('saveItinerary / restoreItinerary', () => {
    const mockItinerary = {
      id: 'test-1',
      title: 'Test',
      summary: 'Test itinerary',
      stops: [{ id: 'stop-1', name: 'Test Stop', description: '' }],
    };

    it('saves and restores itinerary', async () => {
      await saveItinerary(mockItinerary);
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItinerary));
      const restored = await restoreItinerary();
      expect(restored).toEqual(mockItinerary);
    });

    it('returns null when no cached itinerary', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await restoreItinerary();
      expect(result).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('removes all session data', async () => {
      await clearSession();
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });
});
