# Complete Step-by-Step Deployment Guide

**Time Estimate:** 1-2 hours total  
**Difficulty:** Beginner-friendly  
**Prerequisites:** GitHub account, text editor

---

## Phase 1: Push Code to GitHub (15 minutes)

### Step 1.1: Install Git

**Windows:**
1. Go to https://git-scm.com/download/win
2. Download and install (use default settings)
3. Restart your computer

**Verify installation:**
```bash
git --version
# Should output: git version 2.x.x
```

### Step 1.2: Configure Git

```bash
# Set your name (use your GitHub username)
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your.email@example.com"

# Verify
git config --global user.name
git config --global user.email
```

### Step 1.3: Initialize Repository

Open PowerShell and navigate to your project:

```bash
# Change to your project directory
cd "d:\ACCIO\Text to Speech AI"

# Check if you're in the right place
ls  # Should show: index.html, styles.css, script.js, etc.

# Initialize git repository
git init

# Check status
git status
# Should show all files as "untracked"
```

### Step 1.4: Create .gitignore File

```bash
# Create .gitignore to exclude .env and other files
cat > .gitignore << 'EOF'
.env
.env.local
.env.*.local
node_modules/
__pycache__/
*.pyc
venv/
env/
.DS_Store
Thumbs.db
*.log
logs/
.vscode/
.idea/
EOF
```

**Verify:**
```bash
cat .gitignore  # Should show the content above
```

### Step 1.5: Create .env.example File

```bash
# Create example file (without actual keys)
cat > .env.example << 'EOF'
# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Sarvam AI
SARVAM_API_KEY=your-sarvam-key-here

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Azure Speech
AZURE_SPEECH_KEY=your-azure-key-here
AZURE_SPEECH_REGION=eastus

# Environment
FLASK_ENV=development
NODE_ENV=development
EOF
```

### Step 1.6: Add Files to Git

```bash
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status
# Should NOT show .env file!
# Should show: index.html, styles.css, script.js, backend_flask.py, etc.
```

### Step 1.7: Create Initial Commit

```bash
git commit -m "Initial commit: Hindi TTS voice editor with SSML support"

# Verify
git log
# Should show your commit with message
```

### Step 1.8: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `hindi-tts-voice-editor`
   - **Description:** Interactive Hindi text-to-speech editor with ElevenLabs, Sarvam AI, Google Cloud, and Azure support
   - **Visibility:** 🔘 Public (required for GitHub Pages)
   - **Initialize:** Leave unchecked
3. Click **"Create repository"**

### Step 1.9: Connect Local Repository to GitHub

```bash
# Copy your repository URL from GitHub
# Format: https://github.com/YOUR_USERNAME/hindi-tts-voice-editor.git

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/hindi-tts-voice-editor.git

# Verify
git remote -v
# Should show: origin (fetch/push)

# Push to GitHub (first time)
git branch -M main
git push -u origin main

# Wait for it to complete...
```

### Step 1.10: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/hindi-tts-voice-editor
2. Should see all your files (index.html, styles.css, script.js, etc.)
3. Should NOT see .env file

✅ **Phase 1 Complete!**

---

## Phase 2: Deploy Frontend to GitHub Pages (10 minutes)

### Step 2.1: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/hindi-tts-voice-editor
2. Click **Settings** (top menu)
3. Scroll to **"Pages"** section (left sidebar)
4. Under "Build and deployment":
   - Select **"Deploy from a branch"**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**

### Step 2.2: Wait for Deployment

- GitHub will start deploying automatically
- Wait 2-3 minutes
- You'll see a blue checkmark when done

### Step 2.3: Find Your Live URL

1. Go to Settings → Pages
2. You'll see: **"Your site is live at https://YOUR_USERNAME.github.io/hindi-tts-voice-editor"**
3. Click the URL to visit your site

### Step 2.4: Test Frontend

1. Open your live site URL
2. You should see:
   - ✅ Voice gallery with 12 voice cards
   - ✅ Each card has "Select & Edit" button
   - ✅ Responsive design (works on mobile)

⚠️ **NOTE:** Audio won't work yet because backend isn't deployed

✅ **Phase 2 Complete!**

---

## Phase 3: Deploy Backend to Render (25 minutes)

### Step 3.1: Prepare Backend Files

Make sure these files exist in your project:

**For Python/Flask:**

Create `requirements.txt`:
```bash
cat > requirements.txt << 'EOF'
Flask==2.3.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
google-cloud-texttospeech==2.13.0
azure-cognitiveservices-speech==1.31.0
gunicorn==21.2.0
EOF
```

