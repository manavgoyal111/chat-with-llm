import { Client, handle_file } from "@gradio/client";

export const gradioClient = Client.connect("http://localhost:7860");

export interface FileUploadResponse {
  file_url: string;
}

export interface InvokeParams {
  prompt: string;
  file_urls?: string[];
  model_name?: string;
}

export const UploadFile = async ({ file }: { file: File }): Promise<FileUploadResponse> => {
  // Simply return the file URL; actual upload happens later in prediction
  return { file_url: URL.createObjectURL(file) };
};

export const InvokeLLM = async ({
  prompt,
  file_urls = [],
  model_name = "deepseek-r1:8b",
}: InvokeParams): Promise<string> => {
  const client = await gradioClient;

  let audio: unknown = null;
  let image: unknown = null;

  if (file_urls.length > 0) {
    const blob = await fetch(file_urls[0]).then((r) => r.blob());
    const handled = handle_file(blob);

    // Heuristic: Treat as audio if prompt suggests it
    if (/audio|voice|speech/i.test(prompt)) {
      audio = handled;
    } else {
      image = handled;
    }
  }

  const payload = {
    text: prompt || "",
    audio,
    image,
    model_name
  };

  const res = await client.predict("/predict", payload);
  const data = res.data;

  if (Array.isArray(data) && typeof data[0] === "string") {
    return data[0];
  }
  if (typeof data === "string") {
    return data;
  }

  console.warn("Unexpected Gradio response:", data);
  return "";
};
