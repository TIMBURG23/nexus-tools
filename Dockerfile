# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies AND build tools
# Added: pkg-config and libcairo2-dev (Fixes the Pycairo error)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    ffmpeg \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    default-jre \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    pkg-config \
    libcairo2-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy python dependencies
COPY requirements.txt .

# Upgrade pip first (helps find pre-built wheels to avoid compilation errors), then install requirements
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]