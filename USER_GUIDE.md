# User Guide - Voice Editor Interface

## New Feature Overview

Your Hindi TTS Voice Gallery now has a professional voice editor for creating custom audio content!

## Step-by-Step Guide

### 1. Browse Voice Samples (Main Page)
```
┌─────────────────────────────────────┐
│  🎙️ Hi Abhilasha                    │
│  All the ache wale Hindi TTS...    │
└─────────────────────────────────────┘

[All Samples | ElevenLabs | Sarvam AI | Google Cloud | Azure]

ElevenLabs Section:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Adarsh - Male    │  │ Priya - Female   │  │ Akshay - Young   │
│ Deep voice       │  │ Warm voice       │  │ Energetic voice  │
│ [Audio Player]   │  │ [Audio Player]   │  │ [Audio Player]   │
│ Professional/Deep│  │ Friendly/Natural │  │ Energetic/Young  │
│ [Select & Edit]  │  │ [Select & Edit]  │  │ [Select & Edit]  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

(Scroll to see more providers)
```

### 2. Click "Select & Edit" Button
When you click the "Select & Edit" button on any voice card, the Editor Modal opens:

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Text for Adarsh - Male Voice              [X]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left Side (Text Editor)        │  Right Side (Effects)     │
│  ─────────────────────────────  │  ───────────────────      │
│                                  │                           │
│  File Upload: [Choose file...] │  Voice Effects            │
│                                  │  ⏸ Pause                 │
│  ┌────────────────────────────┐ │  📢 Emphasize            │
│  │                            │ │  🤫 Whisper              │
│  │ Enter sample text to hear  │ │  😲 Shocking             │
│  │ all the voices...          │ │                           │
│  │                            │ │                           │
│  │ (Large Text Area)          │ │                           │
│  │                            │ │                           │
│  └────────────────────────────┘ │                           │
│                                  │                           │
│  [Generate Audio] [Back]        │                           │
└─────────────────────────────────────────────────────────────┘

