import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Zap, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const modelSizes = {
  "1.5b": { icon: Activity, color: "bg-green-100 text-green-700", label: "Fast" },
  "8b": { icon: Zap, color: "bg-blue-100 text-blue-700", label: "Balanced" },
  "14b": { icon: Brain, color: "bg-purple-100 text-purple-700", label: "Smart" },
  "32b": { icon: Brain, color: "bg-red-100 text-red-700", label: "Powerful" }
};

export default function ModelSelector({ selectedModel, onModelChange, models = [] }) {
  // Default models if none provided
  const defaultModels = [
    { name: "deepseek-r1:1.5b", display_name: "DeepSeek R1 1.5B", size: "1.5b", description: "Fast and efficient" },
    { name: "deepseek-r1:8b", display_name: "DeepSeek R1 8B", size: "8b", description: "Balanced performance" },
    { name: "deepseek-r1:14b", display_name: "DeepSeek R1 14B", size: "14b", description: "High capability" },
    { name: "deepseek-r1:32b", display_name: "DeepSeek R1 32B", size: "32b", description: "Maximum performance" }
  ];

  const availableModels = models.length > 0 ? models : defaultModels;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-800">Select Model</span>
      </div>
      
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full bg-gray-50 border-0 focus:bg-white">
          <SelectValue placeholder="Choose a model..." />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => {
            const sizeInfo = modelSizes[model.size] || modelSizes["8b"];
            const SizeIcon = sizeInfo.icon;
            
            return (
              <SelectItem key={model.name} value={model.name} className="py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <SizeIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{model.display_name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`${sizeInfo.color} text-xs`}>
                    {sizeInfo.label}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}