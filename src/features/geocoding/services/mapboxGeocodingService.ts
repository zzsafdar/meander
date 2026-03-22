import { env } from '../../../lib/env';
import type {
  Itinerary,
  ItineraryStop,
  EnrichedItinerary,
  EnrichedItineraryStop,
  Coordinates,
} from '../../itinerary/domain/types';
import type { GeocodingResult, GeocodingError as GeocodingErrorInfo } from '../types';

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export async function geocodePlace(
  name: string,
  context?: { near?: Coordinates; bbox?: [number, number, number, number] }
): Promise<GeocodingResult | null> {
  const token = env.mapboxAccessToken;
  if (!token) {
    return null;
  }

  const params = new URLSearchParams({
    access_token: token,
    limit: '1',
    types: 'poi,address,place,locality',
  });

  if (context?.near) {
    params.set('proximity', `${context.near[0]},${context.near[1]}`);
  }
  if (context?.bbox) {
    params.set('bbox', context.bbox.join(','));
  }

  const encodedName = encodeURIComponent(name);
  const url = `${MAPBOX_GEOCODING_URL}/${encodedName}.json?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const feature = data.features?.[0];

    if (!feature || !feature.center) {
      return null;
    }

    return {
      name: feature.place_name || name,
      coordinates: feature.center as Coordinates,
      placeType: feature.place_type?.[0],
    };
  } catch {
    return null;
  }
}

export async function enrichItineraryStop(
  stop: ItineraryStop,
  context?: { near?: Coordinates }
): Promise<{ stop: EnrichedItineraryStop; error?: GeocodingErrorInfo }> {
  if (stop.coordinates) {
    return {
      stop: {
        ...stop,
        coordinates: stop.coordinates,
        resolvedName: stop.name,
      },
    };
  }

  const result = await geocodePlace(stop.name, context);

  if (!result) {
    return {
      stop: {
        ...stop,
        coordinates: [0, 0] as Coordinates,
        resolvedName: stop.name,
      },
      error: { placeName: stop.name, reason: 'Could not geocode' },
    };
  }

  return {
    stop: {
      ...stop,
      coordinates: result.coordinates,
      resolvedName: result.name,
    },
  };
}

export async function enrichItinerary(
  itinerary: Itinerary
): Promise<{ enriched: EnrichedItinerary; errors: GeocodingErrorInfo[] }> {
  const errors: GeocodingErrorInfo[] = [];
  const enrichedStops: EnrichedItineraryStop[] = [];

  for (let i = 0; i < itinerary.stops.length; i++) {
    const stop = itinerary.stops[i];
    const previousCoordinates = i > 0 ? enrichedStops[i - 1]?.coordinates : undefined;

    const { stop: enrichedStop, error } = await enrichItineraryStop(stop, {
      near: previousCoordinates,
    });

    enrichedStops.push(enrichedStop);
    if (error) {
      errors.push(error);
    }
  }

  return {
    enriched: {
      ...itinerary,
      stops: enrichedStops,
    },
    errors,
  };
}
