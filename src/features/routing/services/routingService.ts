import type { RouteSegment } from '../types';
import type { Coordinates } from '../../itinerary/domain/types';
import { fetchDirections } from './mapboxWalkingService';
import { getTransitRoute } from './transitRouteService';
import { RoutingError } from '../../../lib/errors';

export async function getRoute(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'walking' | 'transit'
): Promise<RouteSegment | null> {
  try {
    if (mode === 'walking') {
      const walkingRoute = await fetchDirections(origin, destination);
      if (!walkingRoute) return null;
      
      return {
        mode: 'walking',
        duration: walkingRoute.duration,
        distance: walkingRoute.distance,
        geometry: walkingRoute.geometry,
      };
    } else {
      const transitRoute = await getTransitRoute(origin, destination);
      if (!transitRoute) return null;
      
      return {
        mode: 'transit',
        duration: transitRoute.duration,
        distance: transitRoute.distance,
        geometry: transitRoute.geometry,
        transitDetails: transitRoute.transitDetails,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new RoutingError(`Failed to get route: ${message}`);
  }
}

export const routingService = {
  getRoute,
};
