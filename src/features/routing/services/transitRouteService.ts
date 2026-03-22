import type { RouteSegment, TransitDetails } from './types';
import type { Coordinates } from '../../itinerary/domain/types';

/**
 * Get transit route between two coordinates.
 * 
 * NOTE: Mapbox Directions API does NOT support public transit routing.
 * This is a placeholder that returns walking route with transit metadata.
 * 
 * For production, integrate:
 * - OpenTripPlanner (open-source, GTFS-compatible)
 * - Google Directions API (paid, comprehensive transit)
 * - City-specific APIs (TfL, BART, etc.)
 */
export async function getTransitRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteSegment | null> {
  // Placeholder implementation
  // In production, this would call an actual transit routing API
  
  const transitDetails: TransitDetails = {
    agency: 'Local Transit',
    routeName: 'Route 1',
    departureTime: new Date().toISOString(),
    arrivalTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    stops: 3,
  };

  // Estimate based on typical urban transit speed (25 km/h)
  const distanceKm = calculateDistance(origin, destination);
  const durationMinutes = Math.round((distanceKm / 25) * 60 + 10); // +10 min for stops

  return {
    mode: 'transit',
    duration: durationMinutes * 60, // seconds
    distance: distanceKm * 1000, // meters
    geometry: {
      type: 'LineString',
      coordinates: [origin, destination],
    },
    transitDetails,
  };
}

function calculateDistance(origin: Coordinates, destination: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(destination[1] - origin[1]);
  const dLon = toRad(destination[0] - origin[0]);
  const lat1 = toRad(origin[1]);
  const lat2 = toRad(destination[1]);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
