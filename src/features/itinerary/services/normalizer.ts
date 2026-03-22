import { z } from 'zod';
import { Itinerary, ItineraryStop, from '../domain/types';

const itineraryStopSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  suggestedTime: z.string(),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  transportFromPrevious: z.enum(['walking', 'transit']).optional(),
  durationFromPrevious: z.number().optional(),
});

export const itinerarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  stops: z.array(itineraryStopSchema).min(1),
  createdAt: z.string(),
});

export function normalizeItineraryResponse(content: string): Itinerary {
  let parsed: Itinerary;
  try {
    const parsed = JSON.parse(content);
    return itinerarySchema.parse(parsed);
  } catch {
    const error = new Error('Failed to parse itinerary response');
    console.error('Itinerary parse error:', error);
    throw error;
  }
}
