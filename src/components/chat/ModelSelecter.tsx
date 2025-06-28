import React, { useEffect, useState } from "react";
import { Brain, Zap, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { ModelSelectorProps } from "../../types/message";
import { OllamaModelAPI } from "../../entities/OllamaModel";
import type { Model } from "../../types/model";

interface ModelSizeInfo {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
}

export interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

const modelSizes: Record<string, ModelSizeInfo> = {
  "1.5b": { icon: Activity, color: "bg-green-100 text-green-700", label: "Fast" },
  "8b": { icon: Zap, color: "bg-blue-100 text-blue-700", label: "Balanced" },
  "14b": { icon: Brain, color: "bg-purple-100 text-purple-700", label: "Smart" },
  "32b": { icon: Brain, color: "bg-red-100 text-red-700", label: "Powerful" }
};

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [fetchedModels, setFetchedModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelList = await OllamaModelAPI.list() as Model[];
        setFetchedModels(modelList);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    fetchModels();
  }, []);

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
          {fetchedModels.map((model) => {
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
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;