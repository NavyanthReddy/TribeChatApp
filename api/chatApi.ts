const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

export async function fetchLatestMessages() {
  const res = await fetch(`${BASE_URL}/messages/latest`);
  return res.json();
}

export async function postNewMessage(text: string) {
  const res = await fetch(`${BASE_URL}/messages/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
