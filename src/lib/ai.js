import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Any OpenRouter model slug works; GPT-5.6 tiers: -sol (deep), -terra (balanced), -luna (fast).
export const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-5.6-terra';

// Returns null when no key is configured — routes answer 503 and the client
// falls back to the local heuristics. response-healing lets smaller models
// (e.g. the :free tiers) survive slightly malformed structured output.
export function getModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  const openrouter = createOpenRouter({ apiKey });
  return openrouter(MODEL, { plugins: [{ id: 'response-healing' }] });
}
