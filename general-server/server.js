const express = require('express');
const path = require('node:path');
const { createMessage, getMessages, getMetrics, healthStatus } = require('./database');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.set('json spaces', 2);
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Number(process.uptime().toFixed(3)),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: healthStatus(),
  });
});

app.get('/api/status', (req, res) => {
  const metrics = getMetrics();

  res.json({
    status: 'ready',
    app: 'platform-dashboard',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: healthStatus(),
    totalMessages: metrics.totalMessages,
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'platform-dashboard',
    platform: 'nodejs',
    framework: 'express',
    database: 'better-sqlite3',
    healthCheck: '/health',
    docs: 'See README.md for deployment instructions',
  });
});

app.get('/api/metrics', (req, res) => {
  const metrics = getMetrics();
  res.json({
    ...metrics,
    service: 'platform-dashboard',
    databaseStatus: healthStatus().status,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/messages', (req, res) => {
  res.json(getMessages());
});

app.post('/api/messages', (req, res) => {
  const author = String(req.body?.author || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!author || !message) {
    return res.status(400).json({
      error: 'Author and message are required.',
    });
  }

  const entry = createMessage({ author, message });
  return res.status(201).json(entry);
});

app.use((req, res) => {
  res.status(404).json({
    status: 'not_found',
    path: req.originalUrl,
    message: 'Route not found',
  });
});

if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Platform dashboard listening on http://localhost:${port}`);
  });
}

module.exports = app;
