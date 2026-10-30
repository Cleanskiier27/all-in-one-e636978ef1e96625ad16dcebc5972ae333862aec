const express = require('express');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.set('json spaces', 2);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'deployment-ready-app',
    message: 'App is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port,
    routes: ['/', '/health', '/api/status'],
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Number(process.uptime().toFixed(3)),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ready',
    app: 'deployment-ready-app',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'deployment-ready-app',
    platform: 'nodejs',
    framework: 'express',
    healthCheck: '/health',
    docs: 'See README.md for deployment instructions',
  });
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
    console.log(`Deployment-ready app listening on http://localhost:${port}`);
  });
}

module.exports = app;
