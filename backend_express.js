/**
 * Hindi TTS Voice Generator - Node.js/Express Backend
 * Supports: ElevenLabs, Sarvam AI, Google Cloud, Microsoft Azure
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================================
// LOGGING
// ============================================================================

const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    debug: (msg) => console.log(`[DEBUG] ${msg}`)
};

// ============================================================================
// PROVIDER IMPLEMENTATIONS
// ============================================================================

class TTSProvider {
    /**
     * Base TTS Provider class
     */
    async generateAudio(ssml, voiceId, language = 'hi-IN') {
        throw new Error('generateAudio not implemented');
    }
}

class ElevenLabsProvider extends TTSProvider {
    /**
     * ElevenLabs TTS Provider
     */
    constructor() {
        super();
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        this.voiceMapping = {
            'adarsh': process.env.ELEVENLABS_ADARSH_ID || 'voice_id_1',
            'priya': process.env.ELEVENLABS_PRIYA_ID || 'voice_id_2',
            'akshay': process.env.ELEVENLABS_AKSHAY_ID || 'voice_id_3',
        };
    }

    async generateAudio(ssml, voiceId, language = 'hi-IN') {
        try {
            const elevenLabsVoiceId = this.voiceMapping[voiceId] || voiceId;

            const response = await axios.post(
                `${this.baseUrl}/text-to-speech/${elevenLabsVoiceId}`,
                {
                    text: ssml,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                },
                {
                    headers: {
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            return response.data;
        } catch (error) {
            logger.error(`ElevenLabs error: ${error.message}`);
            throw error;
        }
    }
}

class SarvamAIProvider extends TTSProvider {
    /**
     * Sarvam AI TTS Provider
     */
    constructor() {
        super();
        this.apiKey = process.env.SARVAM_API_KEY;
        this.baseUrl = 'https://api.sarvam.ai/v1';
        this.voiceMapping = {
            'ravi': 'ravi',
            'anjali': 'anjali',
            'vijay': 'vijay',
        };
    }

    async generateAudio(ssml, voiceId, language = 'hi-IN') {
        try {
            const sarvamVoiceId = this.voiceMapping[voiceId] || voiceId;

            const response = await axios.post(
                `${this.baseUrl}/text-to-speech`,
                {
                    text: ssml,
                    voice_id: sarvamVoiceId,
                    language: language,
                    model: 'hindi-v1'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            return response.data;
        } catch (error) {
            logger.error(`Sarvam AI error: ${error.message}`);
            throw error;
        }
    }
}

class GoogleCloudProvider extends TTSProvider {
    /**
     * Google Cloud Text-to-Speech Provider
     */
    constructor() {
        super();
        try {
            const textToSpeech = require('@google-cloud/text-to-speech');
            this.client = new textToSpeech.TextToSpeechClient();
            this.voiceMapping = {
                'google-neural-male': 'hi-IN-Neural2-A',
                'google-neural-female': 'hi-IN-Neural2-B',
                'google-child': 'hi-IN-Standard-C',
            };
        } catch (error) {
            logger.error('Google Cloud library not installed');
            this.client = null;
        }
    }

    async generateAudio(ssml, voiceId, language = 'hi-IN') {
        try {
            if (!this.client) {
                throw new Error('Google Cloud client not initialized');
            }

            const voiceName = this.voiceMapping[voiceId] || voiceId;

            const request = {
                input: { ssml: ssml },
                voice: {
                    languageCode: language,
                    name: voiceName
                },
                audioConfig: {
                    audioEncoding: 'MP3'
                }
            };

            const [response] = await this.client.synthesizeSpeech(request);
            return response.audioContent;
        } catch (error) {
            logger.error(`Google Cloud error: ${error.message}`);
            throw error;
        }
    }
}

class AzureProvider extends TTSProvider {
    /**
     * Microsoft Azure Speech Provider
     */
    constructor() {
        super();
        try {
            const sdk = require('microsoft-cognitiveservices-speech-sdk');
            this.sdk = sdk;
            this.speechConfig = sdk.SpeechConfig.fromSubscription(
                process.env.AZURE_SPEECH_KEY,
                process.env.AZURE_SPEECH_REGION || 'centralindia'
            );
            this.voiceMapping = {
                'hari': 'hi-IN-MadhurNeural',
                'ananya': 'hi-IN-SwaraNeural',
                'karan': 'hi-IN-HemantNeural',
            };
        } catch (error) {
            logger.error('Azure Speech library not installed');
            this.sdk = null;
        }
    }

    async generateAudio(ssml, voiceId, language = 'hi-IN') {
        try {
            if (!this.sdk) {
                throw new Error('Azure Speech client not initialized');
            }

            const voiceName = this.voiceMapping[voiceId] || voiceId;
            this.speechConfig.speechSynthesisVoiceName = voiceName;

            return new Promise((resolve, reject) => {
                const audioFile = path.join('/tmp', `azure-${Date.now()}.mp3`);
                const audioConfig = this.sdk.AudioConfig.fromAudioFileOutput(audioFile);
                const synthesizer = new this.sdk.SpeechSynthesizer(
                    this.speechConfig,
                    audioConfig
                );

                synthesizer.speakSsmlAsync(
                    ssml,
                    result => {
                        if (result.reason === this.sdk.ResultReason.SynthesizingAudioCompleted) {
                            const audioBuffer = fs.readFileSync(audioFile);
                            fs.unlinkSync(audioFile); // Clean up temp file
                            resolve(audioBuffer);
                        } else {
                            reject(new Error(`Speech synthesis failed: ${result.reason}`));
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        } catch (error) {
            logger.error(`Azure error: ${error.message}`);
            throw error;
        }
    }
}

// ============================================================================
// PROVIDER FACTORY
// ============================================================================

function getProvider(providerName) {
    /**
     * Get TTS provider instance
     */
    const providers = {
        'elevenlabs': () => new ElevenLabsProvider(),
        'sarvam': () => new SarvamAIProvider(),
        'google': () => new GoogleCloudProvider(),
        'azure': () => new AzureProvider(),
    };

    const factory = providers[providerName];
    if (!factory) {
        throw new Error(`Unknown provider: ${providerName}`);
    }

    return factory();
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * POST /api/generate-audio
 * Generate audio from SSML text
 * 
 * Request JSON:
 * {
 *   'ssml': '<speak>text</speak>',
 *   'voice_id': 'adarsh',
 *   'voice_name': 'Adarsh - Male Voice',
 *   'provider': 'elevenlabs',
 *   'language': 'hi-IN'
 * }
 * 
 * Returns: Audio file (MP3)
 */
app.post('/api/generate-audio', async (req, res) => {
    try {
        const { ssml, voice_id, voice_name, provider, language = 'hi-IN' } = req.body;

        // Validate request
        if (!ssml || !voice_id || !provider) {
            return res.status(400).json({
                error: 'Missing required fields: ssml, voice_id, provider'
            });
        }

        logger.info(`Generating audio: ${provider} - ${voice_id}`);
        logger.debug(`SSML: ${ssml}`);

        // Get provider and generate audio
        const ttsProvider = getProvider(provider);
        const audioContent = await ttsProvider.generateAudio(ssml, voice_id, language);

        // Return audio file
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'inline; filename="generated_audio.mp3"');
        res.send(audioContent);

    } catch (error) {
        logger.error(`Error generating audio: ${error.message}`);
        res.status(500).json({
            error: `Failed to generate audio: ${error.message}`
        });
    }
});

/**
 * GET /api/providers
 * Get list of available providers
 */
app.get('/api/providers', (req, res) => {
    return res.json({
        providers: [
            {
                id: 'elevenlabs',
                name: 'ElevenLabs',
                voices: ['adarsh', 'priya', 'akshay']
            },
            {
                id: 'sarvam',
                name: 'Sarvam AI',
                voices: ['ravi', 'anjali', 'vijay']
            },
            {
                id: 'google',
                name: 'Google Cloud',
                voices: ['google-neural-male', 'google-neural-female', 'google-child']
            },
            {
                id: 'azure',
                name: 'Microsoft Azure',
                voices: ['hari', 'ananya', 'karan']
            }
        ]
    });
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    return res.json({
        status: 'ok',
        message: 'Hindi TTS API is running'
    });
});

// ============================================================================
// ERROR HANDLERS
// ============================================================================

app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({
        error: 'Internal server error'
    });
});

app.all('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// ============================================================================
// SERVER START
// ============================================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('Hindi TTS Voice Generator - Backend Server');
    console.log('='.repeat(60));
    console.log('\nEndpoints:');
    console.log('  POST /api/generate-audio  - Generate speech from SSML');
    console.log('  GET  /api/providers       - List available providers');
    console.log('  GET  /api/health          - Health check');
    console.log('\nEnvironment Variables Required:');
    console.log('  ELEVENLABS_API_KEY        - ElevenLabs API key');
    console.log('  SARVAM_API_KEY            - Sarvam AI API key');
    console.log('  GOOGLE_APPLICATION_CREDENTIALS - Google Cloud credentials');
    console.log('  AZURE_SPEECH_KEY          - Azure Speech key');
    console.log('  AZURE_SPEECH_REGION       - Azure region (default: centralindia)');
    console.log('\n' + '='.repeat(60));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('='.repeat(60) + '\n');
});

module.exports = app;
