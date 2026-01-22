# GitHub & Deployment Guide

## Quick Overview

```
Your Project Structure:
├── Frontend (index.html, styles.css, script.js)
├── Backend (backend_flask.py OR backend_express.js)
└── Docs (all .md files)

Deployment Strategy:
┌─────────────────────────────────────────┐
│  Frontend (Static HTML/CSS/JS)          │
│  Host on: GitHub Pages / Netlify        │
│           / Vercel (FREE)               │
│           OR same server as backend     │
└─────────────────────────────────────────┘
               ↓ API calls to ↓
┌─────────────────────────────────────────┐
│  Backend (Flask/Express)                │
│  Host on: Heroku / Railway / Render     │
│           / AWS / Google Cloud (FREE)   │
└─────────────────────────────────────────┘
```

---

## Step 1: Create GitHub Repository

### 1.1 Initialize Git Locally

```bash
# Navigate to your project folder
cd "d:\ACCIO\Text to Speech AI"

# Initialize git repository
git init

# Check files (should see all your files)
git status

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Hindi TTS homepage with editor modal and SSML conversion"

# Rename branch to main (if needed)
git branch -M main
```

### 1.2 Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `hindi-tts-voice-editor` (or your choice)
   - **Description**: "Interactive Hindi text-to-speech editor with ElevenLabs, Sarvam AI, Google Cloud, and Azure support"
   - **Visibility**: Public (for hosting with GitHub Pages)
   - **Initialize**: Leave unchecked (you already have files)
3. Click "Create repository"

### 1.3 Connect Local to GitHub

```bash
# Copy the repository URL from GitHub (e.g., https://github.com/YOUR_USERNAME/hindi-tts-voice-editor.git)

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/hindi-tts-voice-editor.git

# Push to GitHub
git branch -M main
git push -u origin main

# Verify
git remote -v
```

After this, your code is on GitHub! ✅

---

## Step 2: Choose Hosting Option

### Option A: Frontend + Backend on Same Server (SIMPLEST)

**Best for:** Single deployment, easier management

```
GitHub Repository
    ↓
Deploy entire project to one server
    ↓
Server runs backend API + serves frontend files
```

**Hosting Providers:**
- **Heroku** (free tier available)
- **Railway** (free $5/month credit)
- **Render** (free tier available)
- **Fly.io** (free tier available)

---

### Option B: Frontend on GitHub Pages + Backend on Separate Server (RECOMMENDED)

**Best for:** Scalability, separation of concerns

```
GitHub Repository
    ├─ Frontend files
    │  ↓ (push to gh-pages branch)
    │  → GitHub Pages (FREE, no limits)
    │
    └─ Backend files
       ↓ (push to backend platform)
       → Heroku / Railway / Render / AWS
```

**Frontend:** GitHub Pages (FREE)  
**Backend:** Heroku, Railway, or Render (FREE tier)

---

### Option C: Frontend on Netlify/Vercel + Backend on Separate Server

**Best for:** Best performance, easier CI/CD

```
GitHub Repository
    ├─ Frontend
    │  ↓ (auto-deploys on push)
    │  → Netlify or Vercel (FREE)
    │
    └─ Backend
       ↓ (auto-deploys on push)
       → Heroku / Railway / Render
```

---

## Step 3: Deploy Frontend (Choose One)

### **Option 1: GitHub Pages (FREE, Recommended)**

#### 3.1 Prepare Repository Structure

Your repo should have:
```
repo/
├── index.html
├── styles.css
├── script.js
├── samples/
│   └── sample.txt
├── backend_flask.py
├── backend_express.js
├── .gitignore
└── README.md
```

#### 3.2 Configure GitHub Pages

1. Go to GitHub → Your Repository → Settings
2. Scroll to "Pages" section (left sidebar)
3. Set:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
4. Click "Save"

After ~2 minutes, your site is live at:  
`https://YOUR_USERNAME.github.io/hindi-tts-voice-editor`

#### 3.3 Important: Update Backend URL in script.js

Since your frontend will be on GitHub Pages, update the API endpoint:

```javascript
// In script.js, find generateAudio() function
// Change from:
const response = await axios.post('http://localhost:5000/api/generate-audio', {

// To your deployed backend URL:
const response = await axios.post('https://your-backend.herokuapp.com/api/generate-audio', {
// OR
const response = await axios.post('https://your-backend.railway.app/api/generate-audio', {
// OR
const response = await axios.post('https://your-backend.render.com/api/generate-audio', {
```

