import { RouteSegment } from './types';
import { Coordinates } from '../../itinerary/domain/types';
import { env } from '../../../lib/env';
import { RoutingError } from '../../../lib/errors';

const MAPBOX_WALKING_PROFILE = 'mapbox/walking';
const MAPBOX_BASE_URL = 'https://api.mapbox.com/directions/v5'

export async function fetchDirections(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteSegment> {
  if (!env.mapboxAccessToken) {
    throw new RoutingError('Mapbox access token not configured');
  }

  const coordinates = `${origin[1]},${origin[0]};${destination[1]},${destination[0]}`;

  const response = await fetch(
    `${MAPBOX_BASE_URL}/${MAPBOX_WALKING_PROFILE}/${coordinates}?` +
      `geometries=geojson&` +
      `overview=full&` +
      `access_token=${env.mapboxAccessToken}`
  );

  if (!response.ok) {
    throw new RoutingError(`Walking directions request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new RoutingError('No routes found in response');
  }

  const route = data.routes[0];
  const geometry = route.geometry as GeoJSON.LineString;
  const duration = route.duration;
  const distance = route.distance;

  return {
    mode: 'walking',
    duration,
    distance,
    geometry,
  };
}
