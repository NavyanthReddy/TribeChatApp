import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  edited?: boolean;
  image?: string;
  reactions?: Record<string, string[]>; // { emoji: [user1, user2] }
  replyToMessageId?: string;
};

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      setMessages: (msgs) => set({ messages: msgs }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // key in async-storage
      getStorage: () => AsyncStorage,
    }
  )
);
