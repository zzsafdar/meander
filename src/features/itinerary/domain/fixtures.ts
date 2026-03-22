import type { Itinerary, ItineraryStop } from './types';

export function createMinimalItinerary(): Itinerary {
  return {
    id: 'test-itinerary-1',
    title: 'Test Itinerary',
    summary: 'A simple test itinerary',
    stops: [
      {
        id: 'stop-1',
        name: 'First Stop',
        description: 'Start here',
        suggestedTime: '09:00',
        transportFromPrevious: 'walking',
      },
      {
        id: 'stop-2',
        name: 'Second Stop',
        description: 'Coffee break',
        suggestedTime: '10:00',
        coordinates: [-0.0998, 51.5034],
        transportFromPrevious: 'walking',
        durationFromPrevious: 15,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  };
}

export function createItineraryWithMultipleStops(): Itinerary {
  return {
    id: 'test-itinerary-2',
    title: 'London Coffee Tour',
    summary: 'Explore the best coffee shops in Shoreditch',
    stops: [
      {
        id: 'stop-1',
        name: 'Origin Coffee',
        description: 'Specialty coffee roasters',
        suggestedTime: '09:00',
        coordinates: [-0.0815, 51.5225],
      },
      {
        id: 'stop-2',
        name: 'Workshop Coffee',
        description: 'Award-winning coffee',
        suggestedTime: '10:30',
        coordinates: [-0.0836, 51.5253],
        transportFromPrevious: 'walking',
        durationFromPrevious: 5,
      },
      {
        id: 'stop-3',
        name: 'Ozone Coffee Roasters',
        description: 'London original',
        suggestedTime: '12:00',
        coordinates: [-0.0774, 51.5278],
        transportFromPrevious: 'walking',
        durationFromPrevious: 8,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  };
}

export function createStopWithoutCoordinates(): ItineraryStop {
  return {
    id: 'stop-no-coords',
    name: 'Unknown Location',
    description: 'Needs geocoding',
    suggestedTime: '14:00',
  };
}
