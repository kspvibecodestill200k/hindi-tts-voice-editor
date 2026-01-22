# Backend Setup & Deployment Guide

## Overview

Your Hindi TTS Voice Generator has two complete backend implementations:
1. **Python/Flask** (`backend_flask.py`)
2. **Node.js/Express** (`backend_express.js`)

Choose one based on your preference. Both have identical functionality.

---

## Prerequisites

- Python 3.7+ OR Node.js 14+
- API keys from at least one TTS provider
- Pip or NPM package manager

---

## Part 1: Python/Flask Setup

### Step 1: Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors python-dotenv requests
```

### Step 2: Install Provider Libraries

Install only the providers you'll use:

```bash
# ElevenLabs (optional - uses REST API)
pip install elevenlabs

# Sarvam AI (optional - uses REST API)
# No library needed, uses HTTP requests

# Google Cloud
pip install google-cloud-texttospeech

# Microsoft Azure
pip install azure-cognitiveservices-speech
```

### Step 3: Create Environment File

Create `.env` file in project root:

```bash
# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_ADARSH_ID=voice_id_for_adarsh
ELEVENLABS_PRIYA_ID=voice_id_for_priya
ELEVENLABS_AKSHAY_ID=voice_id_for_akshay

# Sarvam AI
SARVAM_API_KEY=your_sarvam_api_key_here

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json

# Microsoft Azure
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=centralindia
```

### Step 4: Get API Credentials

#### **ElevenLabs**
1. Sign up at https://elevenlabs.io
2. Go to Settings → API Keys
3. Copy your API key
4. Create voices and note their IDs

#### **Sarvam AI**
1. Visit https://sarvam.ai
2. Create account
3. Get API key from dashboard
4. Check voice IDs in documentation

#### **Google Cloud**
1. Create Google Cloud project
2. Enable Text-to-Speech API
3. Create service account
4. Download JSON key file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to file path

#### **Microsoft Azure**
1. Create Azure account
2. Create Speech resource
3. Get API key and region from resource settings
4. Set `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`

### Step 5: Run Flask Server

```bash
# Make sure virtual environment is activated
python backend_flask.py
```

Output:
```
============================================================
Hindi TTS Voice Generator - Backend Server
============================================================

Endpoints:
  POST /api/generate-audio  - Generate speech from SSML
  GET  /api/providers       - List available providers
  GET  /api/health          - Health check

Environment Variables Required:
  ...

============================================================
 * Running on http://0.0.0.0:5000
```

### Step 6: Test the Backend

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get available providers
curl http://localhost:5000/api/providers

# Generate audio
curl -X POST http://localhost:5000/api/generate-audio \
  -H "Content-Type: application/json" \
  -d '{
    "ssml": "<speak>नमस्ते दोस्त</speak>",
    "voice_id": "adarsh",
    "provider": "elevenlabs",
    "language": "hi-IN"
  }' \
  --output audio.mp3
```

---

## Part 2: Node.js/Express Setup

### Step 1: Initialize Node Project

```bash
# Create project directory (if not already)
cd "Text to Speech AI"

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv axios
```

### Step 2: Install Provider Libraries

```bash
# Google Cloud
npm install @google-cloud/text-to-speech

# Microsoft Azure
npm install microsoft-cognitiveservices-speech-sdk

# ElevenLabs (optional - uses Axios)
# No package needed

# Sarvam AI (optional - uses Axios)
# No package needed
```

### Step 3: Create Environment File

Create `.env`:

```bash
PORT=5000

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_ADARSH_ID=voice_id_for_adarsh
ELEVENLABS_PRIYA_ID=voice_id_for_priya
ELEVENLABS_AKSHAY_ID=voice_id_for_akshay

# Sarvam AI
SARVAM_API_KEY=your_sarvam_api_key_here

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json

# Microsoft Azure
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=centralindia
```

### Step 4: Get API Credentials

(Same as Python section above)

### Step 5: Create package.json Scripts

Edit `package.json`:

```json
{
  "name": "hindi-tts-backend",
  "version": "1.0.0",
  "description": "Hindi TTS Voice Generator Backend",
  "main": "backend_express.js",
  "scripts": {
    "start": "node backend_express.js",
    "dev": "nodemon backend_express.js",
    "test": "node test-api.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
```

Install dev dependencies:

```bash
npm install --save-dev nodemon
```

### Step 6: Run Express Server

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

Output:
```
============================================================
Hindi TTS Voice Generator - Backend Server
============================================================

Endpoints:
  POST /api/generate-audio  - Generate speech from SSML
  GET  /api/providers       - List available providers
  GET  /api/health          - Health check

Environment Variables Required:
  ...

============================================================
Server running on http://localhost:5000
============================================================
```

### Step 7: Test the Backend

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get available providers
curl http://localhost:5000/api/providers

# Generate audio
curl -X POST http://localhost:5000/api/generate-audio \
  -H "Content-Type: application/json" \
  -d '{
    "ssml": "<speak>नमस्ते दोस्त</speak>",
    "voice_id": "adarsh",
    "provider": "elevenlabs",
    "language": "hi-IN"
  }' \
  --output audio.mp3
