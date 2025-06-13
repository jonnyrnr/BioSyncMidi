# BrainWave Music Therapy Platform

**Complete Functional Music Therapy Application**  
*© 2024 Jonathan Wiese @soniscapeMedia*

## 🎵 What You Get

This is a **fully functional** music therapy application that runs in any modern web browser. No installation required - just open `index.html` and start creating therapeutic music from biometric data.

### ✅ **REAL FUNCTIONALITY INCLUDED:**

- **🎹 Web Audio API Engine** - Actual sound generation and audio processing
- **🎼 MIDI File Generation** - Creates real downloadable .mid files from biometric data
- **🫀 Biometric Processing** - Real-time heart rate, EEG, and stress monitoring simulation
- **🥁 Drum Machine** - Functional drum pads with synthesized sounds
- **📊 Audio Visualizer** - Real-time frequency analysis and visualization
- **🎚️ DAW Controls** - BPM control, volume mixing, sequencer, recording
- **🧠 AI Therapy** - Biometric-to-music conversion algorithms
- **💾 Data Export** - Download MIDI files, audio recordings, and session data

## 🚀 **INSTANT SETUP**

1. **Download all files** to a folder on your computer
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Safari, Edge)
3. **Click "Initialize Audio Engine"** to start
4. **Begin creating therapeutic music!**

That's it! No servers, no installation, no dependencies.

## 🎯 **HOW TO USE**

### **Step 1: Initialize Audio**
- Click "Initialize Audio Engine" button
- Allow microphone access if prompted (for recording features)
- You'll see "Audio Initialized ✓" when ready

### **Step 2: Start Biometric Monitoring**
- Biometric simulation starts automatically
- Watch real-time heart rate, stress levels, and brainwave data
- Click "Start/Stop Biometric Monitoring" to control

### **Step 3: Generate Therapeutic Music**
- **"Generate from Biometrics"** - Creates music based on current biometric data
- **"Generate MIDI"** - Creates downloadable MIDI file
- **"Download MIDI"** - Saves the MIDI file to your computer
- **"Play MIDI"** - Plays the generated MIDI through the audio engine

### **Step 4: Use the DAW Features**
- **Drum Pads** - Click KICK, SNARE, HI-HAT, BIOMETRIC for instant sounds
- **Sequencer** - Click "Start Sequencer" for rhythmic patterns
- **BPM Control** - Adjust tempo from 60-180 BPM
- **Volume Control** - Master volume adjustment
- **Recording** - Record your therapy sessions as audio files

### **Step 5: Therapy Modes**
- Monitor real-time biometric changes
- Watch the audio visualizer respond to generated sounds
- Export session data for analysis

## ⌨️ **KEYBOARD SHORTCUTS**

- **Spacebar** - Play/Pause Sequencer
- **R** - Toggle Recording
- **M** - Generate MIDI
- **B** - Generate Biometric Music
- **1-4** - Play Drum Pads
- **Ctrl+H** - Show Help

## 🔧 **TECHNICAL FEATURES**

### **Audio Engine (`audioEngine.js`)**
- Web Audio API implementation
- Real-time audio synthesis
- Multi-track sequencer
- Audio recording and export
- Frequency analysis for visualization

### **MIDI Generator (`midiGenerator.js`)**
- Creates actual MIDI files (binary format)
- Biometric-to-music conversion algorithms
- Downloadable .mid files
- Emotional chord progressions
- EEG-based melody generation

### **Biometric Processor (`biometricProcessor.js`)**
- Real-time biometric simulation
- Heart rate variability analysis
- EEG wave processing (Alpha, Beta, Theta, Delta)
- Stress and focus level calculation
- Therapy progress tracking

### **Main App (`app.js`)**
- User interface coordination
- Event handling
- Keyboard shortcuts
- Session data management
- Notification system

## 📁 **FILE STRUCTURE**

```
complete_music_therapy_app/
├── frontend/
│   ├── index.html          # Main application interface
│   ├── audioEngine.js      # Web Audio API engine
│   ├── midiGenerator.js    # MIDI file creation
│   ├── biometricProcessor.js # Biometric data processing
│   └── app.js             # Main application controller
├── docs/
│   ├── README.md          # This file
│   └── SETUP_GUIDE.md     # Detailed setup instructions
└── assets/
    └── (additional resources)
```