Create `Procfile`:
```bash
cat > Procfile << 'EOF'
web: gunicorn backend_flask:app
EOF
```

**For Node.js/Express:**

Create/verify `package.json`:
```bash
cat > package.json << 'EOF'
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
EOF
```

Create `Procfile`:
```bash
cat > Procfile << 'EOF'
web: node backend_express.js
EOF
```

### Step 3.2: Commit New Files

```bash
# Add the new files
git add requirements.txt package.json Procfile

# Commit
git commit -m "Add deployment files for Render"

# Push to GitHub
git push origin main
```

### Step 3.3: Create Render Account

1. Go to https://render.com
2. Click **"Sign up"**
3. Sign up with GitHub (recommended):
   - Click "Continue with GitHub"
   - Authorize Render
4. Click **"Create account"**

### Step 3.4: Deploy to Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Click **"Connect GitHub"**
   - Authorize Render
   - Select your repository: `hindi-tts-voice-editor`
   - Click "Install"
5. Fill in deployment settings:
   - **Name:** `hindi-tts-backend`
   - **Environment:** Select your language
     - Python → Python 3.9
     - Node → Node 18
   - **Build Command:**
     - Python: `pip install -r requirements.txt`
     - Node: `npm install`
   - **Start Command:**
     - Python: `gunicorn backend_flask:app`
     - Node: `node backend_express.js`
   - **Instance Type:** Free
6. Click **"Create Web Service"**

### Step 3.5: Wait for Deployment

- Render will build and deploy automatically
- Watch the logs (should see "Build successful")
- Wait for: **"Your service is live"** message
- This takes 3-5 minutes

### Step 3.6: Get Your Backend URL

1. Your URL appears at top: **`https://hindi-tts-backend.onrender.com`** (or similar)
2. Copy this URL - you'll need it next

### Step 3.7: Test Backend Health Check

```bash
# Test from PowerShell
curl https://hindi-tts-backend.onrender.com/api/health

# Should return: {"status": "ok"}
```

✅ **Phase 3 Complete!**

---

## Phase 4: Connect Frontend & Backend (10 minutes)

### Step 4.1: Update script.js

In your local project, open `script.js` and find the `generateAudio()` function.

**Look for:**
```javascript
const response = await axios.post('http://localhost:5000/api/generate-audio', {
```

**Replace with:**
```javascript
const response = await axios.post('https://hindi-tts-backend.onrender.com/api/generate-audio', {
```

### Step 4.2: Also Update Other Endpoints (if any)

Search for any other `localhost:5000` references and replace with your Render URL.

### Step 4.3: Commit Changes

```bash
git add script.js
git commit -m "Update backend URL to Render deployment"
git push origin main
```

### Step 4.4: Wait for Frontend Redeploy

- GitHub Pages will automatically redeploy
- Wait 1-2 minutes
- Your frontend now knows where the backend is!

### Step 4.5: Test Connection

1. Open your frontend: https://YOUR_USERNAME.github.io/hindi-tts-voice-editor
2. Click any voice card → Editor opens
3. Enter text: "नमस्ते"
4. Click "Generate Audio"
5. ⚠️ **You'll see an error** (API keys not set yet) - that's expected!

**Expected error:** `{"error": "ELEVENLABS_API_KEY not found"}`

✅ **Phase 4 Complete!**

---

## Phase 5: Get API Keys (30 minutes)

### Step 5.1: Get ElevenLabs Key (5 minutes)

1. Go to https://elevenlabs.io/sign-up
2. Create account (or login)
3. Go to https://elevenlabs.io/app/settings/api-keys
4. Click **"+ Create New API Key"**
5. Name it: `TTS_Production`
6. Click **"Create"**
7. **COPY THE KEY** (looks like: `sk_xxx...`)
8. Click somewhere else to close