Preview Section:
────────────────
[Audio Player Controls]
```

### 3. Enter Your Text
Two options:

**Option A: Type Directly**
- Click in the text area
- Start typing your Hindi or English text
- Maximum flexibility for custom content

**Option B: Upload a File**
- Click "Choose File" under File Upload
- Select .txt, .doc, or .docx file
- Content automatically loads into text area

### 4. Add Voice Effects (Optional)

Click the effect buttons on the right to insert tags:

| Button | What It Does | Example |
|--------|------------|---------|
| ⏸ Pause | Adds a 1-second pause | "Hello[PAUSE:1s] there" |
| 📢 Emphasize | Emphasizes words | "[EMPHASIZE]Important[/EMPHASIZE]" |
| 🤫 Whisper | Lowers volume/adds intimacy | "[WHISPER]Secret[/WHISPER]" |
| 😲 Shocking | Adds emotional shock | "[SHOCKING]Wow![/SHOCKING]" |

**How to Use Effect Buttons:**
1. Position cursor in text where you want effect
2. Click the effect button
3. The tag is inserted at cursor position
4. Edit the tag manually if needed

**Example Text with Effects:**
```
नमस्ते! [PAUSE:1s] मैं आपका स्वागत करता हूँ।
[EMPHASIZE]यह बहुत महत्वपूर्ण है[/EMPHASIZE]।
[WHISPER]एक रहस्य सुनो[/WHISPER]
[SHOCKING]अविश्वसनीय![/SHOCKING]
```

### 5. Generate Audio
Click the **[Generate Audio]** button to:
- Send text to the selected voice
- Apply all effect markers
- Generate speech synthesis
- Display audio in preview player

### 6. Listen to Preview
The audio player appears at the bottom:
```
[|▶ 0:00 ────────────── 0:30 |🔊|]
```
- Press **Play** to hear the generated audio
- Adjust **Volume** with speaker icon
- **Speed** controls (if available)

### 7. Back to Gallery
Click **[Back to Samples]** to:
- Close the editor
- Return to voice gallery
- Keep your text in the editor (for next time)
- Select a different voice

---

## Tips & Tricks

### ✨ Pro Tips

1. **Write for Natural Speech**
   - Break long sentences into shorter chunks
   - Add pauses for better pacing
   - Emphasize key information

2. **Effect Placement**
   - Use emphasis for important words
   - Add whisper for dramatic effect
   - Shocking works best for surprises

3. **File Uploads**
   - Copy text from documents
   - Preserve formatting (markdown supported)
   - Great for importing blog posts or articles

4. **Multiple Voices**
   - Generate same text with different voices
   - Compare pronunciation and tone
   - Create diverse voiceover compilations

### ⚠️ Common Issues

**Text too long?**
- Split into smaller chunks
- Multiple pauses help readability
- Quality often improves with shorter content

**Effects not showing?**
- Check tag syntax: [EFFECT]text[/EFFECT]
- All effects must be closed with /EFFECT
- Case-sensitive (use capitals)

**File upload failed?**
- Ensure file is .txt, .doc, or .docx
- File size should be reasonable (< 5MB)
- Try .txt format if others don't work

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Close editor modal |
| `Ctrl+Z` | Undo (in textarea) |
| `Tab` | Move between buttons |
| `Enter` | New line in textarea |

---

## Effect Reference Guide

### PAUSE Effect
**Purpose:** Add silence between words/phrases
**Syntax:** `[PAUSE:Xs]` (X = seconds)
**Examples:**
```
Welcome[PAUSE:2s] to our store.
```

### EMPHASIZE Effect
**Purpose:** Highlight important words
**Syntax:** `[EMPHASIZE]text[/EMPHASIZE]`
**Examples:**
```
This is [EMPHASIZE]very important[/EMPHASIZE]!
```

### WHISPER Effect
**Purpose:** Soft, intimate delivery
**Syntax:** `[WHISPER]text[/WHISPER]`
**Examples:**
```
[WHISPER]Let me tell you a secret[/WHISPER]
```

### SHOCKING Effect
**Purpose:** Surprised or startled tone
**Syntax:** `[SHOCKING]text[/SHOCKING]`
**Examples:**
```
[SHOCKING]I can't believe it![/SHOCKING]
```

---

## Quality Best Practices

### For Best Results:

✅ **DO:**
- Write clear, natural sentences
- Use appropriate punctuation
- Add effects for dramatic impact
- Test with different voices
- Keep sentences medium length

❌ **DON'T:**
- Overuse effects (less is more)
- Use all caps (hard to read)
- Write extremely long paragraphs
- Mix effects (confusing)
- Use special symbols

### Sample Good Text:
```
नमस्ते और स्वागत है!
[PAUSE:1s]
मैं [EMPHASIZE]विशेष रूप से[/EMPHASIZE] आपके लिए यह संदेश लाया हूँ।
यह [SHOCKING]बिल्कुल नया[/SHOCKING] तरीका है।
[WHISPER]केवल आपके लिए[/WHISPER]
```

---

## Technical Details

### Supported File Formats:
- `.txt` - Plain text files
- `.doc` - Microsoft Word 97-2003
- `.docx` - Microsoft Word 2007+
- Text copied from clipboard

### Text Limits:
- Maximum 5000 characters per generation
- Break into chunks if needed
- Multiple generations per session allowed

### Supported Languages:
- Hindi (हिंदी) - Recommended
- English (अंग्रेजी) - Also supported
- Hinglish (mixing) - Works well
- Regional languages - Check provider support

---

## Troubleshooting

### Q: Modal won't close?
**A:** Press ESC key or click the X button

### Q: Text disappeared?
**A:** Reload page - text is not saved between sessions
**Solution:** Copy text before closing modal

### Q: Audio doesn't play?
**A:** Check browser audio permissions
**Solution:** Enable audio in browser settings

### Q: File upload not working?
**A:** Try .txt format first
**Solution:** Ensure file size is reasonable

---

## Getting Help

1. Check "Effect Reference Guide" above
2. Review "Quality Best Practices" section
3. Try sample text to understand interface
4. Visit provider websites for more info

---

## Summary

Your new voice editor lets you:
✅ Type or upload text
✅ Add professional voice effects
✅ Compare multiple voices
✅ Generate custom audio
✅ Export for use in projects

**Happy voice creating!** 🎙️

---

**Last Updated:** January 23, 2026
