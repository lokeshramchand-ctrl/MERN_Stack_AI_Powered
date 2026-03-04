const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const { buildPromptByMode } = require('./promptBuilder.service');
const { createHttpError } = require('../utils/httpError');

const PROVIDERS = {
  openai: 'openai',
  gemini: 'gemini',
  auto: 'auto',
};

function resolveProvider(requestedProvider) {
  const normalized = (requestedProvider || '').toLowerCase();

  if (normalized === PROVIDERS.openai || normalized === PROVIDERS.gemini) {
    return normalized;
  }

  const envPreferred = (process.env.AI_PROVIDER || PROVIDERS.auto).toLowerCase();

  if (envPreferred === PROVIDERS.openai || envPreferred === PROVIDERS.gemini) {
    return envPreferred;
  }

  if (process.env.OPENAI_API_KEY) {
    return PROVIDERS.openai;
  }

  if (process.env.GEMINI_API_KEY) {
    return PROVIDERS.gemini;
  }

  throw createHttpError(
    500,
    'No AI provider configured. Add OPENAI_API_KEY or GEMINI_API_KEY.'
  );
}

async function callOpenAI(systemPrompt, userPrompt, expectsJson) {
  if (!process.env.OPENAI_API_KEY) {
    throw createHttpError(500, 'OPENAI_API_KEY is missing.');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: expectsJson ? { type: 'json_object' } : { type: 'text' },
  });

  return completion.choices?.[0]?.message?.content?.trim() || '';
}

async function callGemini(systemPrompt, userPrompt, expectsJson) {
  if (!process.env.GEMINI_API_KEY) {
    throw createHttpError(500, 'GEMINI_API_KEY is missing.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: expectsJson
      ? {
          temperature: 0.2,
          responseMimeType: 'application/json',
        }
      : {
          temperature: 0.3,
        },
  });

  return result.response.text().trim();
}

async function generateResponse({ prompt, mode, provider }) {
  const providerUsed = resolveProvider(provider);
  const { systemPrompt, userPrompt, expectsJson } = buildPromptByMode(mode, prompt);

  const text =
    providerUsed === PROVIDERS.openai
      ? await callOpenAI(systemPrompt, userPrompt, Boolean(expectsJson))
      : await callGemini(systemPrompt, userPrompt, Boolean(expectsJson));

  return {
    providerUsed,
    text,
  };
}

module.exports = {
  PROVIDERS,
  generateResponse,
};
