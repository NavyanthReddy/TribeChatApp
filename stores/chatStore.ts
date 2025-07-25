import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

export type Participant = {
  uuid: string;
  name: string;
  avatar: string;
  role?: string;
};

export type Message = {
  uuid: string;
  authorUuid: string;
  text: string;
  sentAt: number;
  updatedAt: number;
  reactions?: any[];
  attachments?: any[];
  replyToMessage?: any;
};


type ChatStore = {
  messages: Message[];
  participants: Record<string, Participant>; // Map from uuid to participant
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setParticipants: (participants: Participant[]) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      participants: {},
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      setMessages: (msgs) => set({ messages: msgs }),
      setParticipants: (participantList) => {
        const participantMap: Record<string, Participant> = {};
        participantList.forEach((p) => {
          participantMap[p.uuid] = p;
        });
        set({ participants: participantMap });
      },
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // AsyncStorage key
      getStorage: () => AsyncStorage,
    }
  )
);
