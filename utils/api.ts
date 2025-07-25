const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export const fetchParticipants = async () => {
  const res = await fetch(`${API_BASE}/participants/all`);
  return await res.json();
};

export const fetchLatestMessages = async () => {
  const res = await fetch(`${API_BASE}/messages/latest`);
  return await res.json();
};
