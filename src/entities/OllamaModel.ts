export interface OllamaModel {
  id: string;
  name: string;
  display_name: string;
  size: string;
  description: string;
  is_active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by?: string;
}

const defaultModels: OllamaModel[] = [
  {
    id: "1",
    name: "deepseek-r1:1.5b",
    display_name: "DeepSeek R1 1.5B",
    size: "1.5b",
    description: "Fast and efficient model for quick responses",
    is_active: true
  },
  {
    id: "2",
    name: "deepseek-r1:8b",
    display_name: "DeepSeek R1 8B",
    size: "8b",
    description: "Balanced performance for most use cases",
    is_active: true
  }
];


export class OllamaModelAPI {
  static async list(): Promise<OllamaModel[]> {
    try {
      const resp = await fetch("http://localhost:11434/api/tags");
      if (!resp.ok) throw new Error(`Status ${resp.status}`);

      const data: { models?: Array<{ name: string; details?: { parameter_size: string } }> } =
        await resp.json();

      const fetched = (data.models || []).map((m) => {
        const paramSize = m.details?.parameter_size.toLowerCase() ?? "";
        // derive size key ("1.5b","8b","14b","32b") from parameter_size
        const sizeKey = ["1.5b", "8b", "14b", "32b"].find((k) =>
          paramSize.includes(k.replace("b", ""))
        )!;
        return {
          id: m.name,
          name: m.name,
          display_name: `DeepSeek ${sizeKey.toUpperCase()}`,
          size: sizeKey,
          description: `${m.details?.parameter_size || "Unknown size"}`,
          is_active: true,
        };
      });

      // If no models fetched, fallback to defaults
      return fetched.length > 0 ? fetched : defaultModels;
    } catch (e) {
      console.warn("OllamaModelAPI.list() failed, using defaults:", e);
      return defaultModels;
    }
  }

  static async create(model: Partial<OllamaModel>): Promise<OllamaModel> {
    throw new Error("Model creation not supported via Ollama API.");
  }
}
