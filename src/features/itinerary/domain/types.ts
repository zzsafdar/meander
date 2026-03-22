export type TransportMode = 'walking' | 'transit';

export type Coordinates = [number, number];

export interface ItineraryStop {
  id: string;
  name: string;
  description: string;
  suggestedTime?: string;
  coordinates?: Coordinates;
  transportFromPrevious?: TransportMode;
  durationFromPrevious?: number;
  metadata?: Record<string, unknown>;
}

export interface Itinerary {
  id: string;
  title: string;
  summary: string;
  stops: ItineraryStop[];
  createdAt?: string;
}

export interface EnrichedItineraryStop extends ItineraryStop {
  coordinates: Coordinates;
  resolvedName: string;
}

export interface EnrichedItinerary extends Omit<Itinerary, 'stops'> {
  stops: EnrichedItineraryStop[];
}
