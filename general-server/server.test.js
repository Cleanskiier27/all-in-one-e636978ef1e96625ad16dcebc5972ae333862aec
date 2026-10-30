const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_PATH = ':memory:';
const app = require('./server');

async function withServer(callback) {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    await callback(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

test('GET / serves the dashboard HTML', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Platform Dashboard|Status Dashboard/i);
  });
});

test('GET /api/metrics returns JSON data', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/api/metrics`);
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.ok(payload.service);
    assert.equal(typeof payload.totalMessages, 'number');
  });
});

test('POST /api/messages adds a new message', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Alice', message: 'Hello from the test' }),
    });

    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.author, 'Alice');
    assert.equal(payload.message, 'Hello from the test');
  });
});
