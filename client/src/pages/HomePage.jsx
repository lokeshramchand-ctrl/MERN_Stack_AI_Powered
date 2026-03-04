import { useState } from 'react';

import AssistantForm from '../components/AssistantForm';
import ResponsePanel from '../components/ResponsePanel';
import { generateAIResponse } from '../services/aiService';

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [providerUsed, setProviderUsed] = useState('');

  const handleGenerate = async ({ prompt, mode }) => {
    setLoading(true);
    setErrorText('');

    try {
      const data = await generateAIResponse({ prompt, mode });
      setResponseText(data.response || '');
      setProviderUsed(data.providerUsed || '');
    } catch (error) {
      setErrorText(error.message || 'Something went wrong.');
      setResponseText('');
      setProviderUsed('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>AI-Powered Student Assistant</h1>
        <p className="subtitle">
          Ask a question, choose a task, and get an AI-generated response.
        </p>

        <AssistantForm onSubmit={handleGenerate} loading={loading} />
        <ResponsePanel
          loading={loading}
          responseText={responseText}
          errorText={errorText}
          providerUsed={providerUsed}
        />
      </section>
    </main>
  );
}

export default HomePage;
