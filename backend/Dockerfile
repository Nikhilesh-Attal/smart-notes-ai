# Use Python base (easier for AI tools)
FROM python:3.10-slim

# Install Node.js & Build Tools
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir llama-cpp-python fastapi uvicorn pydantic

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Download Llama 3.2 3B Model during build
RUN mkdir -p models && \
    curl -L -o models/Llama-3.2-3B-Instruct-Q4_K_M.gguf https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf

# Hugging Face runs on 7860
EXPOSE 7860

# Give execution permission and run the start script
RUN chmod +x start.sh
CMD ["./start.sh"]