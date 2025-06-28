export const UploadFile = async ({ file }: { file: File }) => {
  return { file_url: "https://dummy.com/image.png" };
};

export const InvokeLLM = async ({ prompt, file_urls }: { prompt: string, file_urls?: string[] }) => {
  return "Sample response from LLM.";
};
