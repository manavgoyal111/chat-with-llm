import gradio as gr
from ollama import chat
import easyocr
import speech_recognition as sr

ocr_reader = easyocr.Reader(["en"])
recognizer = sr.Recognizer()


def get_user_input(text, audio, image):
    if audio:
        try:
            with sr.AudioFile(audio) as source:
                data = recognizer.record(source)
                result = recognizer.recognize_google(data)  # type: ignore
                print(f"Speech to text successful: {result[:50]}...")
                return result
        except sr.UnknownValueError:
            print("Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Speech recognition error: {str(e)}")
            return None
    if image:
        ocr = ocr_reader.readtext(image)
        texts = [text for _, text, _ in ocr]
        return " ".join(texts) or None
    return text or None


def get_llm_response(model_name, history, think=True):
    print("Thinking: ", end='', flush=True)
    response = chat(model_name, messages=history, stream=True, think=think)
    thinking, reply = "", ""
    for chunk in response:
        if getattr(chunk.message, "thinking", None):
            thinking += chunk.message.thinking or ""
            print(chunk.message.thinking, end="", flush=True)
        if chunk.message.content:
            reply += chunk.message.content
            print(chunk.message.content, end="", flush=True)
    print()
    return reply


def chat_interface(text, audio, image, model_name, history):
    print("-" * 50)
    history = history or [
        {
            "role": "system",
            "content": """You are a quiz expert and a helpful assistant.
                I will send you a question and multiple choice option(s). Your task:
                1. Provide only the correct answer choice, the option number(s) (e.g., "A", "1") and the full text of the option.
                2. If multiple options are correct (mentioned in question), list all correct choices separated by commas.
                3. Do NOT include any explanation or reasoning—just the answer itself.
                4. Always respond in English.
                """
        }
    ]

    user_input = get_user_input(text, audio, image)
    print("Input:", user_input)
    if user_input is None:
        return "Didn't understand input.", history
    if user_input.lower() in ("exit", "quit"):
        return "Exiting chat.", []
    history.append({"role": "user", "content": user_input})

    reply = get_llm_response(model_name, history, think=False)
    history.append({"role": "assistant", "content": reply})

    return reply, history


demo = gr.Interface(
    fn=chat_interface,
    # live=True,
    inputs=[
        gr.Textbox(label="Text input"),
        gr.Audio(sources=["microphone"], type="filepath", label="Voice input"),
        gr.Image(type="filepath", label="Image input"),
        gr.Dropdown(
            choices=[
                "deepseek-r1:1.5b",
                "deepseek-r1:8b",
                "deepseek-r1:14b"
            ],
            value="deepseek-r1:1.5b",
            allow_custom_value=True,
            label="Model"
        ),
        gr.State(value=[])
    ],
    outputs=[
        gr.Textbox(label="Bot reply"),
        gr.State()
    ],
    live=False,
    title="Local Ollama Multimodal Chat",
)


if __name__ == "__main__":
    print("Chat started. Type 'exit' to end.\n")
    demo.launch()

# gradio .\chat_in_ui.py