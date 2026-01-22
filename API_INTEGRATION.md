# API Integration Setup Guide

This guide walks through setting up real voice samples from each provider.

## Prerequisites

- Node.js 14+ or Python 3.7+
- API credentials from providers
- Basic understanding of REST APIs

---

## 1. ElevenLabs Integration

### Setup
```bash
npm install elevenlabs
# or
pip install elevenlabs
```

### Get API Key
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to Settings → API Keys
3. Copy your API key

### Python Implementation
```python
from elevenlabs import generate, play, voices
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="your-api-key-here")

# List available voices
for voice in voices():
    print(f"{voice.name}: {voice.voice_id}")

# Generate speech
audio = generate(
    text="नमस्ते, आपका स्वागत है।",
    voice="Adarsh",
    model="eleven_monolingual_v1"
)

# Save to file
with open("samples/elevenlabs-adarsh.mp3", "wb") as f:
    f.write(audio)
```

### Node.js Implementation
```javascript
const { ElevenLabsClient } = require("elevenlabs-js");

const client = new ElevenLabsClient({
  apiKey: "your-api-key-here",
});

async function generateSpeech() {
  const audio = await client.textToSpeech.convert({
    voice_id: "voice_id_here",
    model_id: "eleven_monolingual_v1",
    text: "नमस्ते, आपका स्वागत है।",
  });

  // Save audio
  const fs = require("fs");
  fs.writeFileSync("samples/elevenlabs-sample.mp3", audio);
}

generateSpeech();
```

### Hindi Voice IDs
- Adarsh: `ZbV5KxDhsKxL8JzJjzpM`
- Priya: `GBv7mTulbFnqwL3c5Xvw`
- Akshay: `EXAVITQu4vr4xnSDxMaL`

---

## 2. Sarvam AI Integration

### Setup
```bash
pip install requests
# or
npm install axios
```

### Get API Key
1. Visit [sarvam.ai](https://sarvam.ai)
2. Create account and get API key
3. Check [docs.sarvam.ai](https://docs.sarvam.ai)

### Python Implementation
```python
import requests
import json

API_KEY = "your-sarvam-api-key"
API_URL = "https://api.sarvam.ai/v1/text-to-speech"

def generate_hindi_speech(text, voice_id):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "voice_id": voice_id,
        "language": "hi-IN"
    }
    
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        with open("samples/sarvam-sample.mp3", "wb") as f:
            f.write(response.content)
        print("Audio saved successfully")
    else:
        print(f"Error: {response.status_code}")

# Generate samples
generate_hindi_speech("नमस्ते, आपका स्वागत है।", "ravi")
```

### Node.js Implementation
```javascript
const axios = require('axios');
const fs = require('fs');

const API_KEY = 'your-sarvam-api-key';
const API_URL = 'https://api.sarvam.ai/v1/text-to-speech';

async function generateHindiSpeech(text, voiceId) {
  try {
    const response = await axios.post(
      API_URL,
      {
        text: text,
        voice_id: voiceId,
        language: "hi-IN"
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    fs.writeFileSync('samples/sarvam-sample.mp3', response.data);
    console.log('Audio saved successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateHindiSpeech("नमस्ते, आपका स्वागत है।", "ravi");
```

### Available Voice IDs
- Ravi (Male): `ravi`
- Anjali (Female): `anjali`
- Vijay (Narrator): `vijay`

---

## 3. Google Cloud Text-to-Speech

### Setup
```bash
pip install google-cloud-texttospeech
# or
npm install @google-cloud/text-to-speech
```

### Get Credentials
1. Create Google Cloud project
2. Enable Text-to-Speech API
3. Create service account key
4. Download JSON file

### Python Implementation
```python
from google.cloud import texttospeech
import os

# Set credentials path
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/credentials.json'

def synthesize_text(text, voice_name, output_file):
    client = texttospeech.TextToSpeechClient()
    
    input_text = texttospeech.SynthesisInput(text=text)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code="hi-IN",
        name=voice_name
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    response = client.synthesize_speech(
        request={"input": input_text, "voice": voice, "audio_config": audio_config}
    )
    
    with open(output_file, "wb") as out:
        out.write(response.audio_content)
    
    print(f"Audio content written to {output_file}")

# Generate samples
synthesize_text(
    "नमस्ते, आपका स्वागत है।",
    "hi-IN-Neural2-A",
    "samples/google-neural-male.mp3"
)
```

### Node.js Implementation
```javascript
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');

async function synthesizeText(text, voiceName, outputFile) {
  const client = new textToSpeech.TextToSpeechClient();

  const request = {
    input: { text: text },
    voice: {
      languageCode: 'hi-IN',
      name: voiceName,
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = require('util').promisify(fs.writeFile);
  
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to ${outputFile}`);
}

