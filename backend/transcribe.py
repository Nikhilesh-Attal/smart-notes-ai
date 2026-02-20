import sys
import whisper
import warnings
import os

# 1. Cleanup output so Node only gets the text
warnings.filterwarnings("ignore")
sys.stdout.reconfigure(encoding='utf-8')

def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        sys.exit(1)

    try:
        # 2. Load Model (First run will take time to download ~150MB)
        # using "tiny" for speed while testing. Change to "base" or "small" later for quality.
        model = whisper.load_model("tiny") 
        
        # 3. Run AI
        result = model.transcribe(file_path)
        
        # 4. Output ONLY the text
        print(result["text"])
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # Get the filename sent from Node.js
    if len(sys.argv) < 2:
        print("Error: No filename provided")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    transcribe_audio(audio_path)