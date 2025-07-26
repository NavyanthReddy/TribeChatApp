// api/chatApi.ts
const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export const fetchLatestMessages = async () => {
  const res = await fetch(`${API_BASE}/messages/latest`);
  return await res.json();
};

export const postNewMessage = async (text: string) => {
  const res = await fetch(`${API_BASE}/messages/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return await res.json();
};

export const fetchOlderMessages = async (refUuid: string) => {
  const res = await fetch(`${API_BASE}/messages/older/${refUuid}`);
  return await res.json();
};

export const fetchParticipants = async () => {
  const res = await fetch(`${API_BASE}/participants/all`);
  return await res.json();
};
