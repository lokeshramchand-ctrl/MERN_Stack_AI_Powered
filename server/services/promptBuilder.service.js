const MODES = {
  explain: 'explain',
  mcq: 'mcq',
  summarize: 'summarize',
  improve: 'improve',
};

function buildPromptByMode(mode, userInput) {
  const cleanInput = userInput.trim();

  if (mode === MODES.explain) {
    return {
      systemPrompt:
        'You are an experienced university instructor helping beginner students. Be accurate, concise, and transparent about uncertainty.',
      userPrompt: [
        'Task: Explain a concept for a beginner student.',
        'Context: The student is learning this topic for the first time.',
        'Rules:',
        '- Use simple language and short sentences.',
        '- Keep the explanation under 150 words.',
        '- If the concept is unclear, ambiguous, or likely incorrect, state what you are unsure about instead of guessing.',
        '- Do not invent facts or sources.',
        'Output format:',
        '- Return plain text only.',
        `Concept: ${cleanInput}`,
      ].join('\n'),
    };
  }

  if (mode === MODES.mcq) {
    return {
      systemPrompt:
        'You are a careful assessment designer for university-level learning. Prioritize correctness and explicit uncertainty.',
      userPrompt: [
        'Task: Generate multiple-choice questions from the given topic/text.',
        'Context: Questions should help a student practice core understanding.',
        'Rules:',
        '- Create exactly 3 questions.',
        '- Each question must have exactly 4 options.',
        '- Exactly one option must be correct.',
        '- If source information is insufficient, return fewer facts and include uncertainty notes instead of inventing details.',
        '- Do not add markdown or code fences.',
        'Output format (strict JSON):',
        '{',
        '  "questions": [',
        '    {',
        '      "question": "string",',
        '      "options": ["A", "B", "C", "D"],',
        '      "correctAnswerIndex": 0,',
        '      "explanation": "string"',
        '    }',
        '  ],',
        '  "uncertainty": "string"',
        '}',
        `Topic/Text: ${cleanInput}`,
      ].join('\n'),
      expectsJson: true,
    };
  }

  if (mode === MODES.summarize) {
    return {
      systemPrompt:
        'You are an academic study assistant. Summarize accurately and clearly, and avoid unsupported claims.',
      userPrompt: [
        'Task: Summarize the text for a student.',
        'Context: The student needs quick revision notes.',
        'Rules:',
        '- Keep summary between 80 and 130 words.',
        '- Preserve key points and important terms.',
        '- If the text lacks clarity, mention uncertainty briefly.',
        '- Do not fabricate additional details.',
        'Output format:',
        '- Plain text only.',
        `Text: ${cleanInput}`,
      ].join('\n'),
    };
  }

  if (mode === MODES.improve) {
    return {
      systemPrompt:
        'You are a writing coach for students. Improve clarity, grammar, and tone without changing intended meaning.',
      userPrompt: [
        'Task: Improve writing quality.',
        'Context: This is student writing that needs clearer expression.',
        'Rules:',
        '- Correct grammar and awkward phrasing.',
        '- Keep original meaning and core intent.',
        '- Keep output concise and readable.',
        '- If text is too vague to improve reliably, state that uncertainty clearly.',
        'Output format:',
        '- Return only the improved version in plain text.',
        `Original text: ${cleanInput}`,
      ].join('\n'),
    };
  }

  throw new Error('Unsupported mode');
}

module.exports = {
  MODES,
  buildPromptByMode,
};
