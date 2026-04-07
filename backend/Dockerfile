# 1. Use Python base (easier for AI tools)
FROM python:3.10-slim

# 2. Install Tesseract, Node.js, and Build Tools in one go to save space
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Install Python dependencies
# Adding 'cmake' helps if llama-cpp-python needs to compile from source
COPY requirements.txt .
RUN pip install --no-cache-dir cmake
RUN pip install --no-cache-dir llama-cpp-python fastapi uvicorn pydantic

# 4. Install Node dependencies
COPY package*.json ./
RUN npm install

# 5. Copy everything else
COPY . .

# 6. Download Llama 3.2 3B Model during the build process
# This is the "Secret Sauce" to avoid Git 10MB limits
RUN mkdir -p models && \
    curl -L -o models/Llama-3.2-3B-Instruct-Q4_K_M.gguf https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf

# 7. Hugging Face runs on 7860
EXPOSE 7860

# 8. Give execution permission and run the start script
RUN chmod +x start.sh
CMD ["./start.sh"]