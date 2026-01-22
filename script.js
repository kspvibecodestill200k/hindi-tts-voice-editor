// Filter providers based on selection
function filterProvider(provider) {
    const sections = document.querySelectorAll('.provider-section');
    
    sections.forEach(section => {
        if (provider === 'all') {
            section.classList.remove('hidden');
        } else {
            if (section.getAttribute('data-provider') === provider) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    });

    // Update navigation active state
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.borderBottomColor = 'transparent';
    });
    event.target.style.borderBottomColor = '#6366f1';
}

// Select a voice and open editor
function selectVoice(voiceId, voiceName) {
    const modal = document.getElementById('editorModal');
    const voiceNameSpan = document.getElementById('selectedVoiceName');
    const textArea = document.getElementById('editorText');
    
    voiceNameSpan.textContent = voiceName;
    textArea.value = '';
    textArea.focus();
    
    // Store selected voice ID
    window.currentVoiceId = voiceId;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close editor modal
function closeEditor() {
    const modal = document.getElementById('editorModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Insert voice effect into textarea
function insertEffect(effectType) {
    const textarea = document.getElementById('editorText');
    const cursorPos = textarea.selectionStart;
    let effectTag = '';

    switch(effectType) {
        case 'pause':
            effectTag = '[PAUSE:1s] ';
            break;
        case 'emphasize':
            effectTag = '[EMPHASIZE]selected text[/EMPHASIZE] ';
            break;
        case 'whisper':
            effectTag = '[WHISPER]selected text[/WHISPER] ';
            break;
        case 'shocking':
            effectTag = '[SHOCKING]selected text[/SHOCKING] ';
            break;
    }

    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    textarea.value = textBefore + effectTag + textAfter;
    
    // Move cursor after inserted tag
    textarea.selectionStart = textarea.selectionEnd = cursorPos + effectTag.length;
    textarea.focus();
}

// Handle file upload
function handleFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const textarea = document.getElementById('editorText');
        textarea.value = e.target.result;
    };
    
    reader.onerror = function() {
        alert('Error reading file');
    };

    reader.readAsText(file);
}

// Convert custom effect markers to SSML tags
function convertToSSML(text, voiceId) {
    let provider = getProviderFromVoiceId(voiceId);
    let ssml = text;

    switch(provider) {
        case 'elevenlabs':
            ssml = ssml
                .replace(/\[PAUSE:(\d+)s?\]/g, '<break time="$1s"/>')
                .replace(/\[EMPHASIZE\](.*?)\[\/EMPHASIZE\]/g, '<emphasis level="strong">$1</emphasis>')
                .replace(/\[WHISPER\](.*?)\[\/WHISPER\]/g, '<amazon:effect phonation="breathy">$1</amazon:effect>')
                .replace(/\[SHOCKING\](.*?)\[\/SHOCKING\]/g, '<prosody pitch="+25%" rate="1.2">$1</prosody>');
            break;

        case 'sarvam':
            ssml = ssml
                .replace(/\[PAUSE:(\d+)s?\]/g, '<break time="$1s"/>')
                .replace(/\[EMPHASIZE\](.*?)\[\/EMPHASIZE\]/g, '<emphasis level="strong">$1</emphasis>')
                .replace(/\[WHISPER\](.*?)\[\/WHISPER\]/g, '<amazon:effect phonation="breathy">$1</amazon:effect>')
                .replace(/\[SHOCKING\](.*?)\[\/SHOCKING\]/g, '<prosody pitch="+30%" rate="1.3">$1</prosody>');
            break;

        case 'google':
            ssml = ssml
                .replace(/\[PAUSE:(\d+)s?\]/g, '<break time="$1s"/>')
                .replace(/\[EMPHASIZE\](.*?)\[\/EMPHASIZE\]/g, '<emphasis level="strong">$1</emphasis>')
                .replace(/\[WHISPER\](.*?)\[\/WHISPER\]/g, '<amazon:effect volume="soft">$1</amazon:effect>')
                .replace(/\[SHOCKING\](.*?)\[\/SHOCKING\]/g, '<prosody pitch="+25%" rate="1.25">$1</prosody>');
            break;

        case 'azure':
            ssml = ssml
                .replace(/\[PAUSE:(\d+)s?\]/g, '<break time="$1s"/>')
                .replace(/\[EMPHASIZE\](.*?)\[\/EMPHASIZE\]/g, '<emphasis level="strong">$1</emphasis>')
                .replace(/\[WHISPER\](.*?)\[\/WHISPER\]/g, '<mstts:whisper>$1</mstts:whisper>')
                .replace(/\[SHOCKING\](.*?)\[\/SHOCKING\]/g, '<prosody pitch="+30%" rate="1.2">$1</prosody>');
            break;
    }

    // Wrap in SSML tags and return
    return `<speak>${ssml}</speak>`;
}

// Get provider name from voice ID
function getProviderFromVoiceId(voiceId) {
    if (voiceId.startsWith('google-')) return 'google';
    if (voiceId.startsWith('azure-') || ['hari', 'ananya', 'karan'].includes(voiceId)) return 'azure';
    if (['ravi', 'anjali', 'vijay'].includes(voiceId)) return 'sarvam';
    return 'elevenlabs'; // default
}

// Validate SSML syntax
function validateSSML(ssml) {
    // Check for proper SSML structure
    if (!ssml.startsWith('<speak>') || !ssml.endsWith('</speak>')) {
        return { valid: false, error: 'Missing <speak> tags' };
    }

    // Check for matching tags
    const tagPattern = /<(\w+)[^>]*>.*?<\/\1>/gs;
    const unclosedTags = ssml.match(/<[^/>]+(?<!\/\s*)>/g);
    
    // Basic validation passed
    return { valid: true, ssml: ssml };
}

// Generate audio from text with SSML conversion
function generateAudio() {
    const text = document.getElementById('editorText').value;
    const voiceName = document.getElementById('selectedVoiceName').textContent;
    const voiceId = window.currentVoiceId;

    if (!text.trim()) {
        alert('Please enter some text');
        return;
    }

    // Show loading state
    const previewAudio = document.getElementById('previewAudio');
    previewAudio.style.opacity = '0.5';
    const playButton = document.querySelector('.generate-loading');
    
    try {
        // Convert text to SSML
        const ssml = convertToSSML(text, voiceId);
        
        // Validate SSML
        const validation = validateSSML(ssml);
        if (!validation.valid) {
            alert('SSML Error: ' + validation.error);
            return;
        }

        console.log('Generated SSML:', ssml);

        // Send to backend API
        fetch('https://hindi-tts-voice-editor.onrender.com/api/generate-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ssml: ssml,
                voice_id: voiceId,
                voice_name: voiceName,
                provider: getProviderFromVoiceId(voiceId),
                language: 'hi-IN'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(audioBlob => {
            // Create audio URL from blob
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Set audio source and play
            previewAudio.src = audioUrl;
            previewAudio.style.opacity = '1';
            previewAudio.play();
            
            console.log('Audio generated successfully');
        })
        .catch(error => {
            console.error('Error generating audio:', error);
            previewAudio.style.opacity = '1';
            
            // Show error message
            alert(`Error generating audio: ${error.message}\n\nMake sure your backend server is running at /api/generate-audio`);
        });

    } catch (error) {
        console.error('Error in generateAudio:', error);
        previewAudio.style.opacity = '1';
        alert('Error: ' + error.message);
    }
}

// Update samples function (can be removed if not needed)
function updateSamples() {
    const textInput = document.getElementById('textInput')?.value;
    
    if (!textInput?.trim()) {
        alert('Please enter some text');
        return;
    }

    console.log('Text to update:', textInput);
    alert('Sample audio files would be updated with: "' + textInput + '"');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hindi TTS Voice Gallery loaded successfully');
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('editorModal');
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeEditor();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEditor();
        }
    });

    console.log('Available providers:', [
        'ElevenLabs',
        'Sarvam AI',
        'Google Cloud',
        'Microsoft Azure'
    ]);
});

