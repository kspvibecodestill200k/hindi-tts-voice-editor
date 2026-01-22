# API Keys Management Guide

## Table of Contents
1. [Security Overview](#security-overview)
2. [Getting API Keys](#getting-api-keys)
3. [Local Development Setup](#local-development-setup)
4. [Production Setup](#production-setup)
5. [Using Keys in Code](#using-keys-in-code)
6. [Monitoring & Rotation](#monitoring--rotation)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Security Overview

### ⚠️ CRITICAL RULES

```
NEVER:
❌ Hardcode API keys in your code
❌ Commit .env file to GitHub
❌ Share API keys in emails or chat
❌ Use same key for dev and production
❌ Store keys in client-side JavaScript

ALWAYS:
✅ Use environment variables
✅ Create .gitignore to exclude .env
✅ Use different keys for each environment
✅ Rotate keys regularly
✅ Monitor key usage
✅ Keep backend API private (don't expose to frontend)
```

### Key Architecture

```
┌─────────────────────────────────┐
│   Frontend (Browser)            │
│   index.html                    │
│   script.js                     │
│                                 │
│   ❌ NO API KEYS HERE          │
└─────────────────────────────────┘
           ↓ (API request)
┌─────────────────────────────────┐
│   Your Backend Server           │
│   backend_flask.py              │
│   backend_express.js            │
│                                 │
│   ✅ API KEYS HERE (in .env)   │
└─────────────────────────────────┘
           ↓ (with API key)
┌─────────────────────────────────┐
│   TTS Provider APIs             │
│   ElevenLabs                    │
│   Sarvam AI                     │
│   Google Cloud                  │
│   Azure                         │
└─────────────────────────────────┘
```

---

## Getting API Keys

### 1. ElevenLabs API Key

#### Steps:

1. Go to https://elevenlabs.io/sign-up
2. Create account
3. Go to https://elevenlabs.io/app/settings/api-keys
4. Click "Generate API Key"
5. Copy the key (looks like: `sk-xxx...`)
6. **Store safely** (don't share)

#### Usage:
```
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Pricing:
- Free: 10,000 characters/month
- Paid: $5-99/month based on usage

---

### 2. Sarvam AI API Key

#### Steps:

1. Go to https://sarvam.ai/
2. Sign up or login
3. Go to Dashboard → API Keys
4. Create new API key
5. Copy the key
6. **Store safely**

#### Usage:
```
SARVAM_API_KEY=your-sarvam-api-key-here
```

#### Pricing:
- Varies by usage
- Check their dashboard for costs

---

### 3. Google Cloud Text-to-Speech API Key

#### Steps (More Complex):

1. Go to https://console.cloud.google.com/
2. Create new project (or select existing)
   - Click project dropdown at top
   - Click "New Project"
   - Name: `hindi-tts`
   - Click "Create"
3. Enable Text-to-Speech API
   - Search "Text-to-Speech API"
   - Click on it
   - Click "Enable"
4. Create Service Account
   - Go to "Credentials" (left sidebar)
   - Click "Create Credentials" → "Service Account"
   - Fill in details:
     - Service account name: `tts-service`
     - Service account ID: (auto-filled)
     - Click "Create and Continue"
5. Create Key
   - Click the service account created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Click "Create" (downloads JSON file)
6. **Store the JSON file safely**

#### Usage:

```
# Option 1: Environment variable with full JSON
GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'

# Option 2: Path to JSON file (simpler)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

#### In Code (Python):
```python
from google.cloud import texttospeech
import os

# Automatically loads from GOOGLE_APPLICATION_CREDENTIALS
client = texttospeech.TextToSpeechClient()
```

#### In Code (Node.js):
```javascript
const textToSpeech = require('@google-cloud/text-to-speech');

// Automatically loads from GOOGLE_APPLICATION_CREDENTIALS
const client = new textToSpeech.TextToSpeechClient();
```

#### Pricing:
- Free: 0-1 million characters/month
- Paid: $16 per million characters after free tier

---

### 4. Microsoft Azure Speech API Key

#### Steps:

1. Go to https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/
2. Click "Try for free" or "Create"
3. Sign in with Microsoft account
4. Go to https://portal.azure.com/
5. Create "Speech" resource
   - Search "Speech"
   - Click "Create"
   - Fill in:
     - **Subscription**: (select yours)
     - **Resource group**: Create new or select
     - **Region**: `East US` (or closest to you)
     - **Name**: `hindi-tts-speech`
     - **Pricing tier**: Free F0 (or S0 for paid)
   - Click "Review + create" → "Create"
6. Go to resource → "Keys and Endpoint"
7. Copy:
   - **Key 1** (primary)
   - **Endpoint**

#### Usage:
```
AZURE_SPEECH_KEY=your-key-here
AZURE_SPEECH_REGION=eastus
```

#### In Code (Python):
```python
import azure.cognitiveservices.speech as speechsdk

key = os.getenv('AZURE_SPEECH_KEY')
region = os.getenv('AZURE_SPEECH_REGION')

speech_config = speechsdk.SpeechConfig(subscription=key, region=region)
```

#### Pricing:
- Free: 5 hours/month
- Paid: $1.00 per 1 million characters

---

## Local Development Setup

### Step 1: Create `.env` File

In your project root directory:

```bash
# .env (DO NOT COMMIT THIS FILE)

# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Sarvam AI
SARVAM_API_KEY=your-sarvam-key

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Azure Speech
AZURE_SPEECH_KEY=your-azure-key
AZURE_SPEECH_REGION=eastus

# Flask/Express settings
FLASK_ENV=development
NODE_ENV=development
```

### Step 2: Create `.gitignore`

```bash
# .gitignore (in root of project)

# Environment variables - NEVER commit
.env
.env.local
.env.*.local
.env.development

# Google Cloud service account
service-account-key.json

# Dependencies
node_modules/
__pycache__/
*.pyc
venv/
env/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

### Step 3: Load Keys in Your Backend

#### Python Flask:

```python
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access keys
elevenlabs_key = os.getenv('ELEVENLABS_API_KEY')
sarvam_key = os.getenv('SARVAM_API_KEY')
google_creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
azure_key = os.getenv('AZURE_SPEECH_KEY')
azure_region = os.getenv('AZURE_SPEECH_REGION')

# Validate keys are loaded
if not elevenlabs_key:
    raise ValueError("ELEVENLABS_API_KEY not found in .env")
```

#### Node.js/Express:

```javascript
require('dotenv').config();

// Access keys
const elevenlabsKey = process.env.ELEVENLABS_API_KEY;
const sarvamKey = process.env.SARVAM_API_KEY;
const googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const azureKey = process.env.AZURE_SPEECH_KEY;
const azureRegion = process.env.AZURE_SPEECH_REGION;

// Validate keys are loaded
if (!elevenlabsKey) {
    throw new Error('ELEVENLABS_API_KEY not found in .env');
}
```

---

## Production Setup

### On Heroku

```bash
# Set environment variables
heroku config:set ELEVENLABS_API_KEY="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
heroku config:set SARVAM_API_KEY="your-key"
heroku config:set AZURE_SPEECH_KEY="your-key"
heroku config:set AZURE_SPEECH_REGION="eastus"

# For Google Cloud, either:
# Option 1: Paste full JSON
heroku config:set GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account",...}'

# Option 2: Upload file and set path
# (More complex, see Railway/Render below)

# Verify
heroku config

# Your app automatically loads these in production
```

### On Railway

```bash
# Via CLI
railway variables

# Or via Web UI:
# 1. Go to https://railway.app
# 2. Select your project
# 3. Click "Variables" tab
# 4. Add each key:
#    ELEVENLABS_API_KEY = sk_xxx...
#    SARVAM_API_KEY = xxx...
#    AZURE_SPEECH_KEY = xxx...
#    AZURE_SPEECH_REGION = eastus
# 5. For Google Cloud, paste the JSON or set path
```

### On Render

```
1. Go to https://render.com
2. Select your service
3. Click "Settings"
4. Scroll to "Environment"
5. Click "Add Environment Variable"
6. Fill in:
   Key: ELEVENLABS_API_KEY
   Value: sk_xxx...
7. Repeat for all 4 keys
8. Service automatically restarts with new variables
```

### For Google Cloud JSON File (Render/Railway)

If using file path instead of inline JSON:

```bash
# 1. Upload to server (not recommended, complex)
# 2. OR: Convert JSON to single-line string

# To convert JSON:
cat service-account-key.json | tr '\n' ' '

# Then set as environment variable:
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"..."}
```

**Better approach:** Inline the JSON in environment variables.

---

## Using Keys in Code

### Example: Flask Backend

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

class ElevenLabsProvider:
    def __init__(self):
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY not set")
        self.base_url = "https://api.elevenlabs.io/v1"
    
    def generateAudio(self, ssml, voice_id, language):
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "text": ssml,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        url = f"{self.base_url}/text-to-speech/{voice_id}"
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise Exception(f"ElevenLabs API error: {response.text}")
        
        return response.content  # MP3 binary

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    data = request.json
    ssml = data.get('ssml')
    voice_id = data.get('voice_id')
    provider_name = data.get('provider')
    
    try:
        if provider_name == 'elevenlabs':
            provider = ElevenLabsProvider()
            audio = provider.generateAudio(ssml, voice_id, 'hi-IN')
            return audio, 200, {'Content-Type': 'audio/mpeg'}
        else:
            return {'error': 'Unknown provider'}, 400
    
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Example: Express Backend

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

class ElevenLabsProvider {
    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        if (!this.apiKey) {
            throw new Error('ELEVENLABS_API_KEY not set');
        }
        this.baseUrl = 'https://api.elevenlabs.io/v1';
    }
    
    async generateAudio(ssml, voiceId, language) {
        const headers = {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
        };
        
        const payload = {
            text: ssml,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        };
        
        const url = `${this.baseUrl}/text-to-speech/${voiceId}`;
        
        try {
            const response = await axios.post(url, payload, { 
                headers,
                responseType: 'arraybuffer'
            });
            return response.data; // MP3 binary
        } catch (error) {
            throw new Error(`ElevenLabs API error: ${error.message}`);
        }
    }
}

app.post('/api/generate-audio', async (req, res) => {
    const { ssml, voice_id, provider } = req.body;
    
    try {
        if (provider === 'elevenlabs') {
            const provider = new ElevenLabsProvider();
            const audio = await provider.generateAudio(ssml, voice_id, 'hi-IN');
            
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audio);
        } else {
            res.status(400).json({ error: 'Unknown provider' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

---

## Monitoring & Rotation

### Monitor Key Usage

#### ElevenLabs
1. Go to https://elevenlabs.io/app/usage
2. See:
   - Characters used
   - API calls made
   - Cost incurred
3. Set billing alerts in settings

#### Google Cloud
1. Go to https://console.cloud.google.com/billing
2. Click your project
3. View usage and costs
4. Set budget alerts

#### Azure
1. Go to https://portal.azure.com/
2. Click your Speech resource
3. Go to "Cost Management" → "Cost analysis"
4. View usage and costs

#### Sarvam AI
1. Go to Dashboard
2. View API usage statistics

### Rotate Keys (Best Practice)

Every 3-6 months or if compromised:

#### ElevenLabs:
```bash
# 1. Go to https://elevenlabs.io/app/settings/api-keys
# 2. Click "Regenerate" on old key
# 3. Copy new key
# 4. Update on Heroku/Railway/Render:
heroku config:set ELEVENLABS_API_KEY="new_key"
# OR
railway variables  # Update in UI
# 5. Test your app
# 6. Delete old key from dashboard
```

#### All Providers:
1. Generate new key in provider dashboard
2. Update on hosting platform
3. Test application
4. Delete old key
5. Document rotation in changelog

### Key Rotation Script

```python
# rotate_keys.py
import os
from datetime import datetime

def rotate_api_key(provider, old_key, new_key):
    """
    Rotate API key for a provider
    """
    timestamp = datetime.now().isoformat()
    
    # Log rotation
    with open('api_key_rotation.log', 'a') as f:
        f.write(f"{timestamp} - Rotated {provider} key\n")
    
    # Update environment variable
    os.environ[f'{provider.upper()}_API_KEY'] = new_key
    
    print(f"✓ {provider} key rotated successfully")

if __name__ == '__main__':
    rotate_api_key('elevenlabs', 'old_key', 'new_key')
    print("Update Heroku/Railway with new keys!")
```

---

## Security Best Practices

### 1. Least Privilege
```
✅ Use separate API keys for:
   - Development
   - Testing
   - Production

✅ Each key should only access what it needs:
   - If possible, limit to specific endpoints
   - If possible, limit by IP address
```

### 2. Secure Storage

```
Development:
✅ .env file (local only, not in git)
✅ Read from environment variables in code
✅ Never log or print API keys

Production:
✅ Use hosting platform's secret management
✅ Heroku: heroku config:set
✅ Railway: Variables tab
✅ Render: Environment section
✅ Never hardcode anything
```

### 3. API Key Monitoring

```python
# Bad: Logs the key
print(f"Connecting with key: {api_key}")
logger.info(f"API key is: {api_key}")

# Good: Logs masked key
print(f"Connecting with key: {api_key[:10]}...")
logger.info(f"API key set: {'*' * len(api_key)}")
```

### 4. Error Handling

```python
# Bad: Reveals the key in error message
raise Exception(f"Auth failed with key {api_key}")

# Good: Hides the key
raise Exception(f"Authentication failed with provider API")
```

### 5. Rate Limiting

```python
# Example: Prevent abuse
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/generate-audio', methods=['POST'])
@limiter.limit("10 per minute")  # Max 10 requests per minute per IP
def generate_audio():
    # ... your code
```

### 6. HTTPS Only

```
✅ All communication must be HTTPS
✅ Use strong SSL/TLS certificates
✅ Redirect HTTP to HTTPS
✅ Set HSTS headers

Flask:
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True

Express:
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

### 7. Key Expiration

```
Set calendar reminders to:
- Review key usage monthly
- Rotate keys quarterly (every 3 months)
- Update documentation when keys change
- Test after every rotation
```

---

## Troubleshooting

### API Key Not Found Error

```
Error: "ELEVENLABS_API_KEY not found"

Causes:
1. .env file not created
2. Key name wrong in .env
3. python-dotenv not installed (Python)
4. dotenv not installed (Node.js)
5. Key not set on hosting platform

Fix:
# Python
pip install python-dotenv

# Node.js
npm install dotenv

# Then check .env file:
cat .env  # Should show: ELEVENLABS_API_KEY=sk_...

# On Heroku
heroku config  # Should show your keys
```

### Authentication Failed

```
Error: "Invalid API key" or "Unauthorized"

Causes:
1. API key is incorrect
2. API key is from wrong provider
3. API key is expired or rotated
4. API key doesn't have required permissions

Fix:
1. Double-check key in provider dashboard
2. Copy-paste (don't retype) the key
3. Test with curl:

curl -H "xi-api-key: YOUR_KEY" \
  https://api.elevenlabs.io/v1/voices

4. Check if key needs to be activated
5. Wait 5-10 minutes after creating key
```

### Key Accidentally Committed to Git

```
CRITICAL: Key is now exposed!

Steps:
1. IMMEDIATELY regenerate the key on provider dashboard
2. Remove it from Git history:

# Option 1: Remove recent commit
git reset --soft HEAD~1
git reset .env
git commit -m "Remove .env"

# Option 2: Use BFG Repo-Cleaner (for history)
# See: https://rtyley.github.io/bfg-repo-cleaner/

3. Add .env to .gitignore
4. Push changes

git add .gitignore
git commit -m "Add .env to .gitignore"
git push
```

### Multiple Keys for Multiple Providers

```
If using all 4 providers, set all keys:

# .env file
ELEVENLABS_API_KEY=sk_...
SARVAM_API_KEY=xxx...
GOOGLE_APPLICATION_CREDENTIALS=/path/to/json
AZURE_SPEECH_KEY=xxx...
AZURE_SPEECH_REGION=eastus

# Your code chooses provider based on user selection
def get_provider(provider_name):
    if provider_name == 'elevenlabs':
        return ElevenLabsProvider()
    elif provider_name == 'sarvam':
        return SarvamAIProvider()
    # ... etc
```

### Key Has Limited Quota

```
If you hit API limits:

Causes:
1. Free tier exhausted
2. Monthly quota exceeded
3. Rate limit hit

Solutions:
1. Upgrade to paid plan
2. Wait for quota reset (monthly)
3. Implement caching to reduce API calls
4. Use cheapest TTS provider (Google/Azure)

Caching example (Python):
from functools import lru_cache

@lru_cache(maxsize=100)
def generate_audio_cached(text, voice_id, provider):
    # Only call API once per unique input
    return generate_audio(text, voice_id, provider)
```

---

## Checklist: Before Going Live

```
✅ All 4 API keys obtained
✅ .env file created locally
✅ .env added to .gitignore
✅ .env.example created (without actual keys)
✅ Keys set on Heroku/Railway/Render
✅ No keys visible in logs
✅ HTTPS enabled on backend
✅ CORS properly configured
✅ Error messages don't expose keys
✅ Rate limiting implemented
✅ Keys tested with curl/Postman
✅ App tested end-to-end
✅ Backup of keys stored securely
✅ Key rotation schedule documented
✅ Monitoring alerts configured
✅ Team trained on security practices
```

---

**Version:** 1.0 | **Date:** January 23, 2026 | **Status:** Complete