---

### **Option 2: Netlify (FREE)**

#### 3.1 Connect GitHub

1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub (authorize)
4. Choose your `hindi-tts-voice-editor` repository
5. Set build settings:
   - Build command: (leave empty - static site)
   - Publish directory: . (root)
6. Click "Deploy"

Your site is live at: `https://YOUR-SITE-NAME.netlify.app`

#### 3.2 Update Backend URL in script.js

```javascript
// Change endpoint to your deployed backend
const response = await axios.post('https://your-backend.herokuapp.com/api/generate-audio', {
```

#### 3.3 Configure Environment Variables (Frontend)

If you need to store API keys on frontend (not recommended):

1. Netlify → Settings → Build & Deploy → Environment
2. Add `VITE_BACKEND_URL` = `https://your-backend-url.com`
3. Reference in script.js: `process.env.VITE_BACKEND_URL`

---

### **Option 3: Vercel (FREE)**

#### 3.1 Connect GitHub

1. Go to https://vercel.com
2. Click "Import Project"
3. Select GitHub & authorize
4. Choose `hindi-tts-voice-editor` repository
5. Click "Import"
6. Vercel auto-detects and deploys!

Your site is live at: `https://YOUR-PROJECT.vercel.app`

#### 3.2 Update Backend URL in script.js

```javascript
const response = await axios.post('https://your-backend.herokuapp.com/api/generate-audio', {
```

---

## Step 4: Deploy Backend (Choose One)

### **Option A: Heroku (Easiest)**

#### 4.1 Prepare Your Backend

Create these files in root:

**For Python Flask:**

```bash
# requirements.txt (list all dependencies)
Flask==2.3.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
google-cloud-texttospeech==2.13.0
azure-cognitiveservices-speech==1.31.0
gunicorn==21.2.0
```

**For Node.js/Express:**

```bash
# package.json already exists, make sure you have:
{
  "name": "hindi-tts-backend",
  "version": "1.0.0",
  "main": "backend_express.js",
  "scripts": {
    "start": "node backend_express.js",
    "dev": "nodemon backend_express.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "axios": "^1.4.0",
    "@google-cloud/text-to-speech": "^5.0.0",
    "microsoft-cognitiveservices-speech-sdk": "^1.31.0"
  }
}
```

Also create `Procfile`:

```
# For Python Flask:
web: gunicorn backend_flask:app

# For Node.js Express:
web: node backend_express.js
```

#### 4.2 Install Heroku CLI

**Windows:**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or using npm:
npm install -g heroku
```

**Mac/Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 4.3 Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create hindi-tts-backend

# Add environment variables
heroku config:set ELEVENLABS_API_KEY="your_api_key"
heroku config:set SARVAM_API_KEY="your_api_key"
heroku config:set GOOGLE_APPLICATION_CREDENTIALS="path_to_json"
heroku config:set AZURE_SPEECH_KEY="your_key"
heroku config:set AZURE_SPEECH_REGION="eastus"

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Test
curl https://hindi-tts-backend.herokuapp.com/api/health
```

Your backend is now live at: `https://hindi-tts-backend.herokuapp.com`

⚠️ **Note:** Heroku free tier was discontinued. Use Railway or Render instead.

---

### **Option B: Railway (Recommended - FREE $5/month)**

#### 4.1 Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Connect to GitHub
railway link

# Set environment variables
railway variables

# Deploy
railway up

# Get URL
railway status
```

Your backend is at: `https://YOUR-PROJECT.railway.app`

---

### **Option C: Render (FREE)**

#### 4.1 Prepare Backend

Make sure you have:
- `requirements.txt` (Python) or `package.json` (Node.js)
- `Procfile` (already created above)
- `.env.example` (example environment variables)

#### 4.2 Deploy

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Fill in:
   - **Name**: `hindi-tts-backend`
   - **Environment**: Python 3.9 (or Node 18)
   - **Build command**: `pip install -r requirements.txt` (Python) or `npm install` (Node)
   - **Start command**: `gunicorn backend_flask:app` (Python) or `node backend_express.js` (Node)
5. Add environment variables:
   - ELEVENLABS_API_KEY
   - SARVAM_API_KEY
   - GOOGLE_APPLICATION_CREDENTIALS
   - AZURE_SPEECH_KEY
   - AZURE_SPEECH_REGION
