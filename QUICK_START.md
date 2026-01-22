# Quick Start Guide

Get your Hindi TTS Voice Samples Gallery up and running in minutes!

## 🚀 Instant Setup

### Step 1: Open in Browser
Simply double-click `index.html` or right-click and select "Open with Browser"

### Step 2: Explore
- Browse through all voice samples
- Use the navigation menu to filter by provider
- Click the audio players to listen to samples

### Step 3: Customize
Edit `index.html` to:
- Change the title and tagline
- Add your own voice samples
- Modify colors in `styles.css`
- Adjust features in `script.js`

---

## 📋 Project Structure

```
Text to Speech AI/
├── index.html              ← Main page (open this!)
├── styles.css              ← Styling
├── script.js               ← Interactive features
├── config.json             ← Provider configuration
├── samples/                ← Audio files go here
├── README.md               ← Full documentation
├── API_INTEGRATION.md      ← API setup guide
└── QUICK_START.md          ← This file
```

---

## ✨ Features Overview

### 🎙️ Voice Gallery
- 12 sample voices across 4 providers
- Multiple characteristics per voice
- Easy-to-use audio players

### 🔍 Filtering
- Filter by provider with top navigation
- Keyboard shortcuts (Alt+1 to Alt+5)
- View all or single provider at a time

### 📊 Comparison
- Provider comparison table
- Quality and use case information
- Pricing overview

### 📱 Responsive
- Works on desktop, tablet, mobile
- Touch-friendly audio controls
- Smooth animations and transitions

---

## 🎯 What You Can Do

### Immediately (No Setup)
- ✅ Listen to sample voices
- ✅ Compare providers visually
- ✅ Filter by provider
- ✅ Learn about each service

### With API Integration (Advanced)
- ✅ Generate custom samples
- ✅ Test different voices
- ✅ Create voice comparison tool
- ✅ Build TTS application

---

## 🔧 Basic Customization

### Change Colors
Edit `styles.css` lines 7-15:
```css
:root {
    --primary-color: #6366f1;      /* Main color */
    --secondary-color: #ec4899;    /* Accent */
    --accent-color: #f59e0b;       /* Highlights */
    /* ... etc ... */
}
```

### Add More Voices
In `index.html`, duplicate a voice-card and modify:
```html
<div class="voice-card">
    <h3>Your Voice Name</h3>
    <p class="voice-desc">Your description</p>
    <div class="player">
        <audio controls>
            <source src="samples/your-file.mp3" type="audio/mpeg">
        </audio>
    </div>
    <div class="voice-tags">
        <span class="tag">Tag1</span>
    </div>
</div>
```

### Add New Provider
1. Add section in `index.html`
2. Update `filterProvider()` in `script.js`
3. Add to navigation menu
4. Add voice cards

---

## 🎓 Learning Path

### Level 1: Basic (15 minutes)
- [ ] Open index.html in browser
- [ ] Explore all voice samples
- [ ] Read the README.md
- [ ] Check provider websites

### Level 2: Customization (30 minutes)
- [ ] Change website colors
- [ ] Add custom voice cards
- [ ] Modify text content
- [ ] Adjust layout with CSS

### Level 3: API Integration (1-2 hours)
- [ ] Choose a provider
- [ ] Get API credentials
- [ ] Follow API_INTEGRATION.md
- [ ] Generate real samples
- [ ] Update audio sources

### Level 4: Backend Development (Advanced)
- [ ] Set up Node.js/Python backend
- [ ] Implement API calls
- [ ] Add user upload feature
- [ ] Deploy to web server

---

## 🎯 Common Tasks

### Add a Sample Audio File
1. Generate or download an MP3 file
2. Place it in the `samples/` folder
3. Update the `src` attribute in a voice-card:
   ```html
   <source src="samples/your-file.mp3" type="audio/mpeg">
   ```

### Change Website Title
In `index.html`, line 5:
```html
<title>Your New Title - Hindi TTS</title>
```

