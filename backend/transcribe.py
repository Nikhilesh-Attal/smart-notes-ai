import sys
import os
import warnings
from faster_whisper import WhisperModel

# Prevent logs from messing up Node.js output
warnings.filterwarnings("ignore")

def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        sys.exit(1)

    try:
        # Load Faster-Whisper (More efficient than original)
        model_size = "tiny" # Change to "base" for better accuracy
        model = WhisperModel(model_size, device="cpu", compute_type="int8")

        segments, info = model.transcribe(file_path, beam_size=5)

        # Combine segments into one text block
        full_text = " ".join([segment.text for segment in segments])
        
        # Output ONLY the final text so Node.js can read it
        print(full_text.strip())
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No filename provided")
        sys.exit(1)
    
    transcribe_audio(sys.argv[1])