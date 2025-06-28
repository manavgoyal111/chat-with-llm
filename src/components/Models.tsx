import { useState, useEffect } from "react";
import { OllamaModelAPI } from "../entities/OllamaModel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Zap, Activity, Settings } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import type { Model, ModelSizeKey } from "../types/model";

const modelSizes = {
  "1.5b": { icon: Activity, color: "bg-green-100 text-green-700 border-green-200", label: "Fast", description: "Quick responses, lower resource usage" },
  "8b": { icon: Zap, color: "bg-blue-100 text-blue-700 border-blue-200", label: "Balanced", description: "Good balance of speed and capability" },
  "14b": { icon: Brain, color: "bg-purple-100 text-purple-700 border-purple-200", label: "Smart", description: "Enhanced reasoning and knowledge" },
  "32b": { icon: Brain, color: "bg-red-100 text-red-700 border-red-200", label: "Powerful", description: "Maximum capability and performance" }
} as const;

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const modelList = await OllamaModelAPI.list() as Model[];
      setModels(modelList);
    } catch (error) {
      console.error("Error loading models:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Model Management</h1>
        <p className="text-gray-600">Manage your Ollama models and configurations</p>
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This interface manages model preferences. Make sure the models are actually downloaded in Ollama using commands like <code className="bg-white px-1 rounded">ollama pull deepseek-r1:8b</code>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => {
          const sizeInfo = modelSizes[model.size as ModelSizeKey] || modelSizes["8b"];
          const SizeIcon = sizeInfo.icon;

          return (
            <Card key={model.id} className={`hover-lift ${model.is_active ? 'ring-2 ring-blue-200' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${sizeInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 bg-')} flex items-center justify-center`}>
                      <SizeIcon className="w-6 h-6 text-current" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{model.display_name}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono">{model.name}</p>
                    </div>
                  </div>
                  <Badge
                    variant={model.is_active ? "default" : "secondary"}
                    className={`${model.is_active ? sizeInfo.color : 'bg-gray-100 text-gray-600'}`}
                  >
                    {model.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline" className={`${sizeInfo.color} border mb-2`}>
                    {sizeInfo.label} • {model.size}
                  </Badge>
                  <p className="text-sm text-gray-600">{model.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{sizeInfo.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={model.is_active ? "outline" : "default"}
                    size="sm"
                    // onClick={() => toggleModelStatus(model.id, model.is_active)}
                    className="flex-1"
                  >
                    {model.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Model Card */}
        {/* <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Add Custom Model</h3>
            <p className="text-sm text-gray-500 mb-4">Configure additional Ollama models</p>
            <Button variant="outline" size="sm">
              Coming Soon
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Usage Statistics */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Model Comparison</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Performance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Use Case</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {models.map((model) => {
                  const sizeInfo = modelSizes[model.size] || modelSizes["8b"];

                  return (
                    <tr key={model.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{model.display_name}</div>
                        <div className="text-sm text-gray-500 font-mono">{model.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={sizeInfo.color}>
                          {model.size}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <sizeInfo.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{sizeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sizeInfo.description}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={model.is_active ? "default" : "secondary"}>
                          {model.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}