6. Click "Create Web Service"

Your backend is at: `https://hindi-tts-backend.onrender.com`

---

## Step 5: Connect Frontend & Backend

### 5.1 Update API Endpoint in script.js

Find this in `script.js`:

```javascript
async function generateAudio() {
    const text = document.getElementById('editorText').value.trim();
    
    if (!text) {
        alert('Please enter some text');
        return;
    }
    
    try {
        const ssml = convertToSSML(text, window.currentVoiceId);
        const provider = getProviderFromVoiceId(window.currentVoiceId);
        
        // UPDATE THIS LINE WITH YOUR BACKEND URL:
        const response = await axios.post('http://localhost:5000/api/generate-audio', {
```

Change to:
```javascript
// GitHub Pages + Heroku Example:
const response = await axios.post('https://hindi-tts-backend.herokuapp.com/api/generate-audio', {

// OR GitHub Pages + Railway:
const response = await axios.post('https://hindi-tts-backend.railway.app/api/generate-audio', {

// OR GitHub Pages + Render:
const response = await axios.post('https://hindi-tts-backend.onrender.com/api/generate-audio', {
```

### 5.2 Commit and Push Changes

```bash
# Update script.js with new backend URL
git add script.js
git commit -m "Update backend API endpoint to deployed server"
git push origin main
```

Your frontend will automatically redeploy with the new endpoint!

---

## Step 6: Enable CORS

Both backends already have CORS enabled:

**Flask:**
```python
from flask_cors import CORS
CORS(app)  # Allows requests from any origin
```

**Express:**
```javascript
const cors = require('cors');
app.use(cors());
```

This allows your frontend (on GitHub Pages/Netlify) to make requests to your backend (on Heroku/Railway/Render).

---

## Step 7: Set Environment Variables Securely

### Don't Push API Keys to GitHub!

#### 7.1 Create `.gitignore`

```
# .gitignore (in root of project)
.env
.env.local
.env.*.local
node_modules/
__pycache__/
*.pyc
.DS_Store
.vscode/
```

#### 7.2 Create `.env.example`

```bash
# .env.example (share this, not .env)
ELEVENLABS_API_KEY=your_key_here
SARVAM_API_KEY=your_key_here
GOOGLE_APPLICATION_CREDENTIALS=path_or_json
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=eastus
FLASK_ENV=production
NODE_ENV=production
```

#### 7.3 Set Variables on Hosting Platform

**Heroku:**
```bash
heroku config:set ELEVENLABS_API_KEY="xxx"
```

**Railway:**
```bash
railway variables
# Then fill in the UI
```

**Render:**
Go to Service → Settings → Environment

---

## Step 8: Complete Deployment Checklist

```
FRONTEND:
☐ GitHub repository created
☐ All files committed and pushed
☐ Backend API endpoint updated in script.js
☐ Deployed to GitHub Pages / Netlify / Vercel
☐ Frontend URL: https://your-domain

BACKEND:
☐ requirements.txt / package.json created
☐ Procfile created
☐ Committed and pushed to GitHub
☐ Deployed to Heroku / Railway / Render
☐ Environment variables configured
☐ CORS enabled
☐ Backend URL: https://your-backend-domain
☐ Health check working: /api/health returns 200

INTEGRATION:
☐ Script.js updated with backend URL
☐ Frontend redeployed
☐ Test: Click voice card → text editor opens
☐ Test: Enter text → Generate audio
☐ Test: Audio plays in preview player
☐ Test: All 4 providers work (if API keys added)

OPTIONAL:
☐ Custom domain configured
☐ SSL/TLS certificates enabled (should be automatic)
☐ Analytics configured (Google Analytics)
☐ Error logging configured (Sentry)
```

---

## Deployment Architecture (Final)

```
┌─────────────────────────────────────────────────┐
│  GitHub Repository                              │
│  ├─ Frontend files (index.html, styles.css,    │
│  │  script.js)                                  │
│  ├─ Backend files (backend_flask.py OR         │
│  │  backend_express.js)                         │
│  └─ Documentation (.md files)                   │
└─────────────────────────────────────────────────┘
         ↓ (automatic deploy on push)
    ┌────┴────┐
    ↓         ↓
┌──────────┐  ┌──────────────────┐
│ GitHub   │  │ Heroku/Railway/  │
│ Pages    │  │ Render           │
│ (FREE)   │  │ (FREE tier)      │
└──────────┘  └──────────────────┘
    ↓                 ↓
Frontend URL:     Backend URL:
https://          https://
YOUR-USERNAME.    your-backend.
github.io/        herokuapp.com/
hindi-tts-        api/generate-
voice-editor      audio
```

