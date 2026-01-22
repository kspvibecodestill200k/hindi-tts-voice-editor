# SSML (Speech Synthesis Markup Language) Integration Guide

## Overview

SSML is an XML-based markup language that controls various aspects of speech synthesis like pronunciation, volume, pitch, rate, and more. Your voice effects are automatically converted to SSML tags before sending to TTS providers.

---

## How It Works

### User Input Flow

```
User Types:          "नमस्ते [PAUSE:1s] [EMPHASIZE]important[/EMPHASIZE]"
                                    ↓
JavaScript Parser:   Converts custom markers to SSML
                                    ↓
SSML Output:         "<speak>नमस्ते <break time='1s'/> 
                      <emphasis level='strong'>important</emphasis></speak>"
                                    ↓
Backend API:         Sends SSML to TTS provider
                                    ↓
TTS Provider:        Processes SSML and generates audio
                                    ↓
Browser:             Plays generated audio
```

---

## Custom Markers → SSML Conversion

### Quick Reference

| Your Marker | SSML Tag | Result |
|---|---|---|
| `[PAUSE:2s]` | `<break time="2s"/>` | 2 second silence |
| `[EMPHASIZE]text[/EMPHASIZE]` | `<emphasis level="strong">text</emphasis>` | Louder, slower speech |
| `[WHISPER]text[/WHISPER]` | `<amazon:effect phonation="breathy">text</amazon:effect>` | Soft, intimate voice |
| `[SHOCKING]text[/SHOCKING]` | `<prosody pitch="+30%">text</prosody>` | Higher pitch |

---

## Provider-Specific SSML

Each provider supports slightly different SSML features. Our converter automatically adapts:

### 🎭 ElevenLabs SSML

**Supports:**
- Break (pause)
- Emphasis
- Prosody (pitch, rate)
- Amazon effects (breathy)

**Example:**
```xml
<speak>
    नमस्ते <break time="1s"/>
    <emphasis level="strong">महत्वपूर्ण</emphasis> संदेश।
    <amazon:effect phonation="breathy">रहस्य</amazon:effect>
    <prosody pitch="+25%" rate="1.2">अविश्वसनीय!</prosody>
</speak>
```

**Conversion Rule:**
```javascript
// [PAUSE:1s] → <break time="1s"/>
// [EMPHASIZE]text[/EMPHASIZE] → <emphasis level="strong">text</emphasis>
// [WHISPER]text[/WHISPER] → <amazon:effect phonation="breathy">text</amazon:effect>
// [SHOCKING]text[/SHOCKING] → <prosody pitch="+25%" rate="1.2">text</prosody>
```

### 🚀 Sarvam AI SSML

**Supports:**
- Break (pause)
- Emphasis
- Prosody (pitch, rate, volume)
- Amazon effects

**Example:**
```xml
<speak>
    नमस्ते <break time="1s"/>
    <emphasis level="strong">महत्वपूर्ण</emphasis> संदेश।
    <amazon:effect phonation="breathy">रहस्य</amazon:effect>
    <prosody pitch="+30%" rate="1.3">अविश्वसनीय!</prosody>
</speak>
```

**Conversion Rule:**
```javascript
// [PAUSE:1s] → <break time="1s"/>
// [EMPHASIZE]text[/EMPHASIZE] → <emphasis level="strong">text</emphasis>
// [WHISPER]text[/WHISPER] → <amazon:effect phonation="breathy">text</amazon:effect>
// [SHOCKING]text[/SHOCKING] → <prosody pitch="+30%" rate="1.3">text</prosody>
```

### ☁️ Google Cloud SSML

**Supports:**
- Break (pause)
- Emphasis
- Prosody (pitch, rate)
- Amazon effects (volume-based)

**Example:**
```xml
<speak>
    नमस्ते <break time="1s"/>
    <emphasis level="strong">महत्वपूर्ण</emphasis> संदेश।
    <amazon:effect volume="soft">रहस्य</amazon:effect>
    <prosody pitch="+25%" rate="1.25">अविश्वसनीय!</prosody>
</speak>
```

