export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  input_type?: 'text' | 'voice' | 'image';
  model_used?: string;
  conversation_id?: string;
  processing_time?: number;
  created_date: string;
  updated_date: string;
  created_by: string;
}

export interface OllamaModel {
  id: string;
  name: string;
  display_name: string;
  size: string;
  description: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
  created_by: string;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export interface InputAreaProps {
  onSendMessage: (input: string | File, inputType: 'text' | 'voice' | 'image') => void;
  isProcessing?: boolean;
  placeholder?: string;
}

export interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  models?: OllamaModel[];
}

export interface FileUploadResponse {
  file_url: string;
}

export interface LLMResponse {
  content: string;
  processing_time?: number;
}

export type InputType = 'text' | 'voice' | 'image';
export type MessageRole = 'user' | 'assistant';