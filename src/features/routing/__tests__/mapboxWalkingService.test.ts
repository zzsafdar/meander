import { fetchDirections } from '../services/mapboxWalkingService';
import type { Coordinates } from '../../itinerary/domain/types';
import { RoutingError } from '../../../lib/errors';
import { env } from '../../../lib/env';

const mockFetch = jest.spyOn(global, 'fetch');

describe('mapboxWalkingService', () => {
  const origin: Coordinates = [0.0998, 51.5034];
  const destination: Coordinates = [-0.0899, 51.5098];

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns walking route with geometry', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        routes: [
          {
            geometry: {
              type: 'LineString',
              coordinates: [
                [0.0998, 51.5034],
                [-0.0899, 51.5098],
              ],
            },
            duration: 300,
            distance: 1000,
          },
        ],
      }),
    } as Response);

    const result = await fetchDirections(origin, destination);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('mapbox/walking')
    );
    expect(result).not.toBeNull();
    expect(result?.mode).toBe('walking');
    expect(result?.duration).toBe(300);
    expect(result?.distance).toBe(1000);
    expect(result?.geometry).toBeDefined();
  });

  it('throws when no API key configured', async () => {
    const originalToken = env.mapboxAccessToken;
    (env as { mapboxAccessToken: string | null }).mapboxAccessToken = null;

    await expect(fetchDirections(origin, destination)).rejects.toThrow(RoutingError);

    (env as { mapboxAccessToken: string | null }).mapboxAccessToken = originalToken;
  });

  it('throws when API returns error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    await expect(fetchDirections(origin, destination)).rejects.toThrow(RoutingError);
  });

  it('throws when no routes found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ routes: [] }),
    } as Response);

    await expect(fetchDirections(origin, destination)).rejects.toThrow('No routes found');
  });
});