**Conversion Rule:**
```javascript
// [PAUSE:1s] → <break time="1s"/>
// [EMPHASIZE]text[/EMPHASIZE] → <emphasis level="strong">text</emphasis>
// [WHISPER]text[/WHISPER] → <amazon:effect volume="soft">text</amazon:effect>
// [SHOCKING]text[/SHOCKING] → <prosody pitch="+25%" rate="1.25">text</prosody>
```

### 💙 Microsoft Azure SSML

**Supports:**
- Break (pause)
- Emphasis
- Prosody (pitch, rate)
- Custom whisper effect
- SSML with mstts: namespace

**Example:**
```xml
<speak>
    <voice name="hi-IN-MadhurNeural">
        नमस्ते <break time="1s"/>
        <emphasis level="strong">महत्वपूर्ण</emphasis> संदेश।
        <mstts:whisper>रहस्य</mstts:whisper>
        <prosody pitch="+30%" rate="1.2">अविश्वसनीय!</prosody>
    </voice>
</speak>
```

**Conversion Rule:**
```javascript
// [PAUSE:1s] → <break time="1s"/>
// [EMPHASIZE]text[/EMPHASIZE] → <emphasis level="strong">text</emphasis>
// [WHISPER]text[/WHISPER] → <mstts:whisper>text</mstts:whisper>
// [SHOCKING]text[/SHOCKING] → <prosody pitch="+30%" rate="1.2">text</prosody>
```

---

## SSML Tag Reference

### Break (Pause)

**Purpose:** Add silence between words/phrases

**Syntax:**
```xml
<break time="Xs"/>      <!-- X seconds -->
<break time="Xms"/>     <!-- X milliseconds -->
<break strength="x"/>   <!-- none, x-weak, weak, medium, strong, x-strong -->
```

**Examples:**
```xml
<!-- Pause for 1 second -->
नमस्ते<break time="1s"/>फिर मिलेंगे

<!-- Pause for 500ms -->
एक<break time="500ms"/>दो<break time="500ms"/>तीन

<!-- Strong pause -->
पहला<break strength="strong"/>दूसरा
```

**Use Cases:**
- Separate distinct thoughts
- Create dramatic pause
- Emphasize transitions
- Natural speech pacing

### Emphasis

**Purpose:** Emphasize words/phrases

**Syntax:**
```xml
<emphasis level="strong|moderate|reduced">text</emphasis>
```

**Examples:**
```xml
<!-- Strong emphasis -->
यह <emphasis level="strong">बहुत महत्वपूर्ण</emphasis> है।

<!-- Reduced emphasis -->
<emphasis level="reduced">कम महत्वपूर्ण</emphasis> हो सकता है।

<!-- Default (moderate) -->
<emphasis>सामान्य जोर</emphasis>
```

**Effect:**
- **strong** - Louder, slower, more pronounced
- **moderate** - Slightly louder/slower
- **reduced** - Quieter, faster

### Prosody (Pitch & Rate)

**Purpose:** Control pitch and speaking rate

**Syntax:**
```xml
<prosody pitch="X%" rate="Y">text</prosody>
```

**Parameters:**
- **pitch:** +/-20% to +50% change
- **rate:** 0.5 to 2.0 (0.5 = half speed, 2.0 = double speed)

**Examples:**
```xml
<!-- High pitch, fast rate -->
<prosody pitch="+30%" rate="1.5">तेजी से बोलो!</prosody>

<!-- Low pitch, slow rate -->
<prosody pitch="-20%" rate="0.7">धीरे-धीरे बोलो</prosody>

<!-- Only pitch change -->
<prosody pitch="+25%">ऊंची आवाज में</prosody>

<!-- Only rate change -->
<prosody rate="1.2">थोड़ा तेजी से</prosody>
```

**Use Cases:**
- Shocking effect: high pitch, normal-fast rate
- Sad/serious: low pitch, slow rate
- Happy/excited: high pitch, fast rate
- Whisper: low pitch, very slow rate

