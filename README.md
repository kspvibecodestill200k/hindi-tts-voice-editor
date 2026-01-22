# Hindi TTS Voice Samples Gallery

A comprehensive showcase of Hindi text-to-speech AI voices from major providers including ElevenLabs, Sarvam AI, Google Cloud, and Microsoft Azure.

## Features

✨ **Multi-Provider Support**
- ElevenLabs - Premium quality voices
- Sarvam AI - Localized Hindi expertise
- Google Cloud Text-to-Speech - Enterprise solutions
- Microsoft Azure Speech - Scalable synthesis

🎙️ **Voice Gallery**
- 12+ different voice samples
- Multiple gender options (Male, Female, Child)
- Various voice characteristics (Professional, Energetic, Natural, etc.)
- Easy audio player for each voice

📊 **Provider Comparison**
- Quality metrics
- Hindi language support levels
- Use case recommendations
- Pricing information

🔄 **Interactive Features**
- Filter by provider
- Compare voices side-by-side
- Responsive design for all devices
- Keyboard shortcuts (Alt+1-4 for providers)

## Project Structure

```
Text to Speech AI/
├── index.html          # Main HTML file with voice gallery
├── styles.css          # Responsive styling
├── script.js           # Interactivity and features
├── samples/            # Sample audio files (to be added)
└── README.md          # This file
```

## Getting Started

### Option 1: Open Locally
1. Open `index.html` in your web browser
2. Browse through the voice samples
3. Use the filter navigation to switch between providers

### Option 2: Set Up a Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js with http-server
npx http-server
```

Then visit `http://localhost:8000`

## Adding Real Audio Samples

To use actual voice samples from each provider:

### ElevenLabs Integration
1. Get API key from [elevenlabs.io](https://elevenlabs.io)
2. Create voices in ElevenLabs dashboard
3. Use the API to generate samples:

```javascript
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', {
    method: 'POST',
    headers: {
        'xi-api-key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        text: "नमस्ते, आपका स्वागत है।",
        model_id: "eleven_monolingual_v1"
    })
});
```

### Sarvam AI Integration
1. Get API credentials from [sarvam.ai](https://sarvam.ai)
2. Use their Hindi TTS endpoint
3. Documentation: [docs.sarvam.ai](https://docs.sarvam.ai)

### Google Cloud Integration
1. Set up Google Cloud project
2. Enable Text-to-Speech API
3. Create service account credentials
4. Use the Python or Node.js client library

```python
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()
synthesis_input = texttospeech.SynthesisInput(text="नमस्ते")
voice = texttospeech.VoiceSelectionParams(
    language_code="hi-IN",
    name="hi-IN-Neural2-A"
)
```

### Microsoft Azure Integration
1. Create Azure Speech resource
2. Get subscription key and region
3. Use the Speech SDK or REST API

```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(
    subscription="YOUR_KEY",
    region="YOUR_REGION"
)
speech_config.speech_synthesis_voice_name = "hi-IN-MadhurNeural"
```

## Voice Categories

### Professional Voices
- Adarsh (ElevenLabs) - Deep, authoritative
- Hari (Azure) - Business appropriate
- Vijay (Sarvam) - Narrator quality

### Friendly Voices
- Priya (ElevenLabs) - Warm, approachable
- Anjali (Sarvam) - Pleasant, clear
- Ananya (Azure) - Natural-sounding

### Energetic Voices
- Akshay (ElevenLabs) - Young, dynamic
- Ravi (Sarvam) - Clear, engaging
- Neural Male (Google) - Advanced synthesis

### Specialized Voices
- Google Child - Age-appropriate content
- Karan (Azure) - Premium with emotion
- Premium Neural (Google/Azure) - Highest quality

## Keyboard Shortcuts

- `Alt + 1` → Show ElevenLabs voices
- `Alt + 2` → Show Sarvam AI voices
- `Alt + 3` → Show Google Cloud voices
- `Alt + 4` → Show Azure voices
- `Alt + 5` → Show all voices

## Responsive Design

The gallery is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android)
- Mobile phones (iOS, Android)

## Customization

### Colors
Edit `:root` variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
    /* ... more colors ... */
}
```

### Adding More Voices
Add new voice cards in `index.html` following the existing structure:
```html
<div class="voice-card">
    <h3>Voice Name</h3>
    <p class="voice-desc">Description</p>
    <div class="player">
        <audio controls>
            <source src="samples/provider-voice.mp3" type="audio/mpeg">
        </audio>
    </div>
    <div class="voice-tags">
        <span class="tag">Tag1</span>
    </div>
</div>
```

### Adding New Providers
1. Add a new section in `index.html`
2. Update `filterProvider()` function in `script.js`
3. Add provider info to the `providers` object
4. Update the navigation menu

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (recent versions)

## Performance Notes

- Lazy loading for audio files
- Optimized CSS and minimal JavaScript
- Mobile-first responsive design
- Page load time: ~1-2 seconds

## Future Enhancements

- [ ] Dynamic audio generation from API
- [ ] User audio upload for comparison
- [ ] Voice emotion/prosody controls
- [ ] Language selection (Hindi/English/Regional)
- [ ] Advanced filtering by voice characteristics
- [ ] Voice cloning demonstrations
- [ ] Cost calculator
- [ ] Integration with audio editor

## API Integration Roadmap

1. **Phase 1**: Add backend server for API calls
2. **Phase 2**: Implement real-time audio generation
3. **Phase 3**: User authentication and saved preferences
4. **Phase 4**: Advanced voice synthesis controls
5. **Phase 5**: Community submissions and ratings

## Troubleshooting

**Audio files not playing?**
- Ensure sample audio files are in the `samples/` directory
- Check browser console for errors (F12)
- Verify audio format compatibility

**Navigation not working?**
- Clear browser cache
- Check if JavaScript is enabled
- Try a different browser

**Styling issues?**
- Clear CSS cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for CSS errors

## Privacy & Licensing

This gallery is for demonstration purposes. Each voice provider has their own:
- Terms of Service
- Privacy Policy
- Licensing Agreement

Please review before commercial use.

## Support & Resources

### Official Documentation
- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Sarvam AI Docs](https://docs.sarvam.ai)
- [Google Cloud TTS](https://cloud.google.com/text-to-speech/docs)
- [Azure Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/)

### Community & Help
- Check each provider's community forums
- GitHub repositories for client libraries
- Stack Overflow for technical questions

## License

This gallery template is provided as-is for demonstration purposes.

## Contact & Contributions

To add new voices or providers:
1. Create a new voice card with accurate information
2. Include all metadata
3. Test on multiple browsers/devices
4. Submit with documentation

---

**Last Updated**: January 2026

For the latest voice samples and pricing, visit the official provider websites directly.