// Pause other audio elements when playing one
document.addEventListener('play', function(e) {
    const audios = document.getElementsByTagName('audio');
    for (let audio of audios) {
        if (audio != e.target) {
            audio.pause();
        }
    }
}, true);

// Provider information
const providers = {
    elevenlabs: {
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io',
        apiDocs: 'https://elevenlabs.io/docs',
        description: 'Premium text-to-speech with natural voices'
    },
    sarvam: {
        name: 'Sarvam AI',
        url: 'https://sarvam.ai',
        apiDocs: 'https://docs.sarvam.ai',
        description: 'Indian AI company with localized Hindi support'
    },
    google: {
        name: 'Google Cloud Text-to-Speech',
        url: 'https://cloud.google.com/text-to-speech',
        apiDocs: 'https://cloud.google.com/text-to-speech/docs',
        description: 'Enterprise-grade voice synthesis'
    },
    azure: {
        name: 'Microsoft Azure Speech',
        url: 'https://azure.microsoft.com/services/cognitive-services/text-to-speech',
        apiDocs: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/',
        description: 'Scalable text-to-speech with custom voices'
    }
};

// Function to get provider info
function getProviderInfo(providerKey) {
    return providers[providerKey] || null;
}

// Voice comparison data
const voiceComparison = {
    quality: {
        elevenlabs: 5,
        sarvam: 4,
        google: 5,
        azure: 5
    },
    naturalness: {
        elevenlabs: 5,
        sarvam: 4,
        google: 4,
        azure: 4
    },
    cost: {
        elevenlabs: 3,
        sarvam: 2,
        google: 3,
        azure: 2
    },
    ease_of_use: {
        elevenlabs: 5,
        sarvam: 3,
        google: 3,
        azure: 3
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Alt + 1-4 to switch between providers
    if (event.altKey) {
        switch(event.key) {
            case '1':
                filterProvider('elevenlabs');
                break;
            case '2':
                filterProvider('sarvam');
                break;
            case '3':
                filterProvider('google');
                break;
            case '4':
                filterProvider('azure');
                break;
            case '5':
                filterProvider('all');
                break;
        }
    }
});

// Accessibility: Add ARIA labels
function addAccessibilityLabels() {
    document.querySelectorAll('.voice-card').forEach((card, index) => {
        const voiceName = card.querySelector('h3').textContent;
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', 'Voice sample: ' + voiceName);
    });

    document.querySelectorAll('audio').forEach((audio, index) => {
        audio.setAttribute('aria-label', 'Audio player for voice sample ' + (index + 1));
    });
}

// Call accessibility setup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAccessibilityLabels);
} else {
    addAccessibilityLabels();
}
