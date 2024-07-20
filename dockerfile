FROM python:3.11

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container

# Install the Python dependencies
RUN pip install fastapi uvicorn redis pydantic pydantic_settings

# Copy the FastAPI application code into the container
COPY . .

# Expose the port that the FastAPI app will run on
EXPOSE 8000

# Set the command to start the FastAPI app using Uvicorn
CMD ["python", "-m", "uvicorn", "--app-dir", "app", "main:app", "--host", "0.0.0.0", "--port", "8000"]