### Amazon Effects

**Purpose:** Add special voice effects

**Syntax:**
```xml
<amazon:effect phonation="breathy">text</amazon:effect>
<amazon:effect volume="soft|medium|loud">text</amazon:effect>
```

**Phonation:**
- `breathy` - Whisper-like, intimate voice

**Volume:**
- `soft` - Reduced volume
- `medium` - Normal volume
- `loud` - Increased volume

**Examples:**
```xml
<!-- Breathy (whisper) -->
<amazon:effect phonation="breathy">गुप्त संदेश</amazon:effect>

<!-- Soft volume -->
<amazon:effect volume="soft">कम जोर में</amazon:effect>

<!-- Loud volume -->
<amazon:effect volume="loud">बहुत जोर से</amazon:effect>
```

### Azure Whisper (mstts)

**Purpose:** Special whisper effect (Azure only)

**Syntax:**
```xml
<mstts:whisper>text</mstts:whisper>
```

**Example:**
```xml
<mstts:whisper>केवल आपके लिए गुप्त संदेश</mstts:whisper>
```

---

## Advanced Examples

### Example 1: Dramatic Story

```javascript
const text = `
[SHOCKING]कभी एक बार की बात है,[/SHOCKING]
[PAUSE:2s]
एक अंधकार जंगल में [WHISPER]भयानक जानवर[/WHISPER] रहते थे।
[PAUSE:1s]
[EMPHASIZE]लेकिन सच तो यह है[/EMPHASIZE] कि वह बिल्कुल मित्रवत थे।
`;
```

Converts to:

```xml
<speak>
<prosody pitch="+30%" rate="1.2">कभी एक बार की बात है,</prosody>
<break time="2s"/>
एक अंधकार जंगल में <amazon:effect phonation="breathy">भयानक जानवर</amazon:effect> रहते थे।
<break time="1s"/>
<emphasis level="strong">लेकिन सच तो यह है</emphasis> कि वह बिल्कुल मित्रवत थे।
</speak>
```

### Example 2: Technical Announcement

```javascript
const text = `
[EMPHASIZE]ध्यान दें![/EMPHASIZE]
[PAUSE:1s]
नया अपडेट उपलब्ध है।
कृपया अपने सिस्टम को [EMPHASIZE]तुरंत[/EMPHASIZE] अपडेट करें।
`;
```

Converts to:

```xml
<speak>
<emphasis level="strong">ध्यान दें!</emphasis>
<break time="1s"/>
नया अपडेट उपलब्ध है।
कृपया अपने सिस्टम को <emphasis level="strong">तुरंत</emphasis> अपडेट करें।
</speak>
```

### Example 3: Emotional Speech

```javascript
const text = `
मुझे बहुत [WHISPER]दुख है[/WHISPER] कि [PAUSE:1s]
[SHOCKING]तुम यहाँ नहीं हो![/SHOCKING]
[PAUSE:2s]
[EMPHASIZE]लेकिन मैं उम्मीद नहीं खो रहा।[/EMPHASIZE]
`;
```

---

## JavaScript Conversion Function

The conversion happens automatically in `script.js`:

```javascript
function convertToSSML(text, voiceId) {
    let provider = getProviderFromVoiceId(voiceId);
    let ssml = text;

    switch(provider) {
        case 'elevenlabs':
            ssml = ssml
                .replace(/\[PAUSE:(\d+)s?\]/g, '<break time="$1s"/>')
                .replace(/\[EMPHASIZE\](.*?)\[\/EMPHASIZE\]/g, 
                    '<emphasis level="strong">$1</emphasis>')
                .replace(/\[WHISPER\](.*?)\[\/WHISPER\]/g, 
                    '<amazon:effect phonation="breathy">$1</amazon:effect>')
                .replace(/\[SHOCKING\](.*?)\[\/SHOCKING\]/g, 
                    '<prosody pitch="+25%" rate="1.2">$1</prosody>');
            break;
        // ... other providers
    }

    return `<speak>${ssml}</speak>`;
}
```

