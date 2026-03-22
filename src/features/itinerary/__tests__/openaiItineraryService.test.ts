import { generateItinerary } from '../services/openaiItineraryService';

jest.mock('openai', () => {
  const mockCreate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
    mockCreate,
  };
});

describe('generateItinerary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns validated itinerary on success', async () => {
    const mockResponse = {
      id: 'test-1',
      title: 'Coffee Tour',
      summary: 'A day of coffee',
      stops: [
        { id: 'stop-1', name: 'Cafe A', description: 'Great espresso' },
      ],
    };

    const OpenAI = require('openai');
    OpenAI.mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(mockResponse) } }],
    });

    const result = await generateItinerary('coffee shops in London');
    expect(result.title).toBe('Coffee Tour');
    expect(result.stops).toHaveLength(1);
  });

  it('throws ApiError when AI returns empty response', async () => {
    const OpenAI = require('openai');
    OpenAI.mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    await expect(generateItinerary('test')).rejects.toThrow('No response from AI');
  });

  it('throws when AI returns invalid JSON', async () => {
    const OpenAI = require('openai');
    OpenAI.mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'not valid json' } }],
    });

    await expect(generateItinerary('test')).rejects.toThrow();
  });

  it('throws when AI response fails schema validation', async () => {
    const OpenAI = require('openai');
    OpenAI.mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ invalid: 'data' }) } }],
    });

    await expect(generateItinerary('test')).rejects.toThrow();
  });
});