**Save this key securely** (you'll need it next)

### Step 5.2: Get Sarvam AI Key (5 minutes)

1. Go to https://sarvam.ai
2. Sign up or login
3. Go to Dashboard → API Keys
4. Click **"Create New API Key"**
5. **COPY THE KEY**

**Save this key securely**

### Step 5.3: Get Google Cloud Key (10 minutes - Most Complex)

1. Go to https://console.cloud.google.com/
2. **Create New Project:**
   - Click project dropdown (top-left)
   - Click **"New Project"**
   - Name: `hindi-tts`
   - Click **"Create"**
   - Wait for it to complete

3. **Enable Text-to-Speech API:**
   - Search: "Text-to-Speech API"
   - Click on it
   - Click **"Enable"**
   - Wait 2 minutes

4. **Create Service Account:**
   - Go to **"APIs & Services"** → **"Credentials"** (left sidebar)
   - Click **"+ Create Credentials"** → **"Service Account"**
   - Fill in:
     - Service account name: `tts-service`
     - Service account ID: (auto-filled)
   - Click **"Create and Continue"**
   - Click **"Continue"** (skip optional step)
   - Click **"Done"**

5. **Create API Key:**
   - Click the service account you created
   - Go to **"Keys"** tab
   - Click **"Add Key"** → **"Create new key"**
   - Choose **"JSON"**
   - Click **"Create"** (downloads JSON file automatically)

6. **Save the JSON file:**
   - Move the downloaded file to your project folder
   - Rename it: `google-service-account.json`
   - **Don't commit this to GitHub!**

**Save the path:** `google-service-account.json`

### Step 5.4: Get Azure Speech Key (10 minutes)

1. Go to https://portal.azure.com/
2. Sign in with Microsoft account
3. **Create Speech Resource:**
   - Click **"Create a resource"**
   - Search: "Speech"
   - Click "Speech"
   - Click **"Create"**
4. **Fill in details:**
   - Subscription: (select yours)
   - Resource group: Click **"Create new"** → Name: `hindi-tts`
   - Region: `East US` (or closest to you)
   - Name: `hindi-tts-speech`
   - Pricing tier: **Free (F0)** (or S0 for paid)
   - Check "I confirm..."
   - Click **"Review + create"** → **"Create"**

5. **Get Keys:**
   - Wait for deployment (1 minute)
   - Click **"Go to resource"**
   - Left sidebar → **"Keys and Endpoint"**
   - Copy:
     - **Key 1** (the actual key)
     - **Location/Region** (e.g., `eastus`)

**Save both values**

✅ **Phase 5 Complete!**

---

## Phase 6: Store Keys Locally (10 minutes)

### Step 6.1: Create .env File

In your project root, create a `.env` file (it exists in .gitignore, so won't be committed):

```bash
cat > .env << 'EOF'
# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Sarvam AI
SARVAM_API_KEY=your-sarvam-key-here

# Google Cloud - Use absolute path to the JSON file
GOOGLE_APPLICATION_CREDENTIALS=google-service-account.json

# Azure Speech
AZURE_SPEECH_KEY=your-azure-key-here
AZURE_SPEECH_REGION=eastus

# Environment
FLASK_ENV=development
NODE_ENV=development
EOF
```

### Step 6.2: Fill in Your Actual Keys

Open `.env` in your text editor and replace:
- `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Paste your ElevenLabs key
- `your-sarvam-key-here` → Paste your Sarvam key
- `google-service-account.json` → Path to your Google JSON file
- `your-azure-key-here` → Paste your Azure key
- `eastus` → Your Azure region

**Example:**
```
ELEVENLABS_API_KEY=sk_9a3f8b2c1d4e5f6g7h8i9j0k1l2m3n
SARVAM_API_KEY=sarvam_key_abc123def456ghi789
GOOGLE_APPLICATION_CREDENTIALS=google-service-account.json
AZURE_SPEECH_KEY=1a2b3c4d5e6f7g8h9i0j
AZURE_SPEECH_REGION=eastus
```

### Step 6.3: Verify .gitignore Protects Your Keys

```bash
# Check that .env is in .gitignore
cat .gitignore

# Verify git won't commit .env
git status
# Should NOT show .env file
```

### Step 6.4: Test Backend Locally (Optional)

If you want to test locally before deploying:

**For Python:**
```bash
# Install dependencies
pip install -r requirements.txt

# Run backend
python backend_flask.py

# Visit: http://localhost:5000/api/health
# Should return: {"status": "ok"}
```

**For Node.js:**
```bash
# Install dependencies
npm install

# Run backend
node backend_express.js

# Visit: http://localhost:5000/api/health
# Should return: {"status": "ok"}
```

✅ **Phase 6 Complete!**

---

## Phase 7: Deploy to Production (10 minutes)

### Step 7.1: Set Environment Variables on Render

1. Go to https://dashboard.render.com
2. Click your service: `hindi-tts-backend`
3. Go to **"Settings"** (top menu)
4. Scroll to **"Environment"**
5. Click **"Add Environment Variable"**
6. Add each key:

**Variable 1:**
- Key: `ELEVENLABS_API_KEY`
- Value: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (your actual key)
- Click "Add"

**Variable 2:**
- Key: `SARVAM_API_KEY`
- Value: (your actual key)
- Click "Add"

**Variable 3: Google Cloud**
- Key: `GOOGLE_APPLICATION_CREDENTIALS`
- Value: Paste entire contents of your JSON file (as single line)
- Click "Add"

**Variable 4:**
- Key: `AZURE_SPEECH_KEY`
- Value: (your actual key)
- Click "Add"

**Variable 5:**
- Key: `AZURE_SPEECH_REGION`
- Value: `eastus`
- Click "Add"

### Step 7.2: Verify Variables Are Set

```bash
# Test your backend endpoint again
curl https://hindi-tts-backend.onrender.com/api/health

# Should still return: {"status": "ok"}
```

### Step 7.3: Test End-to-End

1. Open your frontend: https://YOUR_USERNAME.github.io/hindi-tts-voice-editor
2. Click a voice card → Editor opens
3. Enter text: "नमस्ते"
4. Click "Generate Audio"
5. ✅ **You should hear the audio!**

### Step 7.4: Test All Providers

Try different voice cards to test different providers:

- **ElevenLabs:** Adarsh, Priya, Akshay
- **Sarvam AI:** Ravi, Anjali, Vijay
- **Google Cloud:** Neural-Male, Neural-Female, Neural-Child
- **Azure:** Hari, Ananya, Karan

### Step 7.5: Test Voice Effects

1. Click a voice card
2. Enter: "नमस्ते [PAUSE:2s] महत्वपूर्ण [EMPHASIZE]संदेश[/EMPHASIZE]"
3. Click "Generate Audio"
4. You should hear:
   - "नमस्ते" [2 second pause] "महत्वपूर्ण" [louder] "संदेश"

✅ **Phase 7 Complete - You're Live!**

---

## Final Checklist

```
PUSH TO GITHUB:
☑ Git installed and configured
☑ .env in .gitignore
☑ Files committed
☑ Repository created on GitHub
☑ Code pushed to main branch

FRONTEND (GITHUB PAGES):
☑ Settings → Pages enabled
☑ Deployed automatically
☑ Live at: https://YOUR_USERNAME.github.io/hindi-tts-voice-editor
☑ UI loads correctly

BACKEND (RENDER):
☑ requirements.txt / package.json created
☑ Procfile created
☑ Files committed and pushed
☑ Render account created
☑ Service deployed
☑ Live at: https://hindi-tts-backend.onrender.com
☑ Health check working

CONNECTION:
☑ script.js updated with backend URL
☑ Frontend redeployed
☑ Backend URL correct in code

API KEYS:
☑ ElevenLabs key obtained
☑ Sarvam AI key obtained
☑ Google Cloud JSON downloaded
☑ Azure key and region obtained
☑ .env file created locally
☑ Keys set on Render platform

PRODUCTION:
☑ All 4 API keys in Render environment
☑ Audio generation working
☑ All voice providers tested
☑ Voice effects working
☑ Application live and accessible
```

---

## Troubleshooting

### "Cannot find module 'dotenv'"
```bash
# Python
pip install python-dotenv

# Node.js
npm install dotenv
```

### "API Key not found" error
1. Check keys are set on Render (Settings → Environment)
2. Verify key names match exactly: ELEVENLABS_API_KEY, SARVAM_API_KEY, etc.
3. Wait 2 minutes for Render to restart service

### "Service returning 502 Bad Gateway"
1. Check Render logs (Service → Logs)
2. Look for Python/Node errors
3. Restart the service (Settings → Restart)

### "CORS error - can't reach backend"
1. Make sure CORS is enabled in your backend (should already be)
2. Verify backend URL in script.js is correct
3. Check backend is actually running: curl /api/health

### "Audio not playing"
1. Check browser console for JavaScript errors (F12)
2. Verify audio MIME type is correct: `audio/mpeg`
3. Try different voice provider (provider-specific issue)

---

## What You've Accomplished! 🎉

```
Before:
- Local files on your computer
- No one can access it
- Can't use real TTS providers

After:
- Code on GitHub (version control)
- Frontend live on GitHub Pages (FREE)
- Backend running on Render (FREE)
- Connected together
- Using real TTS APIs
- Can share with anyone: https://YOUR_USERNAME.github.io/hindi-tts-voice-editor
```

---

## Next Steps (Optional)

1. **Custom Domain:** Point your own domain to GitHub Pages
2. **Monitoring:** Set up alerts for API usage
3. **Analytics:** Add Google Analytics to track users
4. **Security:** Implement rate limiting
5. **Caching:** Add response caching to reduce API calls
6. **Backup:** Enable GitHub automatic backups

---

**Version:** 1.0 | **Date:** January 23, 2026 | **Difficulty:** Beginner-Friendly
