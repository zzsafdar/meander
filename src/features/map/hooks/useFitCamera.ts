import { useCallback, useRef } from 'react';
import type MapboxGL from '@rnmapbox/maps';
import type { ItineraryStop } from '../../itinerary/domain/types';

type Coordinates = [number, number]; // [longitude, latitude]

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface UseFitCameraResult {
  cameraRef: React.RefObject<MapboxGL.Camera>;
  fitToStops: (stops: ItineraryStop[]) => void;
  flyToStop: (stop: ItineraryStop) => void;
}

/**
 * Hook to control map camera for fitting stops and flying to specific locations.
 */
export function useFitCamera(): UseFitCameraResult {
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const calculateBounds = useCallback((coordinates: Coordinates[]): Bounds | null => {
    if (coordinates.length === 0) return null;

    const lats = coordinates.map(c => c[1]);
    const lngs = coordinates.map(c => c[0]);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, []);

  const fitToStops = useCallback((stops: ItineraryStop[]) => {
    const stopsWithCoords = stops.filter(
      (stop): stop is ItineraryStop & { coordinates: Coordinates } =>
        stop.coordinates !== undefined && stop.coordinates !== null
    );

    if (stopsWithCoords.length === 0 || !cameraRef.current) return;

    const coordinates = stopsWithCoords.map(s => s.coordinates);

    if (coordinates.length === 1) {
      cameraRef.current.setCamera({
        centerCoordinate: coordinates[0],
        zoomLevel: 14,
        animationDuration: 500,
      });
    } else {
      const bounds = calculateBounds(coordinates);
      if (bounds && cameraRef.current) {
        cameraRef.current.fitBounds(
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
          [50, 50, 50, 250], // padding: top, right, bottom, left
          500 // animation duration
        );
      }
    }
  }, [calculateBounds]);

  const flyToStop = useCallback((stop: ItineraryStop) => {
    if (!stop.coordinates || !cameraRef.current) return;

    cameraRef.current.flyTo(stop.coordinates, 1000);
  }, []);

  return {
    cameraRef,
    fitToStops,
    flyToStop,
  };
}
