import { geocodePlace, enrichItineraryStop, enrichItinerary } from '../services/mapboxGeocodingService';

global.fetch = jest.fn();

describe('geocodePlace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns coordinates for valid place', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          features: [{ center: [-0.1276, 51.5074], place_name: 'London, UK' }],
        }),
    });

    const result = await geocodePlace('London');
    expect(result).not.toBeNull();
    expect(result?.coordinates).toEqual([-0.1276, 51.5074]);
  });

  it('returns null when no features found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ features: [] }),
    });

    const result = await geocodePlace('Nonexistent Place XYZ123');
    expect(result).toBeNull();
  });

  it('returns null on fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await geocodePlace('London');
    expect(result).toBeNull();
  });
});

describe('enrichItineraryStop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing coordinates without geocoding', async () => {
    const stop = {
      id: '1',
      name: 'Test',
      description: '',
      coordinates: [-0.1, 51.5] as [number, number],
    };

    const { stop: enriched, error } = await enrichItineraryStop(stop);
    expect(enriched.coordinates).toEqual([-0.1, 51.5]);
    expect(error).toBeUndefined();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('geocodes stop without coordinates', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          features: [{ center: [-0.12, 51.51], place_name: 'Big Ben' }],
        }),
    });

    const stop = { id: '1', name: 'Big Ben', description: '' };
    const { stop: enriched } = await enrichItineraryStop(stop);
    expect(enriched.coordinates).toEqual([-0.12, 51.51]);
  });
});

describe('enrichItinerary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enriches all stops in itinerary', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            features: [{ center: [-0.1, 51.5], place_name: 'Stop 1' }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            features: [{ center: [-0.2, 51.6], place_name: 'Stop 2' }],
          }),
      });

    const itinerary = {
      id: '1',
      title: 'Test',
      summary: '',
      stops: [
        { id: '1', name: 'Stop 1', description: '' },
        { id: '2', name: 'Stop 2', description: '' },
      ],
    };

    const { enriched, errors } = await enrichItinerary(itinerary);
    expect(enriched.stops).toHaveLength(2);
    expect(enriched.stops[0].coordinates).toEqual([-0.1, 51.5]);
    expect(enriched.stops[1].coordinates).toEqual([-0.2, 51.6]);
    expect(errors).toHaveLength(0);
  });
});