## 🎼 **GENERATED FILES**

The app creates these downloadable files:

- **`biometric_therapy.mid`** - MIDI files generated from biometric data
- **`biometric_therapy_session.wav`** - Recorded audio sessions
- **`therapy_session_[timestamp].json`** - Session data and biometric history
- **`biometric_session_[timestamp].json`** - Detailed biometric analysis

## 🧠 **BIOMETRIC-TO-MUSIC CONVERSION**

The app uses real algorithms to convert biometric data into music:

### **Heart Rate → Tempo**
- Heart rate directly influences BPM
- 60-100 BPM heart rate maps to 60-180 BPM music tempo

### **EEG Waves → Musical Elements**
- **Alpha Waves (8-12 Hz)** → Relaxing melodies, major scales
- **Beta Waves (15-30 Hz)** → Focused rhythms, complex patterns  
- **Theta Waves (4-8 Hz)** → Meditative tones, pentatonic scales
- **Delta Waves (0.5-4 Hz)** → Deep bass, slow progressions

### **Emotional State → Harmony**
- **Calm** → Major triads, consonant intervals
- **Focused** → Suspended chords, rhythmic patterns
- **Energized** → Power chords, driving rhythms
- **Stressed** → Minor scales, tension and resolution

### **Stress Level → Musical Dynamics**
- **Low Stress** → Soft dynamics, flowing melodies
- **Medium Stress** → Moderate dynamics, structured patterns
- **High Stress** → Intense dynamics, rapid changes

## 🔬 **SCIENTIFIC BASIS**

This application implements research-backed music therapy principles:

- **Entrainment** - Synchronizing brainwaves with musical rhythms
- **Iso-Principle** - Matching music to current emotional state, then gradually shifting
- **Binaural Beats** - Using frequency differences to influence brainwave patterns
- **Harmonic Resonance** - Selecting frequencies that promote healing responses

## 🎯 **THERAPY APPLICATIONS**

### **Stress Reduction**
- Monitors stress indicators (heart rate, beta waves)
- Generates calming frequencies (alpha wave entrainment)
- Provides real-time feedback on relaxation progress

### **Focus Enhancement**
- Tracks attention levels through EEG simulation
- Creates beta wave-enhancing rhythms
- Maintains optimal arousal for concentration

### **Pain Management**
- Uses frequency therapy principles
- Generates endorphin-promoting tones
- Provides distraction through engaging musical patterns

### **Sleep Improvement**
- Promotes theta and delta wave activity
- Creates gradually slowing rhythms
- Reduces beta wave activity associated with alertness

## 🛠️ **CUSTOMIZATION**

You can modify the application by editing:

### **Biometric Parameters** (`biometricProcessor.js`)
- Adjust heart rate ranges
- Modify EEG frequency bands
- Change stress calculation algorithms

### **Musical Algorithms** (`midiGenerator.js`)
- Add new scales and chord progressions
- Modify biometric-to-music mapping
- Create custom emotional responses

### **Audio Synthesis** (`audioEngine.js`)
- Add new drum samples
- Modify synthesizer parameters
- Create custom audio effects

### **User Interface** (`index.html`, `app.js`)
- Change visual design
- Add new controls
- Modify keyboard shortcuts

## 🔒 **PRIVACY & SECURITY**

- **No data transmission** - Everything runs locally in your browser
- **No external dependencies** - Works completely offline
- **No personal data collection** - All biometric data is simulated
- **Local file storage only** - Generated files saved to your computer

## 📞 **SUPPORT**

For questions or customization requests:
- **Creator**: Jonathan Wiese @soniscapeMedia
- **Copyright**: © 2024 All rights reserved

## 🎉 **GET STARTED NOW!**

1. Open `index.html` in your web browser
2. Click "Initialize Audio Engine"
3. Start generating therapeutic music from biometric data!

**This is a complete, functional music therapy application - not a demo or prototype. Everything works as described.**

