# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies (The heavy lifters)
# FIXED: Replaced 'libgl1-mesa-glx' with 'libgl1' and added 'libglib2.0-0'
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    ffmpeg \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    default-jre \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy python dependencies
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]