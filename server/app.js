const express = require('express');
const cors = require('cors');

const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
  });
});

module.exports = app;
