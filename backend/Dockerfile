# 1. Use a Python base (better for Llama/Whisper dependencies)
FROM python:3.10-slim

# 2. Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

# 3. Install FFmpeg (Required for your YouTube/Whisper logic)
RUN apt-get install -y ffmpeg build-essential

WORKDIR /app

# 4. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Install Node dependencies
COPY package*.json ./
RUN npm install

# 6. Copy the rest of the backend code
COPY . .

# 7. Create a folder for the model and download it (or copy it)
RUN mkdir -p models
# Tip: You can use 'wget' here to download the GGUF model during build
# OR upload it to your HF Space directly.

EXPOSE 5000

# 8. Start the Node.js server
CMD ["node", "server.js"]