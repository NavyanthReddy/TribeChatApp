// store/useChatStore.ts
import { create } from 'zustand';
import { fetchLatestMessages, postNewMessage } from '../api/chatApi';

interface Message {
  uuid: string;
  text: string;
  senderUuid: string;
  updatedAt: number;
}

interface ChatStore {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  fetchMessages: async () => {
    try {
      const data = await fetchLatestMessages();
      set({ messages: data });
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
    }
  },
  sendMessage: async (text: string) => {
    try {
      const newMsg = await postNewMessage(text);
      set({ messages: [newMsg, ...get().messages] });
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  },
}));