---

## Best Practices

### ✅ Do:
- Use pauses between major sentences
- Emphasize one key word per sentence
- Use whisper for dramatic effect (use sparingly)
- Test effects with different voices
- Keep SSML simple and clean

### ❌ Don't:
- Overuse effects (sounds unnatural)
- Nest effects deeply (causes issues)
- Use conflicting effects (pause and emphasize same text)
- Make pauses too long (> 5 seconds)
- Mix too many effects in one sentence

### ⚠️ Common Issues:

**Unmatched tags:**
```xml
<!-- ❌ WRONG -->
<emphasis>text without closing

<!-- ✅ CORRECT -->
<emphasis>text</emphasis>
```

**Nested effects:**
```xml
<!-- ❌ AVOID -->
<emphasis><amazon:effect>text</amazon:effect></emphasis>

<!-- ✅ BETTER -->
<emphasis>text</emphasis> <amazon:effect>other text</amazon:effect>
```

**Invalid characters:**
```xml
<!-- ❌ WRONG (unescaped quotes) -->
<emphasis>"quoted text"</emphasis>

<!-- ✅ CORRECT (use HTML entities) -->
<emphasis>&quot;quoted text&quot;</emphasis>
```

---

## Testing Your SSML

### Online SSML Tester

Test SSML before deployment at:
- https://cloud.google.com/text-to-speech/docs/ssml-examples
- https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup

### Backend Validation

The backend validates SSML:

```python
def validateSSML(ssml):
    if not ssml.startswith('<speak>') or not ssml.endswith('</speak>'):
        return { 'valid': False, 'error': 'Missing <speak> tags' }
    
    # Check for matching tags
    # Check for valid attributes
    # Check for proper nesting
    
    return { 'valid': True }
```

---

## Provider Comparison Matrix

| Feature | ElevenLabs | Sarvam | Google | Azure |
|---------|-----------|--------|--------|-------|
| `<break>` | ✅ | ✅ | ✅ | ✅ |
| `<emphasis>` | ⚠️ | ✅ | ✅ | ✅ |
| `<prosody>` | ✅ | ✅ | ✅ | ✅ |
| `<amazon:effect phonation>` | ✅ | ✅ | ✅ | ❌ |
| `<amazon:effect volume>` | ✅ | ✅ | ✅ | ❌ |
| `<mstts:whisper>` | ❌ | ❌ | ❌ | ✅ |
| `<voice>` | ❌ | ❌ | ✅ | ✅ |

---

## Troubleshooting

### Audio doesn't sound as expected

**Issue:** Effects not applied
- Verify SSML is valid (use online tester)
- Check provider supports the effect
- Try different effect values (e.g., pitch +40% instead of +30%)

### Backend error on SSML

**Issue:** 400 or 500 error
- Check for unmatched tags
- Verify special characters are escaped
- Ensure SSML tags are properly nested
- Check logs for detailed error

### Effect cuts off audio

**Issue:** Text after effect is not heard
- Check for missing closing tag
- Verify prosody/effect wraps complete phrase
- Test with simple text first

---

## API Integration

### Python Backend

```python
from google.cloud import texttospeech

ssml = "<speak>नमस्ते <break time='1s'/> दोस्त</speak>"

input_text = texttospeech.SynthesisInput(ssml=ssml)
response = client.synthesize_speech(
    request={'input': input_text, ...}
)
```

### Node.js Backend

```javascript
const request = {
    input: { ssml: ssml },
    voice: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
    audioConfig: { audioEncoding: 'MP3' }
};

const [response] = await client.synthesizeSpeech(request);
```

---

## Additional Resources

- **W3C SSML Spec:** https://www.w3.org/TR/speech-synthesis11/
- **Google Cloud SSML:** https://cloud.google.com/text-to-speech/docs/ssml
- **Azure SSML:** https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup
- **Amazon Polly SSML:** https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html

---

**Version:** 1.0
**Last Updated:** January 23, 2026
**Status:** Complete
