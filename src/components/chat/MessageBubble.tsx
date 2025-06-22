import React from "react";
import { motion } from "framer-motion";
import { User, Bot, Mic, Image as ImageIcon, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const inputTypeIcons = {
  text: Type,
  voice: Mic,
  image: ImageIcon
};

const inputTypeColors = {
  text: "bg-blue-100 text-blue-700",
  voice: "bg-purple-100 text-purple-700", 
  image: "bg-green-100 text-green-700"
};

export default function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === "user";
  const InputIcon = inputTypeIcons[message.input_type] || Type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-3xl ${isUser ? "ml-12" : "mr-12"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {isUser ? "You" : "Assistant"}
          </span>
          {message.input_type && isUser && (
            <Badge variant="secondary" className={`${inputTypeColors[message.input_type]} text-xs`}>
              <InputIcon className="w-3 h-3 mr-1" />
              {message.input_type}
            </Badge>
          )}
          {message.model_used && !isUser && (
            <Badge variant="outline" className="text-xs">
              {message.model_used}
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            {format(new Date(message.created_date || Date.now()), "HH:mm")}
          </span>
        </div>
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm hover-lift ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto"
              : "bg-white border border-gray-100 text-gray-800"
          }`}
        >
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-current opacity-50 animate-pulse ml-1" />
            )}
          </div>
        </div>
        
        {message.processing_time && !isUser && (
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>Response time: {message.processing_time?.toFixed(2)}s</span>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center shadow-lg flex-shrink-0">
          <User className="w-5 h-5 text-gray-700" />
        </div>
      )}
    </motion.div>
  );
}