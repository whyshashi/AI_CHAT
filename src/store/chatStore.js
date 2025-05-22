import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'chat_history';

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,

  initializeStore: () => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      set({ messages: JSON.parse(savedMessages) });
    }
  },

  addMessage: (content, sender = 'user', type = 'text', pluginData = null) => {
    const newMessage = {
      id: uuidv4(),
      sender,
      content,
      type,
      timestamp: new Date().toISOString(),
      ...(pluginData && { pluginData }),
    };

    set((state) => {
      const newMessages = [...state.messages, newMessage];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      return { messages: newMessages };
    });

    return newMessage;
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearHistory: () => {
    set({ messages: [] });
    localStorage.removeItem(STORAGE_KEY);
  },
}));

export { useChatStore }; 