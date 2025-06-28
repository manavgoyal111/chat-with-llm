import type { ChatMessage } from '../types/message';

// This simulates your DB
const DB: ChatMessage[] = [];

export const ChatMessageAPI = {
  async list(sortBy = '-created_date', limit = 100): Promise<ChatMessage[]> {
    // Sort and return mock messages
    const sorted = [...DB].sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    return sorted.slice(0, limit);
  },

  async create(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      created_by: 'user',
      ...data,
    } as ChatMessage;
    DB.push(message);
    return message;
  },

  async filter(filter: Partial<ChatMessage>, sortBy = '-created_date'): Promise<ChatMessage[]> {
    return DB.filter(msg =>
      Object.entries(filter).every(([key, value]) => msg[key as keyof ChatMessage] === value)
    );
  }
};
