import React, { useState, useEffect } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Download, Calendar, User, Bot } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import MessageBubble from "../components/chat/MessageBubble";

export default function HistoryPage() {
  const [allMessages, setAllMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedInputType, setSelectedInputType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalConversations: 0,
    averageResponseTime: 0,
    modelUsage: {}
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [allMessages, searchTerm, selectedDate, selectedModel, selectedInputType]);

  const loadHistory = async () => {
    try {
      const messages = await ChatMessage.list("-created_date", 1000);
      setAllMessages(messages);
      calculateStats(messages);
    } catch (error) {
      console.error("Error loading history:", error);
    }
    setIsLoading(false);
  };

  const calculateStats = (messages) => {
    const totalMessages = messages.length;
    const conversations = new Set(messages.map(m => m.conversation_id)).size;
    const assistantMessages = messages.filter(m => m.role === "assistant" && m.processing_time);
    const avgResponseTime = assistantMessages.length > 0 
      ? assistantMessages.reduce((sum, m) => sum + m.processing_time, 0) / assistantMessages.length 
      : 0;
    
    const modelUsage = {};
    messages.forEach(m => {
      if (m.model_used) {
        modelUsage[m.model_used] = (modelUsage[m.model_used] || 0) + 1;
      }
    });

    setStats({
      totalMessages,
      totalConversations: conversations,
      averageResponseTime: avgResponseTime,
      modelUsage
    });
  };

  const filterMessages = () => {
    let filtered = [...allMessages];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (selectedDate) {
      const date = new Date(selectedDate);
      const start = startOfDay(date);
      const end = endOfDay(date);
      filtered = filtered.filter(message => {
        const messageDate = new Date(message.created_date);
        return messageDate >= start && messageDate <= end;
      });
    }

    // Model filter
    if (selectedModel !== "all") {
      filtered = filtered.filter(message => message.model_used === selectedModel);
    }

    // Input type filter
    if (selectedInputType !== "all") {
      filtered = filtered.filter(message => message.input_type === selectedInputType);
    }

    setFilteredMessages(filtered);
  };

  const exportHistory = () => {
    const exportData = filteredMessages.map(msg => ({
      timestamp: new Date(msg.created_date).toISOString(),
      role: msg.role,
      content: msg.content,
      model: msg.model_used,
      input_type: msg.input_type,
      processing_time: msg.processing_time
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUniqueModels = () => {
    const models = new Set(allMessages.map(m => m.model_used).filter(Boolean));
    return Array.from(models);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Chat History</h1>
            <p className="text-gray-600">Browse and search your conversation history</p>
          </div>
          <Button onClick={exportHistory} className="gap-2">
            <Download className="w-4 h-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Messages</p>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Conversations</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Avg Response</p>
                <p className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Models Used</p>
                <p className="text-2xl font-bold">{Object.keys(stats.modelUsage).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search Messages</label>
              <Input
                placeholder="Search in messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Model</label>
              <select
                className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="all">All Models</option>
                {getUniqueModels().map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Input Type</label>
              <select
                className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                value={selectedInputType}
                onChange={(e) => setSelectedInputType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="voice">Voice</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Messages ({filteredMessages.length})
            </CardTitle>
            {filteredMessages.length !== allMessages.length && (
              <Badge variant="outline">
                Filtered from {allMessages.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}