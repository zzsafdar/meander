import OpenAI from 'openai';
import { env } from '../../../lib/env';
import { ApiError } from '../../../lib/errors';
import { AI } from '../../../lib/constants';
import type { Itinerary } from '../domain/types';
import { itinerarySchema } from '../domain/schema';

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a travel planning assistant. Generate detailed day itineraries based on user requests.

CRITICAL: You must respond with ONLY a valid JSON object matching this exact structure:
{
  "id": "unique-id-string",
  "title": "Itinerary Title",
  "summary": "Brief description of the day",
  "stops": [
    {
      "id": "stop-1",
      "name": "Venue Name",
      "description": "What to expect",
      "suggestedTime": "09:00",
      "transportFromPrevious": "walking",
      "durationFromPrevious": 15
    }
  ]
}

Requirements:
- Generate 3-6 stops for a day
- Include realistic venue names
- Use "walking" or "transit" for transportFromPrevious
- durationFromPrevious is in minutes
- Times should flow logically through the day
- DO NOT include markdown formatting, only pure JSON`;

export async function generateItinerary(prompt: string): Promise<Itinerary> {
  try {
    const response = await openai.chat.completions.create({
      model: AI.MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: AI.MAX_TOKENS,
      temperature: AI.TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError('No response from AI');
    }

    const parsed = JSON.parse(content);
    const validated = itinerarySchema.parse(parsed);

    return {
      ...validated,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError('Failed to parse AI response as JSON');
    }
    throw error;
  }
}
