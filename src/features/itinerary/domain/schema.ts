import { z } from 'zod';

export const transportModeSchema = z.enum(['walking', 'transit']);

export const coordinatesSchema = z.tuple([z.number(), z.number()]);

export const itineraryStopSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
  suggestedTime: z.string().optional(),
  coordinates: coordinatesSchema.optional(),
  transportFromPrevious: transportModeSchema.optional(),
  durationFromPrevious: z.number().min(0).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const itinerarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(''),
  stops: z.array(itineraryStopSchema).min(1, 'Itinerary must have at least one stop'),
  createdAt: z.string().datetime().optional(),
});

export type ItineraryStopSchema = z.infer<typeof itineraryStopSchema>;
export type ItinerarySchema = z.infer<typeof itinerarySchema>;
export type TransportModeSchema = z.infer<typeof transportModeSchema>;

export function parseItineraryResponse(data: unknown): ItinerarySchema {
  return itinerarySchema.parse(data);
}

export function safeParseItineraryResponse(data: unknown): ItinerarySchema | null {
  const result = itinerarySchema.safeParse(data);
  return result.success ? result.data : null;
}
