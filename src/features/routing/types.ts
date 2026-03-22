import type { Coordinates } from '../itinerary/domain/types';

export type TransportMode = 'walking' | 'transit';

export interface TransitDetails {
  agency: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
}

export interface RouteSegment {
  mode: TransportMode;
  duration: number;
  distance: number;
  geometry?: GeoJSON.LineString;
  transitDetails?: TransitDetails;
}
