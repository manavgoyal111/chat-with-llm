# 🧠 Ollama Multimodal Chat Interface

A modern multimodal AI chat UI that supports **text**, **voice**, and **image inputs**, backed by **Ollama** for running LLMs locally. Built using **React**, **Gradio**, **FastAPI (optional)**, and integrated with multiple LLMs (DeepSeek, Mistral, LLaMA3, etc.).

---

## ✨ Features

- 🔤 **Text input**: Ask questions or give instructions in plain text.
- 🎤 **Voice input**: Upload `.wav` audio or speak directly (speech-to-text using Google Speech API).
- 🖼️ **Image input**: Upload image files for OCR using `easyocr`.
- 🤖 **Model selection**: Choose from available Ollama models dynamically.
- 🗃️ **Conversation history**: Stored per-session with `conversation_id`.
- 💾 **Export chat**: Download chat as JSON.
- 🚀 **Streaming replies**: Simulated (can be expanded with websocket).
- 🧪 **Model introspection**: Auto-fetch from `/api/tags` and fall back to defaults.

---

## 🏗️ Tech Stack

| Layer             | Tool / Library                                      |
|------------------|------------------------------------------------------|
| 💻 Frontend       | React + TypeScript + TailwindCSS                    |
| 🧠 Backend        | Python, Gradio, optionally FastAPI or Flask         |
| 🧱 UI Components  | shadcn/ui, Lucide Icons                             |
| 📡 API Calls      | Gradio client, REST fetch, dynamic model resolver  |
| 🔍 OCR            | `easyocr` (Python)                                  |
| 🎙️ Voice-to-text  | `speech_recognition` using Google API               |
| 🔗 LLMs           | Ollama (LLaMA3, Mistral, DeepSeek, Qwen, etc.)     |

---

## 🔧 Setup Instructions

1. **Install dependencies**:
   ```bash
      python -m venv venv
      venv\Scripts\activate.bat
      pip install gradio easyocr speechrecognition ollama
      npm i
   ```
2. **Run App**:
   ```bash
      npm start
   ```