synthesizeText(
  'नमस्ते, आपका स्वागत है।',
  'hi-IN-Neural2-A',
  'samples/google-neural-male.mp3'
);
```

### Hindi Voice Names
- Neural Male: `hi-IN-Neural2-A`
- Neural Female: `hi-IN-Neural2-B`
- Standard Male: `hi-IN-Standard-A`
- Standard Female: `hi-IN-Standard-B`

---

## 4. Microsoft Azure Speech

### Setup
```bash
pip install azure-cognitiveservices-speech
# or
npm install microsoft-cognitiveservices-speech-sdk
```

### Get Credentials
1. Create Azure account
2. Create Speech resource
3. Get subscription key and region

### Python Implementation
```python
import azure.cognitiveservices.speech as speechsdk
import os

speech_key = "your-speech-key"
service_region = "your-region"  # e.g., "centralindia"

speech_config = speechsdk.SpeechConfig(
    subscription=speech_key,
    region=service_region
)

def synthesize_to_file(text, voice_name, output_file):
    audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
    
    speech_config.speech_synthesis_voice_name = voice_name
    
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config
    )
    
    result = synthesizer.speak_text_async(text).get()
    
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print(f"Speech synthesized to {output_file}")
    else:
        print(f"Error: {result.error_details}")

# Generate samples
synthesize_to_file(
    "नमस्ते, आपका स्वागत है।",
    "hi-IN-MadhurNeural",
    "samples/azure-hari.mp3"
)
```

### Node.js Implementation
```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const speechKey = "your-speech-key";
const serviceRegion = "your-region";

async function synthesizeToFile(text, voiceName, outputFile) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion
  );
  
  speechConfig.speechSynthesisVoiceName = voiceName;
  
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile);
  
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(`Speech synthesized to ${outputFile}`);
          resolve();
        } else {
          reject(new Error(result.errorDetails));
        }
      },
      error => reject(error)
    );
  });
}

synthesizeToFile(
  "नमस्ते, आपका स्वागत है।",
  "hi-IN-MadhurNeural",
  "samples/azure-hari.mp3"
);
```

### Hindi Neural Voice Names
- Madhur (Male): `hi-IN-MadhurNeural`
- Swara (Female): `hi-IN-SwaraNeural`
- Hemant (Male): `hi-IN-HemantNeural`
- Amrita (Female): `hi-IN-AmritaNeural`

---

## Testing Audio Samples

Create a test script:

```python
# test_samples.py
import os
from pathlib import Path

samples_dir = Path("samples")

# Check if samples directory exists
if not samples_dir.exists():
    samples_dir.mkdir()
    print(f"Created {samples_dir} directory")

# List all audio files
audio_files = list(samples_dir.glob("*.mp3"))
print(f"\nFound {len(audio_files)} audio samples:")
for file in audio_files:
    size = file.stat().st_size / (1024 * 1024)  # Size in MB
    print(f"  - {file.name} ({size:.2f} MB)")

# Verify index.html references match files
html_samples = [
    "elevenlabs-adarsh.mp3",
    "elevenlabs-priya.mp3",
    # ... add all referenced samples
]

missing = set(html_samples) - set(f.name for f in audio_files)
if missing:
    print(f"\n⚠️  Missing samples: {missing}")
else:
    print("\n✓ All referenced samples are present!")
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication fails | Verify API key format and permissions |
| No audio output | Check language code is correct (hi-IN for Hindi) |
| File not created | Verify write permissions to samples folder |
| Slow generation | Some APIs may have rate limits, add delays |

---

## Next Steps

1. Generate sample audio files for each voice
2. Place in `samples/` directory
3. Reload `index.html` to hear the samples
4. Customize voice selections based on your preferences

For production use, consider:
- Implementing a backend service for API calls
- Adding user upload capabilities
- Caching audio samples
- Monitoring API usage and costs
