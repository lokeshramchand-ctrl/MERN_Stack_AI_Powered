const { MODES } = require('../services/promptBuilder.service');
const { generateResponse, PROVIDERS } = require('../services/ai.service');
const { createHttpError } = require('../utils/httpError');

const allowedModes = new Set(Object.values(MODES));
const allowedProviders = new Set(Object.values(PROVIDERS));

function validateRequestBody(body) {
  const prompt = body?.prompt;
  const mode = body?.mode;
  const provider = (body?.provider || PROVIDERS.auto).toLowerCase();

  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw createHttpError(400, 'Prompt is required and must be a non-empty string.');
  }

  if (prompt.trim().length > 4000) {
    throw createHttpError(400, 'Prompt must be 4000 characters or less.');
  }

  if (!allowedModes.has(mode)) {
    throw createHttpError(
      400,
      `Mode must be one of: ${Array.from(allowedModes).join(', ')}`
    );
  }

  if (!allowedProviders.has(provider)) {
    throw createHttpError(
      400,
      `Provider must be one of: ${Array.from(allowedProviders).join(', ')}`
    );
  }

  return {
    prompt: prompt.trim(),
    mode,
    provider,
  };
}

async function generateAIOutput(req, res, next) {
  try {
    const payload = validateRequestBody(req.body);
    const result = await generateResponse(payload);

    res.status(200).json({
      mode: payload.mode,
      providerUsed: result.providerUsed,
      response: result.text,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateAIOutput,
};
