import { getRoute } from '../services/routingService';
import * as mapboxWalkingService from '../services/mapboxWalkingService';
import * as transitRouteService from '../services/transitRouteService';
import type { Coordinates } from '../../itinerary/domain/types';

jest.mock('../services/mapboxWalkingService');
jest.mock('../services/transitRouteService');

const mockFetchDirections = mapboxWalkingService.fetchDirections as jest.Mock;
const mockGetTransitRoute = transitRouteService.getTransitRoute as jest.Mock;

describe('routingService', () => {
  const origin: Coordinates = [-0.1276, 51.5074];
  const destination: Coordinates = [-0.0998, 51.5034];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoute', () => {
    it('returns walking route when mode is walking', async () => {
      mockFetchDirections.mockResolvedValue({
        mode: 'walking',
        duration: 600,
        distance: 1000,
        geometry: {
          type: 'LineString',
          coordinates: [origin, destination],
        },
      });

      const result = await getRoute(origin, destination, 'walking');

      expect(result).not.toBeNull();
      expect(result?.mode).toBe('walking');
      expect(result?.duration).toBe(600);
      expect(result?.distance).toBe(1000);
    });

    it('returns transit route when mode is transit', async () => {
      mockGetTransitRoute.mockResolvedValue({
        mode: 'transit',
        duration: 900,
        distance: 1500,
        geometry: {
          type: 'LineString',
          coordinates: [origin, destination],
        },
        transitDetails: {
          agency: 'TfL',
          routeName: 'Bus 55',
          departureTime: '2024-01-01T10:00:00Z',
          arrivalTime: '2024-01-01T10:15:00Z',
          stops: 5,
        },
      });

      const result = await getRoute(origin, destination, 'transit');

      expect(result).not.toBeNull();
      expect(result?.mode).toBe('transit');
      expect(result?.transitDetails?.agency).toBe('TfL');
    });

    it('returns null when walking route fails', async () => {
      mockFetchDirections.mockResolvedValue(null);

      const result = await getRoute(origin, destination, 'walking');

      expect(result).toBeNull();
    });

    it('returns null when transit route fails', async () => {
      mockGetTransitRoute.mockResolvedValue(null);

      const result = await getRoute(origin, destination, 'transit');

      expect(result).toBeNull();
    });
  });
});
