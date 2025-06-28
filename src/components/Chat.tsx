import React, { useState, useEffect, useRef } from "react";
import { ChatMessageAPI } from "../entities/ChatMessage";
import { InvokeLLM, UploadFile } from "../integrations/Core";
import MessageBubble from "../components/chat/MessageBubble";
import InputArea from "../components/chat/InputArea";
import ModelSelector from "../components/chat/ModelSelecter";
import { Button } from "./ui/button";
import { Trash2, Download, Brain, Type, Mic, Image as ImageIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { ChatMessage as ChatMessageType, InputType, FileUploadResponse } from "../types/message";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-r1:8b");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessageType | null>(null);
  const [conversationId] = useState<string>(() => `conv_${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const loadMessages = async (): Promise<void> => {
    try {
      const chatMessages = await ChatMessageAPI.filter(
        { conversation_id: conversationId },
        "-created_date"
      );
      setMessages(chatMessages.reverse());
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processVoiceInput = async (audioFile: File): Promise<string> => {
    try {
      const response: FileUploadResponse = await UploadFile({ file: audioFile });
      
      // Use LLM to convert audio to text (simulated - in real app you'd use speech-to-text)
      const textResponse = await InvokeLLM({
        prompt: `Convert this audio file to text. If you cannot process audio, respond with: "Voice input received - please implement speech-to-text integration"`,
        file_urls: [response.file_url]
      });
      
      return textResponse || "Voice message processed";
    } catch (error) {
      console.error("Error processing voice:", error);
      return "Could not process voice input";
    }
  };

  const processImageInput = async (imageFile: File): Promise<string> => {
    try {
      const response: FileUploadResponse = await UploadFile({ file: imageFile });
      
      // Use OCR via LLM to extract text from image
      const textResponse = await InvokeLLM({
        prompt: `Please analyze this image and extract any text content using OCR. If there is no text, describe what you see in the image. Provide a clear, detailed response.`,
        file_urls: [response.file_url]
      });
      
      return textResponse || "Image processed";
    } catch (error) {
      console.error("Error processing image:", error);
      return "Could not process image";
    }
  };

  const sendMessage = async (input: string | File, inputType: InputType): Promise<void> => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      let textContent = "";
      
      // Process different input types
      if (inputType === "text") {
        textContent = input as string;
      } else if (inputType === "voice") {
        textContent = await processVoiceInput(input as File);
      } else if (inputType === "image") {
        textContent = await processImageInput(input as File);
      }

      // Save user message
      const userMessage = await ChatMessageAPI.create({
        role: "user",
        content: textContent,
        input_type: inputType,
        conversation_id: conversationId
      });
      
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare conversation history for Ollama
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Simulate streaming response (in real implementation, you'd connect to Ollama)
      setStreamingMessage({
        id: "temp",
        role: "assistant",
        content: "",
        model_used: selectedModel,
        conversation_id: conversationId,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        created_by: "system"
      });

      // Get response from LLM (simulating Ollama response)
      const response = await InvokeLLM({
        prompt: `You are an AI assistant running on the ${selectedModel} model via Ollama. The user said: "${textContent}". Please provide a helpful, detailed response. Previous conversation context: ${JSON.stringify(conversationHistory.slice(-6))}`
      });

      setStreamingMessage(null);
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      // Save assistant response
      const assistantMessage = await ChatMessageAPI.create({
        role: "assistant",
        content: response,
        model_used: selectedModel,
        conversation_id: conversationId,
        processing_time: processingTime
      });
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setStreamingMessage(null);
      
      const errorMessage = await ChatMessageAPI.create({
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please make sure Ollama is running and try again.",
        model_used: selectedModel,
        conversation_id: conversationId
      });
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsProcessing(false);
  };

  const clearChat = async (): Promise<void> => {
    setMessages([]);
    // In a real app, you might want to delete messages from the database
  };

  const exportChat = (): void => {
    const chatData = messages.map(msg => ({
      timestamp: new Date(msg.created_date).toISOString(),
      role: msg.role,
      content: msg.content,
      model: msg.model_used,
      input_type: msg.input_type
    }));
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text">Chat Interface</h1>
            <div className="hidden md:block">
              <ModelSelector 
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportChat}
              disabled={messages.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Mobile Model Selector */}
        <div className="md:hidden mt-4">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto">
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to OllamaChat</h2>
              <p className="text-gray-600 mb-6">Start a conversation using text, voice, or images</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Type className="w-6 h-6 text-blue-500 mb-2" />
                  <h3 className="font-semibold text-sm">Type Messages</h3>
                  <p className="text-xs text-gray-500">Traditional text chat</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Mic className="w-6 h-6 text-purple-500 mb-2" />
                  <h3 className="font-semibold text-sm">Voice Input</h3>
                  <p className="text-xs text-gray-500">Speak your questions</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <ImageIcon className="w-6 h-6 text-green-500 mb-2" />
                  <h3 className="font-semibold text-sm">Image Analysis</h3>
                  <p className="text-xs text-gray-500">Upload images for OCR</p>
                </div>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {streamingMessage && (
            <MessageBubble message={streamingMessage} isStreaming={true} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <InputArea
            onSendMessage={sendMessage}
            isProcessing={isProcessing}
            placeholder="Ask me anything... (supports text, voice, and images)"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;