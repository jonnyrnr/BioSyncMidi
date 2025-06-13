/**
 * Biometric Data Processor for BrainWave Music Therapy
 * Simulates and processes EEG, heart rate, and other biometric data
 * © 2024 Jonathan Wiese @soniscapeMedia
 */

class BiometricProcessor {
    constructor() {
        this.isMonitoring = false;
        this.currentData = {
            heartRate: 72,
            stressLevel: 'Low',
            focusLevel: 'Medium',
            alphaWaves: 8.5,
            betaWaves: 15.2,
            thetaWaves: 6.1,
            deltaWaves: 2.3,
            emotionalState: 'Calm',
            arousal: 0.3,
            valence: 0.7
        };
        
        this.history = [];
        this.monitoringInterval = null;
        this.sessionStartTime = null;
        this.stressReductionProgress = 0;
        this.relaxationScore = 0;
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.sessionStartTime = Date.now();
        
        // Simulate real-time biometric data updates
        this.monitoringInterval = setInterval(() => {
            this.updateBiometricData();
            this.updateUI();
            this.recordDataPoint();
        }, 2000); // Update every 2 seconds
        
        console.log('Biometric monitoring started');
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        console.log('Biometric monitoring stopped');
    }

    updateBiometricData() {
        // Simulate realistic biometric variations
        
        // Heart rate variation (60-100 BPM)
        this.currentData.heartRate += (Math.random() - 0.5) * 4;
        this.currentData.heartRate = Math.max(60, Math.min(100, this.currentData.heartRate));
        
        // EEG wave variations
        this.currentData.alphaWaves += (Math.random() - 0.5) * 1;
        this.currentData.alphaWaves = Math.max(6, Math.min(12, this.currentData.alphaWaves));
        
        this.currentData.betaWaves += (Math.random() - 0.5) * 2;
        this.currentData.betaWaves = Math.max(12, Math.min(30, this.currentData.betaWaves));
        
        this.currentData.thetaWaves += (Math.random() - 0.5) * 0.5;
        this.currentData.thetaWaves = Math.max(4, Math.min(8, this.currentData.thetaWaves));
        
        this.currentData.deltaWaves += (Math.random() - 0.5) * 0.3;
        this.currentData.deltaWaves = Math.max(0.5, Math.min(4, this.currentData.deltaWaves));
        
        // Calculate derived metrics
        this.calculateStressLevel();
        this.calculateFocusLevel();
        this.calculateEmotionalState();
        this.updateTherapyProgress();
    }

    calculateStressLevel() {
        // Stress correlates with high beta waves and heart rate
        const stressScore = (this.currentData.betaWaves / 30) + 
                           ((this.currentData.heartRate - 60) / 40);
        
        if (stressScore < 0.4) {
            this.currentData.stressLevel = 'Low';
        } else if (stressScore < 0.7) {
            this.currentData.stressLevel = 'Medium';
        } else {
            this.currentData.stressLevel = 'High';
        }
    }

    calculateFocusLevel() {
        // Focus correlates with beta waves and low theta
        const focusScore = (this.currentData.betaWaves / 30) - 
                          (this.currentData.thetaWaves / 8);
        
        if (focusScore > 0.3) {
            this.currentData.focusLevel = 'High';
        } else if (focusScore > 0) {
            this.currentData.focusLevel = 'Medium';
        } else {
            this.currentData.focusLevel = 'Low';
        }
    }

    calculateEmotionalState() {
        // Emotional state based on alpha/beta ratio and heart rate variability
        const alphaRatio = this.currentData.alphaWaves / 
                          (this.currentData.alphaWaves + this.currentData.betaWaves);
        
        const hrv = Math.abs(this.currentData.heartRate - 72) / 28; // Normalized HRV
        
        this.currentData.arousal = Math.min(1, hrv + (this.currentData.betaWaves / 30));
        this.currentData.valence = alphaRatio;
        
        // Determine emotional state
        if (this.currentData.valence > 0.6 && this.currentData.arousal < 0.4) {
            this.currentData.emotionalState = 'Calm';
        } else if (this.currentData.valence > 0.6 && this.currentData.arousal > 0.6) {
            this.currentData.emotionalState = 'Energized';
        } else if (this.currentData.valence < 0.4 && this.currentData.arousal > 0.6) {
            this.currentData.emotionalState = 'Stressed';
        } else if (this.currentData.valence < 0.4 && this.currentData.arousal < 0.4) {
            this.currentData.emotionalState = 'Relaxed';
        } else {
            this.currentData.emotionalState = 'Focused';
        }
    }

    updateTherapyProgress() {
        if (!this.sessionStartTime) return;
        
        const sessionDuration = (Date.now() - this.sessionStartTime) / 60000; // minutes
        
        // Calculate stress reduction over time
        const initialStress = 0.7; // Assume starting stress level
        const currentStress = this.getStressScore();
        this.stressReductionProgress = Math.max(0, 
            Math.min(100, ((initialStress - currentStress) / initialStress) * 100));
        
        // Calculate relaxation score based on alpha waves
        this.relaxationScore = Math.min(100, 
            (this.currentData.alphaWaves / 12) * 100);
    }

    getStressScore() {
        const stressLevels = { 'Low': 0.2, 'Medium': 0.5, 'High': 0.8 };
        return stressLevels[this.currentData.stressLevel] || 0.5;
    }

