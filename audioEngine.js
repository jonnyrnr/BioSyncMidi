/**
 * Functional Audio Engine for BrainWave Music Therapy
 * Real Web Audio API implementation with MIDI capabilities
 * © 2024 Jonathan Wiese @soniscapeMedia
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sequencer = null;
        this.isPlaying = false;
        this.bpm = 120;
        this.currentStep = 0;
        this.sequence = [];
        this.oscillators = {};
        this.analyser = null;
        this.dataArray = null;
        this.isInitialized = false;
        
        // Drum samples (synthesized)
        this.drumSamples = {
            kick: { freq: 60, type: 'sine', decay: 0.5 },
            snare: { freq: 200, type: 'sawtooth', decay: 0.2 },
            hihat: { freq: 8000, type: 'square', decay: 0.1 },
            biometric: { freq: 440, type: 'sine', decay: 0.3 }
        };
        
        this.recording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.5;
            
            // Create analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.connect(this.masterGain);
            
            // Initialize sequence
            this.sequence = new Array(16).fill(null).map(() => ({
                kick: false,
                snare: false,
                hihat: false,
                biometric: false,
                note: null
            }));
            
            this.isInitialized = true;
            this.updateStatus('Audio Engine: Initialized ✓');
            
            // Enable controls
            document.getElementById('startSequencer').disabled = false;
            document.getElementById('stopSequencer').disabled = false;
            
            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            this.updateStatus('Audio Engine: Failed to initialize');
            return false;
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('audioStatus');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    setBPM(bpm) {
        this.bpm = Math.max(60, Math.min(180, bpm));
        document.getElementById('bpmValue').textContent = this.bpm;
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume / 100;
            document.getElementById('volumeValue').textContent = volume;
        }
    }

    playDrumSound(type, frequency = null) {
        if (!this.isInitialized) return;

        const sample = this.drumSamples[type] || this.drumSamples.kick;
        const freq = frequency || sample.freq;
        
        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = sample.type;
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        
        // Envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sample.decay);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.analyser);
        
        // Play
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sample.decay);
    }

    generateBiometricSound(biometricData) {
        if (!this.isInitialized) return;

        const { eeg, pulse, emotion } = biometricData;
        
        // Convert EEG to frequencies
        const alphaFreq = eeg.alpha || 8 + Math.random() * 5;
        const betaFreq = eeg.beta || 15 + Math.random() * 10;
        const thetaFreq = eeg.theta || 4 + Math.random() * 4;
        
        // Create harmonic series based on pulse
        const baseFreq = (pulse || 72) * 4; // Convert BPM to Hz range
        
        // Generate chord based on emotional state
        const chordFreqs = this.getEmotionalChord(emotion, baseFreq);
        
        // Play biometric composition
        chordFreqs.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.5, 'sine');
            }, index * 200);
        });
        
        // Add EEG rhythm
        this.playRhythm(alphaFreq, betaFreq, thetaFreq);
    }

    getEmotionalChord(emotion, baseFreq) {
        const chords = {
            'Calm': [baseFreq, baseFreq * 1.25, baseFreq * 1.5], // Major triad
            'Focused': [baseFreq, baseFreq * 1.2, baseFreq * 1.4], // Suspended
            'Energized': [baseFreq, baseFreq * 1.33, baseFreq * 1.67], // Power chord
            'Relaxed': [baseFreq * 0.8, baseFreq, baseFreq * 1.2] // Soft major
        };
        
        return chords[emotion] || chords['Calm'];
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.isInitialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.analyser);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playRhythm(alpha, beta, theta) {
        // Create rhythmic pattern based on brainwaves
        const pattern = [
            { freq: alpha * 50, time: 0 },
            { freq: beta * 20, time: 0.25 },
            { freq: theta * 100, time: 0.5 },
            { freq: alpha * 60, time: 0.75 }
        ];
        
        pattern.forEach(note => {
            setTimeout(() => {
                this.playTone(note.freq, 0.2, 'triangle');
            }, note.time * 1000);
        });
    }

    startSequencer() {
        if (!this.isInitialized || this.isPlaying) return;

        this.isPlaying = true;
        this.currentStep = 0;
        
        const stepTime = (60 / this.bpm / 4) * 1000; // 16th notes
        
        this.sequencer = setInterval(() => {
            this.playStep(this.currentStep);
            this.updateProgress();
            this.currentStep = (this.currentStep + 1) % this.sequence.length;
        }, stepTime);
        
        this.updateStatus('Sequencer: Playing');
    }

    stopSequencer() {
        if (this.sequencer) {
            clearInterval(this.sequencer);
            this.sequencer = null;
        }
        this.isPlaying = false;
        this.currentStep = 0;
        this.updateProgress();
        this.updateStatus('Sequencer: Stopped');
    }

    playStep(step) {
        const stepData = this.sequence[step];
        
        if (stepData.kick) this.playDrumSound('kick');
        if (stepData.snare) this.playDrumSound('snare');
        if (stepData.hihat) this.playDrumSound('hihat');
        if (stepData.biometric) this.playDrumSound('biometric');
        if (stepData.note) this.playTone(stepData.note, 0.2);
    }

    updateProgress() {
        const progress = (this.currentStep / this.sequence.length) * 100;
        const progressBar = document.getElementById('playProgress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    randomizeSequence() {
        this.sequence = this.sequence.map(() => ({
            kick: Math.random() > 0.7,
            snare: Math.random() > 0.8,
            hihat: Math.random() > 0.5,
            biometric: Math.random() > 0.9,
            note: Math.random() > 0.8 ? 220 + Math.random() * 440 : null
        }));
    }

    async startRecording() {
        if (!this.isInitialized) return;

        try {
            const stream = this.audioContext.createMediaStreamDestination();
            this.masterGain.connect(stream);
            
            this.mediaRecorder = new MediaRecorder(stream.stream);
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.downloadAudio(blob, 'biometric_therapy_session.wav');
            };
            
            this.mediaRecorder.start();
            this.recording = true;
            this.updateStatus('Recording: Active 🔴');
            
        } catch (error) {
            console.error('Recording failed:', error);
            this.updateStatus('Recording: Failed');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.recording) {
            this.mediaRecorder.stop();
            this.recording = false;
            this.updateStatus('Recording: Stopped');
        }
    }

    downloadAudio(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    getAnalyserData() {
        if (this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            return this.dataArray;
        }
        return null;
    }
}

// Global audio engine instance
window.audioEngine = new AudioEngine();