### Update Provider Information
Edit the matching section header, e.g., line ~127:
```html
<h2>🎭 Your Provider Name</h2>
<p class="provider-desc">Your description</p>
```

### Modify Navigation Menu
Edit the navbar (lines ~26-32) to add/remove links:
```html
<li><a href="#provider" onclick="filterProvider('provider')">Name</a></li>
```

---

## 🐛 Troubleshooting

### Webpage looks broken
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)
- **Alternative**: Try a different browser

### Audio files don't play
- **Check 1**: File is in `samples/` folder
- **Check 2**: File name matches exactly in HTML
- **Check 3**: File format is MP3
- **Check 4**: Browser console has no errors (F12)

### Navigation doesn't work
- **Check 1**: JavaScript is enabled
- **Check 2**: Browser console (F12) shows no errors
- **Solution**: Hard refresh (Ctrl+Shift+R)

### Layout looks wrong on mobile
- **Solution**: Open DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
- **Check**: Zoom is at 100%

---

## 📱 Browser Compatibility

| Browser | Status | Version |
|---------|--------|---------|
| Chrome  | ✅ Full | 90+ |
| Firefox | ✅ Full | 88+ |
| Safari  | ✅ Full | 14+ |
| Edge    | ✅ Full | 90+ |
| IE 11   | ❌ Not supported | - |

---

## 🔐 Privacy & Security

- All data stays local (no tracking)
- Audio files served from your device
- External links to provider websites
- No personal information collected
- Safe to use offline after first load

---

## 📚 Resources

### Official Provider Links
- **ElevenLabs**: https://elevenlabs.io
- **Sarvam AI**: https://sarvam.ai
- **Google Cloud**: https://cloud.google.com/text-to-speech
- **Microsoft Azure**: https://azure.microsoft.com/services/cognitive-services/text-to-speech

### Documentation
- Full README: `README.md`
- API Setup: `API_INTEGRATION.md`
- Provider Config: `config.json`

### Getting Help
1. Check README.md for detailed info
2. Read API_INTEGRATION.md for setup help
3. Visit provider documentation
4. Check browser console (F12) for errors

---

## 🎉 Next Steps

### What to do after opening index.html:

1. **Explore** - Listen to all voice samples
2. **Compare** - Use comparison table to understand differences
3. **Read** - Review README.md for detailed info
4. **Customize** - Modify colors and content to match your brand
5. **Integrate** - Follow API_INTEGRATION.md for real voice samples
6. **Deploy** - Host on a web server for others to use

---

## 💡 Pro Tips

### Keyboard Shortcuts
- `Alt + 1` → ElevenLabs
- `Alt + 2` → Sarvam AI
- `Alt + 3` → Google Cloud
- `Alt + 4` → Azure
- `Alt + 5` → All providers

### Mobile Testing
- Use Chrome DevTools (F12)
- Toggle Device Toolbar (Ctrl+Shift+M)
- Test on actual device for best results

### Audio Management
- Only one audio plays at a time
- Others automatically pause
- Browsers may require HTTPS for some features

### Performance
- Optimize MP3 files to ~500KB each
- Use local CDN for faster loads
- Lazy load audio when needed

---

## 📞 Support

**Having issues?**
1. Check the **Troubleshooting** section above
2. Review the **Browser Compatibility** table
3. Open DevTools (F12) to check for errors
4. Verify all files are in the correct location

**Want to add features?**
1. Check the **Future Enhancements** section in README.md
2. Review API_INTEGRATION.md for backend ideas
3. Customize based on your needs

---

## 📝 File Checklist

Before customizing, verify you have:
- [ ] `index.html` - Main page
- [ ] `styles.css` - Styling
- [ ] `script.js` - JavaScript features
- [ ] `config.json` - Configuration
- [ ] `samples/` - Directory for audio files
- [ ] `README.md` - Full documentation
- [ ] `API_INTEGRATION.md` - API setup guide

---

**🎉 You're all set! Open index.html and start exploring Hindi TTS voices!**

Last Updated: January 23, 2026
