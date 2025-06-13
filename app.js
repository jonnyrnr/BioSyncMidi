/**
 * Main Application Controller for BrainWave Music Therapy
 * Coordinates all components and handles user interactions
 * © 2024 Jonathan Wiese @soniscapeMedia
 */

class MusicTherapyApp {
    constructor() {
        this.isRecording = false;
        this.visualizerAnimationId = null;
        this.canvas = null;
        this.canvasContext = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
        
        // Initialize visualizer
        this.initVisualizer();
        
        // Start biometric monitoring by default
        setTimeout(() => {
            window.biometricProcessor.startMonitoring();
        }, 1000);
    }

    setupEventListeners() {
        // Audio Engine Controls
        document.getElementById('initAudio').addEventListener('click', () => {
            this.initializeAudio();
        });

        document.getElementById('startSequencer').addEventListener('click', () => {
            window.audioEngine.startSequencer();
            this.startVisualizer();
        });

        document.getElementById('stopSequencer').addEventListener('click', () => {
            window.audioEngine.stopSequencer();
            this.stopVisualizer();
        });

        // BPM Control
        document.getElementById('bpmSlider').addEventListener('input', (e) => {
            window.audioEngine.setBPM(parseInt(e.target.value));
        });

        // Volume Control
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            window.audioEngine.setVolume(parseInt(e.target.value));
        });

        // Biometric Controls
        document.getElementById('generateBiometric').addEventListener('click', () => {
            window.biometricProcessor.generateBiometricMusic();
        });

        document.getElementById('startBiometric').addEventListener('click', () => {
            if (window.biometricProcessor.isMonitoring) {
                window.biometricProcessor.stopMonitoring();
                document.getElementById('startBiometric').textContent = 'Start Biometric Monitoring';
            } else {
                window.biometricProcessor.startMonitoring();
                document.getElementById('startBiometric').textContent = 'Stop Biometric Monitoring';
            }
        });

        // MIDI Controls
        document.getElementById('generateMidi').addEventListener('click', () => {
            window.biometricProcessor.generateMIDIFromBiometrics();
        });

        document.getElementById('downloadMidi').addEventListener('click', () => {
            window.midiGenerator.downloadMIDI();
        });

        document.getElementById('playMidi').addEventListener('click', () => {
            window.midiGenerator.playMIDI();
        });

        document.getElementById('recordAudio').addEventListener('click', () => {
            this.toggleRecording();
        });

        // Sequence Length Control
        document.getElementById('lengthSlider').addEventListener('input', (e) => {
            const length = parseInt(e.target.value);
            document.getElementById('lengthValue').textContent = length;
            // Resize sequence array
            if (window.audioEngine.sequence) {
                window.audioEngine.sequence = new Array(length).fill(null).map(() => ({
                    kick: false, snare: false, hihat: false, biometric: false, note: null
                }));
            }
        });

        // Drum Pads
        document.querySelectorAll('.pad').forEach(pad => {
            pad.addEventListener('click', () => {
                const soundType = pad.getAttribute('data-sound');
                window.audioEngine.playDrumSound(soundType);
                
                // Visual feedback
                pad.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    pad.style.transform = 'scale(1)';
                }, 100);
            });
        });

        // Therapy Mode Buttons (if they exist)
        const therapyButtons = [
            { id: 'relaxationMode', mode: 'relaxation' },
            { id: 'focusMode', mode: 'focus' },
            { id: 'energyMode', mode: 'energy' },
            { id: 'stressReliefMode', mode: 'stress_relief' }
        ];

        therapyButtons.forEach(({ id, mode }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    window.biometricProcessor.setTherapyMode(mode);
                    this.showTherapyModeActivated(mode);
                });
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    async initializeAudio() {
        const button = document.getElementById('initAudio');
        button.textContent = 'Initializing...';
        button.disabled = true;

        try {
            const success = await window.audioEngine.initialize();
            if (success) {
                button.textContent = 'Audio Initialized ✓';
                button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                
                // Randomize initial sequence
                window.audioEngine.randomizeSequence();
                
                // Show success message
                this.showNotification('Audio engine initialized successfully!', 'success');
            } else {
                throw new Error('Failed to initialize audio');
            }
        } catch (error) {
            button.textContent = 'Initialization Failed';
            button.disabled = false;
            this.showNotification('Failed to initialize audio engine. Please try again.', 'error');
        }
    }

    initVisualizer() {
        this.canvas = document.getElementById('visualizerCanvas');
        if (this.canvas) {
            this.canvasContext = this.canvas.getContext('2d');
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }

    startVisualizer() {
        if (!this.canvas || !window.audioEngine.isInitialized) return;

        const draw = () => {
            const dataArray = window.audioEngine.getAnalyserData();
            if (!dataArray) {
                this.visualizerAnimationId = requestAnimationFrame(draw);
                return;
            }

            const width = this.canvas.width;
            const height = this.canvas.height;
            
            this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.canvasContext.fillRect(0, 0, width, height);

            const barWidth = width / dataArray.length;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * height;
                
                // Create gradient
                const gradient = this.canvasContext.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(0.5, '#4ecdc4');
                gradient.addColorStop(1, '#667eea');
                
                this.canvasContext.fillStyle = gradient;
                this.canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
                
                x += barWidth;
            }

            this.visualizerAnimationId = requestAnimationFrame(draw);
        };

        draw();
    }

    stopVisualizer() {
        if (this.visualizerAnimationId) {
            cancelAnimationFrame(this.visualizerAnimationId);
            this.visualizerAnimationId = null;
        }
        
        // Clear canvas
        if (this.canvasContext) {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    toggleRecording() {
        const button = document.getElementById('recordAudio');
        
        if (!this.isRecording) {
            window.audioEngine.startRecording();
            this.isRecording = true;
            button.textContent = 'Stop Recording';
            button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e53)';
            this.showNotification('Recording started', 'info');
        } else {
            window.audioEngine.stopRecording();
            this.isRecording = false;
            button.textContent = 'Record Audio';
            button.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
            this.showNotification('Recording stopped and saved', 'success');
        }
    }

    handleKeyboardShortcuts(e) {
        // Prevent shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case ' ': // Spacebar - play/pause
                e.preventDefault();
                if (window.audioEngine.isPlaying) {
                    window.audioEngine.stopSequencer();
                } else {
                    window.audioEngine.startSequencer();
                }
                break;
            case 'r': // R - record
                e.preventDefault();
                this.toggleRecording();
                break;
            case 'm': // M - generate MIDI
                e.preventDefault();
                window.biometricProcessor.generateMIDIFromBiometrics();
                break;
            case 'b': // B - generate biometric music
                e.preventDefault();
                window.biometricProcessor.generateBiometricMusic();
                break;
            case '1': // Number keys for drum pads
                window.audioEngine.playDrumSound('kick');
                break;
            case '2':
                window.audioEngine.playDrumSound('snare');
                break;
            case '3':
                window.audioEngine.playDrumSound('hihat');
                break;
            case '4':
                window.audioEngine.playDrumSound('biometric');
                break;
        }
    }

    showTherapyModeActivated(mode) {
        const modeNames = {
            'relaxation': 'Relaxation Mode',
            'focus': 'Focus Enhancement',
            'energy': 'Energy Boost',
            'stress_relief': 'Stress Relief'
        };
        
        this.showNotification(`${modeNames[mode]} activated`, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        // Set background based on type
        const backgrounds = {
            'success': 'linear-gradient(45deg, #4ecdc4, #44a08d)',
            'error': 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
            'info': 'linear-gradient(45deg, #667eea, #764ba2)',
            'warning': 'linear-gradient(45deg, #f093fb, #f5576c)'
        };
        
        notification.style.background = backgrounds[type] || backgrounds['info'];
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export session data
    exportSession() {
        const sessionData = {
            timestamp: new Date().toISOString(),
            audioEngine: {
                bpm: window.audioEngine.bpm,
                sequence: window.audioEngine.sequence,
                isInitialized: window.audioEngine.isInitialized
            },
            biometrics: window.biometricProcessor.currentData,
            biometricHistory: window.biometricProcessor.history,
            midiGenerated: parseInt(document.getElementById('midiGenerated').textContent),
            sessionDuration: parseInt(document.getElementById('sessionTime').textContent)
        };

        const blob = new Blob([JSON.stringify(sessionData, null, 2)], 
                             { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `therapy_session_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Session data exported', 'success');
    }

    // Load session data
    loadSession(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const sessionData = JSON.parse(e.target.result);
                
                // Restore audio engine settings
                if (sessionData.audioEngine) {
                    window.audioEngine.setBPM(sessionData.audioEngine.bpm);
                    if (sessionData.audioEngine.sequence) {
                        window.audioEngine.sequence = sessionData.audioEngine.sequence;
                    }
                }
                
                // Restore biometric data
                if (sessionData.biometrics) {
                    window.biometricProcessor.currentData = sessionData.biometrics;
                    window.biometricProcessor.updateUI();
                }
                
                this.showNotification('Session data loaded', 'success');
            } catch (error) {
                this.showNotification('Failed to load session data', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    window.musicTherapyApp = new MusicTherapyApp();
    
    // Show welcome message
    setTimeout(() => {
        window.musicTherapyApp.showNotification(
            'Welcome to BrainWave Music Therapy! Click "Initialize Audio Engine" to begin.', 
            'info'
        );
    }, 1000);
});

// Add keyboard shortcut help
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        alert(`Keyboard Shortcuts:
        
Space - Play/Pause Sequencer
R - Toggle Recording
M - Generate MIDI
B - Generate Biometric Music
1-4 - Play Drum Pads
Ctrl+H - Show this help

© 2024 Jonathan Wiese @soniscapeMedia`);
    }
});

