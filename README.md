# AI-Powered Student Assistant (MERN + AI Integration)

A small MERN-style assignment project with:
- **Frontend:** React (functional components)
- **Backend:** Node.js + Express
- **AI Providers:** OpenAI and Google Gemini

The app accepts user input, lets the user choose a task mode, then returns AI-generated output from an LLM API.

## Features

- Textarea for user input
- Task mode dropdown
- Submit button
- Loading indicator while generating
- AI response display section
- Backend validation and error handling
- Structured prompt engineering (no raw passthrough prompts)
- Dual provider support (OpenAI + Gemini)

## Task Modes

- `explain` → Explain a concept
- `mcq` → Generate multiple-choice questions
- `summarize` → Summarize text
- `improve` → Improve writing quality

## Project Structure

```
client/
  src/
    components/
      AssistantForm.jsx
      ResponsePanel.jsx
    pages/
      HomePage.jsx
    services/
      aiService.js
    App.jsx
    main.jsx
    styles.css
  index.html
  package.json

server/
  controllers/
    ai.controller.js
  routes/
    ai.routes.js
  services/
    ai.service.js
    promptBuilder.service.js
  utils/
    httpError.js
  app.js
  server.js
  package.json
```

## Setup

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Configure environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
AI_PROVIDER=auto

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> API keys must stay in `.env` and must not be committed.

### 3) Run the apps

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API

### POST `/api/ai/generate`

Request body:

```json
{
  "prompt": "Explain JavaScript closures",
  "mode": "explain"
}
```

Optional field:

```json
{
  "provider": "openai"
}
```

Supported provider values: `openai`, `gemini`, `auto`.

Response:

```json
{
  "mode": "explain",
  "providerUsed": "openai",
  "response": "..."
}
```

## Prompt Engineering Explanation (Mandatory)

### 1) How prompts are structured

For every mode, prompts are built in `server/services/promptBuilder.service.js` using:

1. **Role definition** (system behavior and expertise)
2. **Context** (student-learning scenario)
3. **Rules/constraints** (length, style, correctness, uncertainty handling)
4. **Output format instructions** (plain text or strict JSON)

This avoids sending raw user text directly to the model and gives predictable output quality.

### 2) How different modes affect prompt generation

- **Explain (`explain`)**
  - Role: university instructor for beginners
  - Constraint: simple language, under 150 words
  - Output: plain text explanation

- **Generate MCQs (`mcq`)**
  - Role: assessment designer
  - Constraint: exactly 3 questions, 4 options each, one correct answer
  - Output: strict JSON (`questions`, `options`, `correctAnswerIndex`, `explanation`, `uncertainty`)

- **Summarize (`summarize`)**
  - Role: academic study assistant
  - Constraint: 80–130 words, preserve key points
  - Output: plain text summary

- **Improve writing (`improve`)**
  - Role: writing coach
  - Constraint: fix grammar/clarity while preserving original meaning
  - Output: plain text improved version

### 3) Why prompt constraints were chosen

- **Consistency:** Structured prompts make output easier to control and evaluate.
- **Safety/Reliability:** Guardrails instruct model to acknowledge uncertainty instead of fabricating facts.
- **Format compliance:** MCQ mode enforces JSON so frontend/backend can parse or validate downstream.
- **Student-focused clarity:** Word limits and simple language keep responses useful for learning.

## Notes

- This assignment does not require database persistence, so MongoDB is not used for storage.
- The codebase still follows a MERN-style split (`client` + `server`) and can be extended with MongoDB later.
# MERN_Stack_AI_Powered
