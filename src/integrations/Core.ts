import { Client, handle_file } from "@gradio/client";

export const gradioClient = Client.connect("http://localhost:7860");

export interface FileUploadResponse {
  file_url: string;
}

export interface InvokeParams {
  prompt: string;
  file_urls?: string[];
}

export const UploadFile = async ({ file }: { file: File }): Promise<FileUploadResponse> => {
  // Simply return the file URL; actual upload happens later in prediction
  return { file_url: URL.createObjectURL(file) };
};

export const InvokeLLM = async ({
  prompt,
  file_urls,
}: InvokeParams): Promise<string> => {
  const client = await gradioClient;
  const payload: Record<string, unknown> = { prompt };

  // If there's a file, convert it to a gradio-uploadable form
  if (file_urls?.length) {
    const blob = await fetch(file_urls[0]).then((r) => r.blob());
    payload.file = handle_file(blob); // `@gradio/client` helper
  }

  // Call gradio `predict` endpoint
  const res = await client.predict("/predict", payload);
  const data = res.data;

  // Now safely cast the return to string
  if (Array.isArray(data) && typeof data[0] === "string") {
    return data[0];
  } else if (typeof data === "string") {
    return data;
  }
  console.warn("Unexpected gradio response", data);
  return "";
};