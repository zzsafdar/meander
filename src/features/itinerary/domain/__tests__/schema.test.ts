import { parseItineraryResponse, safeParseItineraryResponse } from '../schema';

describe('Itinerary schema tests', () => {
  test('valid itinerary with required fields passes', () => {
    const data = {
      id: 'it1',
      title: 'Morning Ride',
      stops: [{ id: 's1', name: 'Start Point' }]
    };
    expect(() => parseItineraryResponse(data as any)).not.toThrow();
  });

  test('valid itinerary with optional fields passes', () => {
    const data = {
      id: 'it2',
      title: 'Evening Walk',
      summary: 'A nice stroll',
      stops: [{
        id: 's1',
        name: 'Start',
        coordinates: [1, 2],
        transportFromPrevious: 'walking',
        durationFromPrevious: 10,
        suggestedTime: '09:00'
      }],
      createdAt: '2024-01-15T10:30:00.000Z'
    };
    const parsed = parseItineraryResponse(data as any);
    expect(parsed).toBeDefined();
    expect(parsed.summary).toBe('A nice stroll');
  });

  test('invalid itinerary missing required fields fails', () => {
    const missingId = { title: 'No ID', stops: [{ id: 's1', name: 'Stop' }] };
    const missingTitle = { id: 'no-title', stops: [{ id: 's1', name: 'Stop' }] };
    const missingStops = { id: 'no-stops', title: 'No stops' };
    [missingId, missingTitle, missingStops].forEach((d) =>
      expect(() => parseItineraryResponse(d as any)).toThrow()
    );
  });

  test('empty stops array fails', () => {
    const data = { id: 'it3', title: 'Empty stops', stops: [] };
    expect(() => parseItineraryResponse(data as any)).toThrow();
  });

  test('invalid transport mode fails', () => {
    const data = {
      id: 'it4',
      title: 'Bad transport',
      stops: [{ id: 's1', name: 'Stop', transportFromPrevious: 'car' as any }]
    };
    expect(() => parseItineraryResponse(data as any)).toThrow();
  });

  test('coordinates must be [number, number] tuple', () => {
    const valid = {
      id: 'it5',
      title: 'Valid coords',
      stops: [{ id: 's1', name: 'Stop', coordinates: [12.34, 56.78] }]
    };
    expect(() => parseItineraryResponse(valid as any)).not.toThrow();

    const invalid1 = {
      id: 'it5b',
      title: 'Invalid coords',
      stops: [{ id: 's1', name: 'Stop', coordinates: [12.34] }]
    };
    expect(() => parseItineraryResponse(invalid1 as any)).toThrow();

    const invalid2 = {
      id: 'it5c',
      title: 'Invalid coords2',
      stops: [{ id: 's1', name: 'Stop', coordinates: 'not-an-tuple' as any }]
    };
    expect(() => parseItineraryResponse(invalid2 as any)).toThrow();
  });

  test('parseItineraryResponse throws on invalid data', () => {
    const invalid = { foo: 'bar' };
    expect(() => parseItineraryResponse(invalid as any)).toThrow();
  });

  test('safeParseItineraryResponse returns null on invalid data', () => {
    const invalid = { foo: 'bar' };
    const res = safeParseItineraryResponse(invalid as any);
    expect(res).toBeNull();
  });

  test('safeParseItineraryResponse returns parsed data on valid input', () => {
    const valid = { id: 'it6', title: 'Safe itinerary', stops: [{ id: 's1', name: 'Stop' }] };
    const parsed = safeParseItineraryResponse(valid as any);
    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe('it6');
  });

  test('stop missing name fails', () => {
    const data = { id: 'it7', title: 'Missing name', stops: [{ id: 's1' }] };
    expect(() => parseItineraryResponse(data as any)).toThrow();
  });

  test('stop missing id fails', () => {
    const data = { id: 'it8', title: 'Missing stop id', stops: [{ name: 'Stop' }] };
    expect(() => parseItineraryResponse(data as any)).toThrow();
  });
});
