# OllamaChat Requirements

npm install -D @tailwindcss/postcss

## Python Backend Dependencies

Create a `requirements.txt` file in your backend directory with these dependencies:

```txt
fastapi==0.104.1
uvicorn==0.24.0
ollama==0.1.7
python-multipart==0.0.6
pydantic==2.5.0
speechrecognition==3.10.0
pyaudio==0.2.11
pillow==10.1.0
pytesseract==0.3.10
opencv-python==4.8.1.78
numpy==1.24.3
python-dotenv==1.0.0
aiofiles==0.23.2
websockets==12.0
```

## Setup Instructions

1. Install Python dependencies: `pip install -r requirements.txt`
2. Install Tesseract OCR for image text extraction
3. Make sure Ollama is running with your desired models
4. The frontend will connect to your Python backend for voice/image processing
5. Text inputs are handled directly through the UI simulation

## Features

- **Multi-modal input**: Text, voice recording, image upload
- **OCR processing**: Extract text from images using Tesseract
- **Voice processing**: Convert audio to text (requires implementation)
- **TypeScript support**: Full type safety for React components
- **Real-time chat**: Streaming responses with conversation history
- **Model selection**: Switch between different Ollama models
- **Export functionality**: Download chat history as JSON