```

---

## Part 3: Frontend Configuration

### Update Frontend to Connect to Backend

The frontend in `script.js` already sends to `/api/generate-audio`. Just ensure:

1. Backend is running on `localhost:5000`
2. CORS is enabled (both implementations have it)
3. API keys are configured in backend

### Optional: Change Backend URL

If backend runs on different host/port, edit `script.js`:

```javascript
// Change this line in generateAudio() function:
fetch('/api/generate-audio', {
    // To this:
    fetch('http://your-backend-url:5000/api/generate-audio', {
        // Rest of code...
    })
})
```

---

## Part 4: Deployment

### Deploy to Heroku (Python)

```bash
# Create Procfile
echo "web: python backend_flask.py" > Procfile

# Create requirements.txt
pip freeze > requirements.txt

# Deploy
heroku create your-app-name
heroku config:set ELEVENLABS_API_KEY=your_key
git push heroku main
```

### Deploy to Heroku (Node.js)

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create your-app-name
heroku config:set ELEVENLABS_API_KEY=your_key
git push heroku main
```

### Deploy to AWS Lambda

See `DEPLOYMENT.md` for detailed AWS Lambda instructions.

### Deploy to Google Cloud Run

```bash
# Python
gcloud run deploy hindi-tts-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars ELEVENLABS_API_KEY=your_key

# Node.js
gcloud run deploy hindi-tts-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars ELEVENLABS_API_KEY=your_key
```

---

## Part 5: Testing

### Automated Tests

Create `test_api.py` (Python):

```python
import requests
import json

BASE_URL = 'http://localhost:5000'

def test_health():
    response = requests.get(f'{BASE_URL}/api/health')
    print(f"Health: {response.json()}")

def test_providers():
    response = requests.get(f'{BASE_URL}/api/providers')
    print(f"Providers: {response.json()}")

def test_generate_audio():
    payload = {
        'ssml': '<speak>नमस्ते दोस्त</speak>',
        'voice_id': 'adarsh',
        'provider': 'elevenlabs',
        'language': 'hi-IN'
    }
    response = requests.post(
        f'{BASE_URL}/api/generate-audio',
        json=payload
    )
    
    if response.status_code == 200:
        with open('test_audio.mp3', 'wb') as f:
            f.write(response.content)
        print("Audio generated: test_audio.mp3")
    else:
        print(f"Error: {response.json()}")

if __name__ == '__main__':
    test_health()
    test_providers()
    test_generate_audio()
```

Run: `python test_api.py`

### Manual Testing

Use Postman or similar tool:

1. **Import endpoints:**
   - POST `http://localhost:5000/api/generate-audio`
   - GET `http://localhost:5000/api/health`
   - GET `http://localhost:5000/api/providers`

2. **Test Generate Audio:**
   - Method: POST
   - Body (JSON):
   ```json
   {
     "ssml": "<speak>नमस्ते <break time='1s'/> दोस्त</speak>",
     "voice_id": "adarsh",
     "provider": "elevenlabs",
     "language": "hi-IN"
   }
   ```

---

## Troubleshooting

### Backend won't start

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
# Then reinstall dependencies
pip install -r requirements.txt
```

### API returns 500 error

**Solution:**
1. Check API key is correct in `.env`
2. Verify provider library is installed
3. Check logs for detailed error
4. Test provider credentials separately

### CORS error in browser

**Solution:** Both backends have CORS enabled. If still getting error:

```python
# For Flask, add to script
from flask_cors import CORS
CORS(app)

# For Express
const cors = require('cors');
app.use(cors());
```

### Audio generation timeout

**Solution:**
1. Reduce text length
2. Increase backend timeout
3. Check internet connection
4. Verify provider API is responsive

---

## Environment Variables Checklist

- [ ] `ELEVENLABS_API_KEY` - ElevenLabs
- [ ] `SARVAM_API_KEY` - Sarvam AI
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` - Google Cloud
- [ ] `AZURE_SPEECH_KEY` - Azure
- [ ] `AZURE_SPEECH_REGION` - Azure region

---

## API Endpoints Reference

### POST /api/generate-audio

**Request:**
```json
{
  "ssml": "<speak>Text with SSML</speak>",
  "voice_id": "adarsh",
  "voice_name": "Adarsh - Male Voice",
  "provider": "elevenlabs",
  "language": "hi-IN"
}
```

**Response:**
- Success: Audio file (MP3 binary data)
- Error: `{ "error": "Error message" }`

### GET /api/providers

**Response:**
```json
{
  "providers": [
    {
      "id": "elevenlabs",
      "name": "ElevenLabs",
      "voices": ["adarsh", "priya", "akshay"]
    }
  ]
}
```

### GET /api/health

**Response:**
```json
{
  "status": "ok",
  "message": "Hindi TTS API is running"
}
```

---

## Next Steps

1. ✅ Choose Python or Node.js backend
2. ✅ Install dependencies
3. ✅ Get API keys from providers
4. ✅ Create `.env` file with credentials
5. ✅ Run backend server
6. ✅ Test with curl/Postman
7. ✅ Update frontend URL if needed
8. ✅ Deploy to cloud (optional)

---

**Version:** 1.0
**Last Updated:** January 23, 2026
**Status:** Complete & Ready
