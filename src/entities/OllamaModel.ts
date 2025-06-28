// src/entities/OllamaModel.ts
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

// Add static methods to manage persistence (e.g., via API calls):
export class OllamaModelAPI {
  static async list(): Promise<OllamaModel[]> {
    const resp = await fetch('/api/models');
    if (!resp.ok) throw new Error(`Failed to list models: ${resp.status}`);
    return await resp.json();
  }

  static async create(model: Partial<OllamaModel>): Promise<OllamaModel> {
    const resp = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model),
    });
    if (!resp.ok) throw new Error(`Failed to create model: ${resp.status}`);
    return await resp.json();
  }

  static async update(id: string, updates: Partial<OllamaModel>): Promise<OllamaModel> {
    const resp = await fetch(`/api/models/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!resp.ok) throw new Error(`Failed to update model: ${resp.status}`);
    return await resp.json();
  }
}
