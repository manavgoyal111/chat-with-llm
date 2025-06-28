export type ModelSizeKey = "1.5b" | "8b" | "14b" | "32b";

export interface Model {
  id: string;
  name: string;
  display_name: string;
  size: ModelSizeKey;
  description: string;
  is_active: boolean;
}