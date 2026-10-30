const serviceValue = document.getElementById('serviceValue');
const serviceMeta = document.getElementById('serviceMeta');
const messageCount = document.getElementById('messageCount');
const lastUpdated = document.getElementById('lastUpdated');
const latestMessage = document.getElementById('latestMessage');
const serviceStatus = document.getElementById('serviceStatus');
const messageList = document.getElementById('messageList');
const form = document.getElementById('messageForm');
const refreshButton = document.getElementById('refreshButton');

function formatTimestamp(timestamp) {
  if (!timestamp) return 'No timestamps yet';
  return new Date(timestamp).toLocaleString();
}

function setLoadingState(isLoading) {
  if (!refreshButton) return;
  refreshButton.disabled = isLoading;
  refreshButton.textContent = isLoading ? 'Refreshing…' : 'Refresh now';
}

function renderMessageList(data) {
  messageList.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No messages saved yet.';
    messageList.appendChild(empty);
    return;
  }

  data.forEach((item) => {
    const entry = document.createElement('li');

    const author = document.createElement('strong');
    author.textContent = item.author;

    const body = document.createElement('div');
    body.textContent = item.message;

    const timestamp = document.createElement('time');
    timestamp.textContent = formatTimestamp(item.createdAt);

    entry.append(author, body, timestamp);
    messageList.appendChild(entry);
  });
}

async function refreshDashboard() {
  setLoadingState(true);

  try {
    const [metricsResponse, messagesResponse] = await Promise.all([
      fetch('/api/metrics'),
      fetch('/api/messages'),
    ]);

    if (!metricsResponse.ok || !messagesResponse.ok) {
      throw new Error('Failed to refresh dashboard data.');
    }

    const metrics = await metricsResponse.json();
    const messages = await messagesResponse.json();

    serviceValue.textContent = metrics.status || 'ready';
    serviceMeta.textContent = `Database: ${metrics.databaseStatus || 'connected'} • Service: ${metrics.service}`;
    serviceStatus.textContent = metrics.status === 'ready' ? 'Healthy' : 'Checking…';
    messageCount.textContent = metrics.totalMessages ?? 0;
    lastUpdated.textContent = `Updated: ${formatTimestamp(metrics.lastUpdated)}`;
    latestMessage.textContent = metrics.latestMessage || 'No messages yet';
    renderMessageList(messages);
  } catch (error) {
    serviceStatus.textContent = 'Error';
    lastUpdated.textContent = error.message || 'Unable to refresh dashboard';
    latestMessage.textContent = 'Retrying soon';
  } finally {
    setLoadingState(false);
  }
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
  await refreshDashboard();
});

if (refreshButton) {
  refreshButton.addEventListener('click', refreshDashboard);
  window.addEventListener('load', refreshDashboard);
  window.setInterval(refreshDashboard, 15000);
} else {
  refreshDashboard();
}
