const serviceValue = document.getElementById('serviceValue');
const serviceMeta = document.getElementById('serviceMeta');
const messageCount = document.getElementById('messageCount');
const lastUpdated = document.getElementById('lastUpdated');
const latestMessage = document.getElementById('latestMessage');
const serviceStatus = document.getElementById('serviceStatus');
const messageList = document.getElementById('messageList');
const form = document.getElementById('messageForm');

function formatTimestamp(timestamp) {
  if (!timestamp) return 'No timestamps yet';
  return new Date(timestamp).toLocaleString();
}

async function loadMetrics() {
  const response = await fetch('/api/metrics');
  const data = await response.json();

  serviceValue.textContent = data.status || 'ready';
  serviceMeta.textContent = `Database: ${data.databaseStatus || 'connected'} • Service: ${data.service}`;
  serviceStatus.textContent = data.status === 'ready' ? 'Healthy' : 'Checking…';
  messageCount.textContent = data.totalMessages ?? 0;
  lastUpdated.textContent = `Updated: ${formatTimestamp(data.lastUpdated)}`;
  latestMessage.textContent = data.latestMessage || 'No messages yet';
}

async function loadMessages() {
  const response = await fetch('/api/messages');
  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    messageList.innerHTML = '<li class="empty-state">No messages saved yet.</li>';
    return;
  }

  messageList.innerHTML = data
    .map(
      (item) => `
        <li>
          <strong>${item.author}</strong>
          <div>${item.message}</div>
          <time>${formatTimestamp(item.createdAt)}</time>
        </li>
      `
    )
    .join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const author = document.getElementById('author').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!author || !message) {
    return;
  }

  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author, message }),
  });

  if (!response.ok) {
    const payload = await response.json();
    alert(payload.error || 'There was a problem saving the message.');
    return;
  }

  form.reset();
  await loadMetrics();
  await loadMessages();
});

loadMetrics();
loadMessages();
