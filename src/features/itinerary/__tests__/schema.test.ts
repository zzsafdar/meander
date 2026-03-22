import { itinerarySchema, itineraryStopSchema, Itinerary, ItineraryStop } from './schema';

import { createMinimalItinerary } from './fixtures';

describe('itinerary domain schema', () => {
  describe('itineraryStopSchema', () => {
    it('validates a minimal stop', () => {
      const result = itineraryStopSchema.safeParse({
        id: 'stop-1',
        name: 'Test Cafe',
        description: 'A test stop',
        suggestedTime: '09:00',
      });
      expect(result.success).toBe(true);
    });

    it('rejects stop without id', () => {
      const result = itineraryStopSchema.safeParse({
        name: 'Test Cafe',
        description: 'A test stop',
      });
      expect(result.success).toBe(false);
    });

    it('rejects stop without name', () => {
      const result = itineraryStopSchema.safeParse({
        id: 'stop-1',
        description: 'A test stop',
      });
      expect(result.success).toBe(false);
    });
    it('rejects stop with invalid transport mode', () => {
      const result = itineraryStopSchema.safeParse({
        id: 'stop-1',
        name: 'Test Cafe',
        description: 'A test stop',
        suggestedTime: '09:00',
        transportFromPrevious: 'driving' as TransportMode,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(['transportFromPrevious']);
    });

    it('accepts valid transport modes', () => {
      const walkingResult = itineraryStopSchema.safeParse({
        id: 'stop-1',
        name: 'Test Cafe',
        description: 'A test stop',
        suggestedTime: '09:00',
        transportFromPrevious: 'walking',
      });
      expect(walkingResult.success).toBe(true);

      const transitResult = itineraryStopSchema.safeParse({
        id: 'stop-1',
        name: 'Test Cafe',
        description: 'A test stop',
        suggestedTime: '09:00',
        transportFromPrevious: 'transit',
      });
      expect(transitResult.success).toBe(true);
    });
  });

  describe('itinerarySchema', () => {
    it('validates a complete itinerary', () => {
      const minimal = createMinimalItinerary();
      const result = itinerarySchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it('rejects itinerary without stops', () => {
      const result = itinerarySchema.safeParse({
        id: 'itinerary-1',
        title: 'Test Itinerary',
        summary: 'A test',
        createdAt: '2024-01-01T00:00:00Z',
      });
      expect(result.success).toBe(false);
    });

    it('rejects itinerary with empty stops array', () => {
      const result = itinerarySchema.safeParse({
        id: 'itinerary-1',
        title: 'Test Itinerary',
        summary: 'A test',
        stops: [],
        createdAt: '2024-01-01T00:00:00Z',
      });
      expect(result.success).toBe(false);
    });
  });
});
