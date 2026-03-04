function ResponsePanel({ loading, responseText, errorText, providerUsed }) {
  return (
    <section>
      <h2>AI Response</h2>
      <div className="response-box">
        {loading && 'Generating response...'}
        {!loading && responseText && responseText}
        {!loading && !responseText && 'Your generated response will appear here.'}
      </div>

      {providerUsed && !loading && (
        <p className="meta">Provider: {providerUsed}</p>
      )}

      {errorText && <p className="error-text">{errorText}</p>}
    </section>
  );
}

export default ResponsePanel;
