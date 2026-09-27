# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set working directory
WORKDIR /app

# Install system dependencies if required by netCDF4/numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libnetcdf-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set permissions for the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose port
EXPOSE 8000

# Default environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV WORKERS=1
ENV OCEAN_DATA_MODE=netcdf

# Run the application
CMD uvicorn main:app --host ${HOST} --port ${PORT} --workers ${WORKERS}