---

## Testing After Deployment

### Test Frontend

```bash
# Visit your GitHub Pages URL
https://YOUR-USERNAME.github.io/hindi-tts-voice-editor

# Test:
1. Click on any voice card
2. Editor modal opens ✓
3. Enter text "नमस्ते"
4. Click "Generate Audio"
5. Audio plays in preview player ✓
```

### Test Backend

```bash
# Test health endpoint
curl https://your-backend.herokuapp.com/api/health

# Expected response:
# {"status": "ok"}

# Test audio generation
curl -X POST https://your-backend.herokuapp.com/api/generate-audio \
  -H "Content-Type: application/json" \
  -d '{
    "ssml": "<speak>नमस्ते</speak>",
    "voice_id": "adarsh",
    "provider": "elevenlabs",
    "language": "hi-IN"
  }'

# Should return MP3 audio binary
```

---

## Troubleshooting

### Frontend not loading from GitHub Pages

```
Check:
1. Repository is PUBLIC
2. Settings → Pages → Source = main branch
3. Files exist in root: index.html, styles.css, script.js
4. No build step needed (it's static HTML)

Fix:
1. Go to Settings → Pages
2. Change source to "main branch, / (root)"
3. Wait 2-3 minutes for redeploy
```

### Backend returning 502 Bad Gateway

```
Check:
1. Backend server is running: curl /api/health
2. Environment variables are set correctly
3. API keys are valid
4. No syntax errors in Python/Node.js code

Fix:
1. Check logs: 
   - Heroku: heroku logs --tail
   - Railway: railway logs
   - Render: Service → Logs
2. Restart service
3. Redeploy from GitHub
```

### Frontend can't reach backend (CORS error)

```
Error in browser console:
"Access to XMLHttpRequest blocked by CORS policy"

Check:
1. CORS is enabled in backend
2. Frontend URL is allowed
3. Backend URL is correctly set in script.js

Fix:
# Flask:
from flask_cors import CORS
CORS(app, origins="*")  # Allow all origins

# Express:
const cors = require('cors');
app.use(cors());
```

### API Key not working

```
Check:
1. API key is valid (test on provider's console)
2. API key is in environment variables
3. Correct environment variable name:
   - ELEVENLABS_API_KEY
   - SARVAM_API_KEY
   - GOOGLE_APPLICATION_CREDENTIALS
   - AZURE_SPEECH_KEY

Fix:
1. Update environment variable on hosting platform
2. Restart backend service
3. Test with curl to verify
```

---

## Next Steps

1. **Create GitHub account** → https://github.com/join
2. **Push code to GitHub** (follow Step 1 above)
3. **Deploy frontend** (choose GitHub Pages / Netlify / Vercel)
4. **Deploy backend** (choose Heroku / Railway / Render)
5. **Get API keys** from:
   - ElevenLabs: https://elevenlabs.io
   - Sarvam AI: https://sarvam.ai
   - Google Cloud: https://cloud.google.com/text-to-speech
   - Azure: https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/
6. **Set environment variables** on hosting platform
7. **Test** end-to-end
8. **Share URL** with others!

---

## Cost Breakdown

| Service | Price | Notes |
|---------|-------|-------|
| GitHub | FREE | Unlimited public repos |
| GitHub Pages | FREE | 1GB bandwidth/month soft limit |
| Netlify | FREE | 100GB bandwidth/month |
| Vercel | FREE | 100GB bandwidth/month |
| Heroku | ❌ Discontinued | Use Railway/Render instead |
| Railway | FREE | $5/month credit (usually enough) |
| Render | FREE | Auto-sleep after 15 min inactivity |
| **Total** | **FREE-$5/month** | Fully functional TTS app |

---

## Useful Links

- **GitHub**: https://github.com
- **GitHub Pages Docs**: https://pages.github.com
- **Netlify**: https://netlify.com
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku Alternatives**: https://www.heroku-alternatives.com

---

**Version:** 1.0 | **Date:** January 23, 2026 | **Status:** Complete
