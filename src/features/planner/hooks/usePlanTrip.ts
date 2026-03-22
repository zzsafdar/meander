import { useState, useCallback } from 'react';
import { generateItinerary } from '../../itinerary/services/openaiItineraryService';
import { geocodePlace } from '../../geocoding/services/mapboxGeocodingService';
import { getRoute } from '../../routing/services/routingService';
import type { Itinerary, ItineraryStop } from '../../itinerary/domain/types';
import type { RouteSegment } from '../../routing/types';

interface UsePlanTripResult {
  itinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
  routes: RouteSegment[];
  planTrip: (prompt: string) => Promise<Itinerary | null>;
  enrichItineraryWithCoords: (itinerary: Itinerary) => Promise<Itinerary>;
  computeRoutesForStops: (stops: ItineraryStop[]) => Promise<void>;
  reset: () => void;
}export function usePlanTrip(): UsePlanTripResult {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteSegment[]>([]);

  const planTrip = useCallback(async (prompt: string): Promise<Itinerary | null> => {
    if (!prompt.trim()) {
      setError('Please enter a destination or activity');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateItinerary(prompt);
      setItinerary(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrichItineraryWithCoords = useCallback(async (itineraryData: Itinerary): Promise<Itinerary> => {
    const enrichedStops = await Promise.all(
      itineraryData.stops.map(async (stop) => {
        if (stop.coordinates) {
          return stop;
        }
        const geocoded = await geocodePlace(stop.name);
        return {
          ...stop,
          coordinates: geocoded?.coordinates || null,
        };
      })
    );

    return {
      ...itineraryData,
      stops: enrichedStops,
    };
  }, []);

  const computeRoutesForStops = useCallback(async (stops: ItineraryStop[]): Promise<void> => {
    const routeSegments: RouteSegment[] = [];

    for (let i = 0; i < stops.length - 1; i++) {
      const origin = stops[i].coordinates;
      const destination = stops[i + 1].coordinates;

      if (origin && destination) {
        const route = await getRoute(origin, destination, 'walking');
        if (route) {
          routeSegments.push(route);
        }
      }
    }

    setRoutes(routeSegments);
  }, []);

  const reset = useCallback(() => {
    setItinerary(null);
    setError(null);
    setRoutes([]);
    setIsLoading(false);
  }, []);

  return {
    itinerary,
    isLoading,
    error,
    routes,
    planTrip,
    enrichItineraryWithCoords,
    computeRoutesForStops,
    reset,
  };
}
