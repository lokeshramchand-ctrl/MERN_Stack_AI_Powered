import { useState } from 'react';

const TASK_MODES = [
  { value: 'explain', label: 'Explain a concept' },
  { value: 'mcq', label: 'Generate multiple-choice questions' },
  { value: 'summarize', label: 'Summarize text' },
  { value: 'improve', label: 'Improve writing quality' },
];

function AssistantForm({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState(TASK_MODES[0].value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    await onSubmit({
      prompt: prompt.trim(),
      mode,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="prompt">Enter your question or text</label>
      <textarea
        id="prompt"
        rows="7"
        placeholder="Example: Explain JavaScript closures in simple terms"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        disabled={loading}
      />

      <label htmlFor="mode">Select task mode</label>
      <select
        id="mode"
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        disabled={loading}
      >
        {TASK_MODES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading || !prompt.trim()}>
        {loading ? 'Generating...' : 'Submit'}
      </button>
    </form>
  );
}

export default AssistantForm;
