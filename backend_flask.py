#!/usr/bin/env python3
"""
Hindi TTS Voice Generator - Flask Backend
Supports: ElevenLabs, Sarvam AI, Google Cloud, Microsoft Azure
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import io
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ============================================================================
# PROVIDER IMPLEMENTATIONS
# ============================================================================

class TTSProvider:
    """Base class for TTS providers"""
    
    def generate_audio(self, ssml, voice_id, language='hi-IN'):
        raise NotImplementedError


class ElevenLabsProvider(TTSProvider):
    """ElevenLabs TTS Provider"""
    
    def __init__(self):
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        self.base_url = 'https://api.elevenlabs.io/v1'
        self.voice_mapping = {
            'adarsh': 'voice_id_for_adarsh',
            'priya': 'voice_id_for_priya',
            'akshay': 'voice_id_for_akshay',
        }
    
    def generate_audio(self, ssml, voice_id, language='hi-IN'):
        """Generate audio using ElevenLabs API"""
        try:
            import requests
            
            elevenlabs_voice_id = self.voice_mapping.get(voice_id, voice_id)
            
            headers = {
                'xi-api-key': self.api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'text': ssml,
                'model_id': 'eleven_monolingual_v1',
                'voice_settings': {
                    'stability': 0.5,
                    'similarity_boost': 0.75
                }
            }
            
            response = requests.post(
                f'{self.base_url}/text-to-speech/{elevenlabs_voice_id}',
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            return response.content
            
        except Exception as e:
            logger.error(f"ElevenLabs error: {e}")
            raise


class SarvamAIProvider(TTSProvider):
    """Sarvam AI TTS Provider"""
    
    def __init__(self):
        self.api_key = os.getenv('SARVAM_API_KEY')
        self.base_url = 'https://api.sarvam.ai/v1'
        self.voice_mapping = {
            'ravi': 'ravi',
            'anjali': 'anjali',
            'vijay': 'vijay',
        }
    
    def generate_audio(self, ssml, voice_id, language='hi-IN'):
        """Generate audio using Sarvam AI API"""
        try:
            import requests
            
            sarvam_voice_id = self.voice_mapping.get(voice_id, voice_id)
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'text': ssml,
                'voice_id': sarvam_voice_id,
                'language': language,
                'model': 'hindi-v1'
            }
            
            response = requests.post(
                f'{self.base_url}/text-to-speech',
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            return response.content
            
        except Exception as e:
            logger.error(f"Sarvam AI error: {e}")
            raise


class GoogleCloudProvider(TTSProvider):
    """Google Cloud Text-to-Speech Provider"""
    
    def __init__(self):
        try:
            from google.cloud import texttospeech
            self.client = texttospeech.TextToSpeechClient()
            self.voice_mapping = {
                'google-neural-male': 'hi-IN-Neural2-A',
                'google-neural-female': 'hi-IN-Neural2-B',
                'google-child': 'hi-IN-Standard-C',
            }
        except ImportError:
            logger.warning("Google Cloud library not installed")
            self.client = None
    
    def generate_audio(self, ssml, voice_id, language='hi-IN'):
        """Generate audio using Google Cloud API"""
        try:
            if not self.client:
                raise Exception("Google Cloud client not initialized")
            
            from google.cloud import texttospeech
            
            voice_name = self.voice_mapping.get(voice_id, voice_id)
            
            # Create synthesis input
            input_text = texttospeech.SynthesisInput(ssml=ssml)
            
            # Build voice config
            voice = texttospeech.VoiceSelectionParams(
                language_code=language,
                name=voice_name
            )
            
            # Build audio config
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            # Perform synthesis
            response = self.client.synthesize_speech(
                request={
                    'input': input_text,
                    'voice': voice,
                    'audio_config': audio_config
                }
            )
            
            return response.audio_content
            
        except Exception as e:
            logger.error(f"Google Cloud error: {e}")
            raise


class AzureProvider(TTSProvider):
    """Microsoft Azure Speech Provider"""
    
    def __init__(self):
        try:
            import azure.cognitiveservices.speech as speechsdk
            self.speech_config = speechsdk.SpeechConfig(
                subscription=os.getenv('AZURE_SPEECH_KEY'),
                region=os.getenv('AZURE_SPEECH_REGION', 'centralindia')
            )
            self.voice_mapping = {
                'hari': 'hi-IN-MadhurNeural',
                'ananya': 'hi-IN-SwaraNeural',
                'karan': 'hi-IN-HemantNeural',
            }
        except ImportError:
            logger.warning("Azure Speech library not installed")
            self.speech_config = None
    
    def generate_audio(self, ssml, voice_id, language='hi-IN'):
        """Generate audio using Azure Speech API"""
        try:
            if not self.speech_config:
                raise Exception("Azure Speech client not initialized")
            
            import azure.cognitiveservices.speech as speechsdk
            
            voice_name = self.voice_mapping.get(voice_id, voice_id)
            self.speech_config.speech_synthesis_voice_name = voice_name
            
            # Create in-memory audio output
            audio_output = speechsdk.audio.AudioOutputConfig(use_default_speaker=False)
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config,
                audio_config=None
            )
            
            # Synthesize
            result = synthesizer.speak_ssml_async(ssml).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return result.audio_data
            else:
                raise Exception(f"Speech synthesis failed: {result.reason}")
                
        except Exception as e:
            logger.error(f"Azure error: {e}")
            raise


# ============================================================================
# PROVIDER FACTORY
# ============================================================================

def get_provider(provider_name):
    """Get TTS provider instance"""
    providers = {
        'elevenlabs': ElevenLabsProvider,
        'sarvam': SarvamAIProvider,
        'google': GoogleCloudProvider,
        'azure': AzureProvider,
    }
    
    ProviderClass = providers.get(provider_name)
    if not ProviderClass:
        raise ValueError(f"Unknown provider: {provider_name}")
    
    return ProviderClass()


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    """
    Generate audio from SSML text
    
    Request JSON:
    {
        'ssml': '<speak>text</speak>',
        'voice_id': 'adarsh',
        'voice_name': 'Adarsh - Male Voice',
        'provider': 'elevenlabs',
        'language': 'hi-IN'
    }
    
    Returns: Audio file (MP3)
    """
    try:
        data = request.get_json()
        
        # Validate request
        required_fields = ['ssml', 'voice_id', 'provider']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        ssml = data['ssml']
        voice_id = data['voice_id']
        provider = data['provider']
        language = data.get('language', 'hi-IN')
        
        logger.info(f"Generating audio: {provider} - {voice_id}")
        logger.debug(f"SSML: {ssml}")
        
        # Get provider and generate audio
        tts_provider = get_provider(provider)
        audio_content = tts_provider.generate_audio(ssml, voice_id, language)
        
        # Return audio file
        return send_file(
            io.BytesIO(audio_content),
            mimetype='audio/mpeg',
            as_attachment=False,
            download_name='generated_audio.mp3'
        )
        
    except ValueError as e:
        logger.error(f"Provider error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error generating audio: {e}")
        return jsonify({'error': f'Failed to generate audio: {str(e)}'}), 500


@app.route('/api/providers', methods=['GET'])
def get_providers():
    """Get list of available providers"""
    return jsonify({
        'providers': [
            {
                'id': 'elevenlabs',
                'name': 'ElevenLabs',
                'voices': ['adarsh', 'priya', 'akshay']
            },
            {
                'id': 'sarvam',
                'name': 'Sarvam AI',
                'voices': ['ravi', 'anjali', 'vijay']
            },
            {
                'id': 'google',
                'name': 'Google Cloud',
                'voices': ['google-neural-male', 'google-neural-female', 'google-child']
            },
            {
                'id': 'azure',
                'name': 'Microsoft Azure',
                'voices': ['hari', 'ananya', 'karan']
            }
        ]
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Hindi TTS API is running'
    })


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("Hindi TTS Voice Generator - Backend Server")
    print("=" * 60)
    print("\nEndpoints:")
    print("  POST /api/generate-audio  - Generate speech from SSML")
    print("  GET  /api/providers       - List available providers")
    print("  GET  /api/health          - Health check")
    print("\nEnvironment Variables Required:")
    print("  ELEVENLABS_API_KEY        - ElevenLabs API key")
    print("  SARVAM_API_KEY            - Sarvam AI API key")
    print("  GOOGLE_APPLICATION_CREDENTIALS - Google Cloud credentials")
    print("  AZURE_SPEECH_KEY          - Azure Speech key")
    print("  AZURE_SPEECH_REGION       - Azure region (default: centralindia)")
    print("\n" + "=" * 60)
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