    updateUI() {
        // Update biometric displays
        document.getElementById('heartRate').textContent = 
            Math.round(this.currentData.heartRate);
        document.getElementById('stressLevel').textContent = 
            this.currentData.stressLevel;
        document.getElementById('focusLevel').textContent = 
            this.currentData.focusLevel;
        document.getElementById('alphaWaves').textContent = 
            this.currentData.alphaWaves.toFixed(1);
        
        // Update therapy progress
        if (this.sessionStartTime) {
            const sessionMinutes = Math.floor((Date.now() - this.sessionStartTime) / 60000);
            document.getElementById('sessionTime').textContent = sessionMinutes;
            document.getElementById('stressReduction').textContent = 
                Math.round(this.stressReductionProgress);
            document.getElementById('relaxationScore').textContent = 
                Math.round(this.relaxationScore);
        }
    }

    recordDataPoint() {
        const dataPoint = {
            timestamp: Date.now(),
            ...this.currentData
        };
        
        this.history.push(dataPoint);
        
        // Keep only last 100 data points
        if (this.history.length > 100) {
            this.history.shift();
        }
    }

    generateBiometricMusic() {
        if (!window.audioEngine || !window.audioEngine.isInitialized) {
            alert('Please initialize the audio engine first');
            return;
        }
        
        const biometricData = {
            eeg: {
                alpha: this.currentData.alphaWaves,
                beta: this.currentData.betaWaves,
                theta: this.currentData.thetaWaves,
                delta: this.currentData.deltaWaves
            },
            pulse: this.currentData.heartRate,
            emotion: this.currentData.emotionalState,
            arousal: this.currentData.arousal,
            valence: this.currentData.valence
        };
        
        // Generate therapeutic music
        window.audioEngine.generateBiometricSound(biometricData);
        
        console.log('Generated biometric music:', biometricData);
    }

    generateMIDIFromBiometrics() {
        const biometricData = {
            eeg: {
                alpha: this.currentData.alphaWaves,
                beta: this.currentData.betaWaves,
                theta: this.currentData.thetaWaves,
                delta: this.currentData.deltaWaves
            },
            pulse: this.currentData.heartRate,
            emotion: this.currentData.emotionalState
        };
        
        if (window.midiGenerator) {
            window.midiGenerator.generateFromBiometrics(biometricData, 30);
            console.log('Generated MIDI from biometrics:', biometricData);
        }
    }

    getTherapyRecommendation() {
        const recommendations = {
            'Stressed': 'Try deep breathing exercises with low-frequency tones (60-80 Hz)',
            'Calm': 'Continue with current therapy. Consider alpha wave entrainment (8-12 Hz)',
            'Energized': 'Channel energy with rhythmic patterns. Beta wave music (15-30 Hz)',
            'Relaxed': 'Maintain state with theta wave therapy (4-8 Hz)',
            'Focused': 'Enhance concentration with binaural beats at 40 Hz'
        };
        
        return recommendations[this.currentData.emotionalState] || 
               'Continue monitoring for personalized recommendations';
    }

    exportData() {
        const exportData = {
            session: {
                startTime: this.sessionStartTime,
                duration: this.sessionStartTime ? 
                         (Date.now() - this.sessionStartTime) / 60000 : 0,
                stressReduction: this.stressReductionProgress,
                relaxationScore: this.relaxationScore
            },
            currentState: this.currentData,
            history: this.history,
            recommendation: this.getTherapyRecommendation()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], 
                             { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `biometric_session_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Simulate different therapy modes
    setTherapyMode(mode) {
        switch (mode) {
            case 'relaxation':
                this.simulateRelaxationMode();
                break;
            case 'focus':
                this.simulateFocusMode();
                break;
            case 'energy':
                this.simulateEnergyMode();
                break;
            case 'stress_relief':
                this.simulateStressReliefMode();
                break;
        }
    }

    simulateRelaxationMode() {
        // Gradually increase alpha waves, decrease beta
        const interval = setInterval(() => {
            this.currentData.alphaWaves = Math.min(12, this.currentData.alphaWaves + 0.2);
            this.currentData.betaWaves = Math.max(12, this.currentData.betaWaves - 0.3);
            this.currentData.heartRate = Math.max(60, this.currentData.heartRate - 0.5);
            this.updateUI();
        }, 1000);
        
        setTimeout(() => clearInterval(interval), 10000); // 10 seconds
    }

    simulateFocusMode() {
        // Increase beta waves, maintain moderate alpha
        const interval = setInterval(() => {
            this.currentData.betaWaves = Math.min(25, this.currentData.betaWaves + 0.3);
            this.currentData.alphaWaves = Math.max(8, Math.min(10, this.currentData.alphaWaves));
            this.updateUI();
        }, 1000);
        
        setTimeout(() => clearInterval(interval), 10000);
    }

    simulateEnergyMode() {
        // Increase heart rate and beta waves
        const interval = setInterval(() => {
            this.currentData.heartRate = Math.min(90, this.currentData.heartRate + 1);
            this.currentData.betaWaves = Math.min(30, this.currentData.betaWaves + 0.5);
            this.updateUI();
        }, 1000);
        
        setTimeout(() => clearInterval(interval), 10000);
    }

    simulateStressReliefMode() {
        // Decrease heart rate and beta waves, increase alpha
        const interval = setInterval(() => {
            this.currentData.heartRate = Math.max(65, this.currentData.heartRate - 0.8);
            this.currentData.betaWaves = Math.max(15, this.currentData.betaWaves - 0.4);
            this.currentData.alphaWaves = Math.min(11, this.currentData.alphaWaves + 0.3);
            this.updateUI();
        }, 1000);
        
        setTimeout(() => clearInterval(interval), 15000); // 15 seconds
    }
}

// Global biometric processor instance
window.biometricProcessor = new BiometricProcessor();

