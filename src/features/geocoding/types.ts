import type { Coordinates } from '../itinerary/domain/types';

export interface GeocodingResult {
  name: string;
  coordinates: Coordinates;
  placeType?: string;
}

export interface GeocodingError {
  placeName: string;
  reason: string;
}
