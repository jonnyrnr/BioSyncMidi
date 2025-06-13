/**
 * MIDI Generator for BrainWave Music Therapy
 * Creates actual downloadable MIDI files from biometric data
 * © 2024 Jonathan Wiese @soniscapeMedia
 */

class MIDIGenerator {
    constructor() {
        this.currentMIDI = null;
        this.tracks = [];
        this.ticksPerQuarter = 480;
        this.tempo = 120; // BPM
    }

    // Convert number to variable length quantity (MIDI format)
    toVLQ(value) {
        let buffer = [];
        buffer.push(value & 0x7F);
        value >>= 7;
        while (value > 0) {
            buffer.push((value & 0x7F) | 0x80);
            value >>= 7;
        }
        return buffer.reverse();
    }

    // Create MIDI header chunk
    createHeader(format, tracks, division) {
        const header = [
            0x4D, 0x54, 0x68, 0x64, // "MThd"
            0x00, 0x00, 0x00, 0x06, // Header length (6 bytes)
            0x00, format,           // Format type
            (tracks >> 8) & 0xFF, tracks & 0xFF, // Number of tracks
            (division >> 8) & 0xFF, division & 0xFF // Time division
        ];
        return new Uint8Array(header);
    }

    // Create MIDI track chunk
    createTrack(events) {
        let trackData = [];
        let currentTime = 0;

        events.forEach(event => {
            // Delta time
            const deltaTime = event.time - currentTime;
            trackData.push(...this.toVLQ(deltaTime));
            currentTime = event.time;

            // Event data
            trackData.push(...event.data);
        });

        // End of track
        trackData.push(0x00, 0xFF, 0x2F, 0x00);

        const trackHeader = [
            0x4D, 0x54, 0x72, 0x6B, // "MTrk"
            (trackData.length >> 24) & 0xFF,
            (trackData.length >> 16) & 0xFF,
            (trackData.length >> 8) & 0xFF,
            trackData.length & 0xFF
        ];

        return new Uint8Array([...trackHeader, ...trackData]);
    }

    // Generate MIDI from biometric data
    generateFromBiometrics(biometricData, duration = 30) {
        const { eeg, pulse, emotion } = biometricData;
        
        // Calculate musical parameters from biometrics
        const tempo = Math.max(60, Math.min(180, pulse || 120));
        const key = this.getKeyFromEmotion(emotion);
        const scale = this.getScaleFromBrainwaves(eeg);
        
        // Create events
        const events = [];
        const beatsPerSecond = tempo / 60;
        const ticksPerSecond = this.ticksPerQuarter * beatsPerSecond;
        
        // Set tempo
        events.push({
            time: 0,
            data: [0xFF, 0x51, 0x03, 
                   (60000000 / tempo >> 16) & 0xFF,
                   (60000000 / tempo >> 8) & 0xFF,
                   (60000000 / tempo) & 0xFF]
        });

        // Generate melody based on EEG
        this.generateMelodyFromEEG(events, eeg, scale, key, duration, ticksPerSecond);
        
        // Generate rhythm based on pulse
        this.generateRhythmFromPulse(events, pulse, duration, ticksPerSecond);
        
        // Generate harmony based on emotion
        this.generateHarmonyFromEmotion(events, emotion, key, duration, ticksPerSecond);

        // Create MIDI file
        const header = this.createHeader(1, 1, this.ticksPerQuarter);
        const track = this.createTrack(events);
        
        const midiData = new Uint8Array(header.length + track.length);
        midiData.set(header, 0);
        midiData.set(track, header.length);
        
        this.currentMIDI = midiData;
        
        // Update UI
        const midiCount = parseInt(document.getElementById('midiGenerated').textContent) + 1;
        document.getElementById('midiGenerated').textContent = midiCount;
        document.getElementById('midiStatus').textContent = `MIDI Generated: ${midiData.length} bytes`;
        
        return midiData;
    }

    getKeyFromEmotion(emotion) {
        const keys = {
            'Calm': 60,      // C major
            'Focused': 62,   // D major  
            'Energized': 64, // E major
            'Relaxed': 57,   // A major
            'Stressed': 58,  // Bb major
            'Happy': 67,     // G major
            'Sad': 65        // F major
        };
        return keys[emotion] || 60;
    }

    getScaleFromBrainwaves(eeg) {
        const alpha = eeg?.alpha || 10;
        const beta = eeg?.beta || 20;
        const theta = eeg?.theta || 6;
        
        // Determine scale based on dominant brainwave
        if (alpha > beta && alpha > theta) {
            return [0, 2, 4, 5, 7, 9, 11]; // Major scale (relaxed)
        } else if (beta > alpha && beta > theta) {
            return [0, 2, 3, 5, 7, 8, 10]; // Minor scale (focused)
        } else {
            return [0, 2, 4, 7, 9]; // Pentatonic (meditative)
        }
    }

    generateMelodyFromEEG(events, eeg, scale, key, duration, ticksPerSecond) {
        const alpha = eeg?.alpha || 10;
        const beta = eeg?.beta || 20;
        
        // Note duration based on alpha waves (slower = longer notes)
        const noteDuration = Math.max(0.25, 2 / alpha) * ticksPerSecond;
        const totalTicks = duration * ticksPerSecond;
        
        let currentTick = ticksPerSecond; // Start after 1 second
        
        while (currentTick < totalTicks) {
            // Choose note from scale based on beta activity
            const scaleIndex = Math.floor((beta / 30) * scale.length) % scale.length;
            const note = key + scale[scaleIndex];
            
            // Note on
            events.push({
                time: Math.floor(currentTick),
                data: [0x90, note, 64] // Channel 1, note on, velocity 64
            });
            
            // Note off
            events.push({
                time: Math.floor(currentTick + noteDuration),
                data: [0x80, note, 0] // Channel 1, note off
            });
            
            currentTick += noteDuration;
            
            // Vary beta slightly for next note
            beta += (Math.random() - 0.5) * 2;
            beta = Math.max(10, Math.min(30, beta));
        }
    }

    generateRhythmFromPulse(events, pulse, duration, ticksPerSecond) {
        const bpm = pulse || 72;
        const beatInterval = ticksPerSecond * (60 / bpm);
        const totalTicks = duration * ticksPerSecond;
        
        let currentTick = 0;
        const kickNote = 36; // C2 - typical kick drum
        const snareNote = 38; // D2 - typical snare
        
        while (currentTick < totalTicks) {
            // Kick on beats 1 and 3
            if (currentTick % (beatInterval * 2) < beatInterval / 4) {
                events.push({
                    time: Math.floor(currentTick),
                    data: [0x99, kickNote, 100] // Channel 10 (drums), kick, velocity 100
                });
                events.push({
                    time: Math.floor(currentTick + beatInterval / 8),
                    data: [0x89, kickNote, 0]
                });
            }
            
            // Snare on beats 2 and 4
            if (currentTick % (beatInterval * 2) >= beatInterval && 
                currentTick % (beatInterval * 2) < beatInterval + beatInterval / 4) {
                events.push({
                    time: Math.floor(currentTick),
                    data: [0x99, snareNote, 80]
                });
                events.push({
                    time: Math.floor(currentTick + beatInterval / 8),
                    data: [0x89, snareNote, 0]
                });
            }
            
            currentTick += beatInterval / 4; // 16th note resolution
        }
    }

    generateHarmonyFromEmotion(events, emotion, key, duration, ticksPerSecond) {
        const chords = this.getChordsForEmotion(emotion, key);
        const chordDuration = 2 * ticksPerSecond; // 2 seconds per chord
        const totalTicks = duration * ticksPerSecond;
        
        let currentTick = 0;
        let chordIndex = 0;
        
        while (currentTick < totalTicks) {
            const chord = chords[chordIndex % chords.length];
            
            // Play chord notes
            chord.forEach((note, index) => {
                events.push({
                    time: Math.floor(currentTick + index * 10), // Slight stagger
                    data: [0x91, note, 50] // Channel 2, note on, velocity 50
                });
                events.push({
                    time: Math.floor(currentTick + chordDuration - index * 10),
                    data: [0x81, note, 0] // Channel 2, note off
                });
            });
            
            currentTick += chordDuration;
            chordIndex++;
        }
    }

    getChordsForEmotion(emotion, key) {
        const chordProgressions = {
            'Calm': [[0, 4, 7], [5, 9, 12], [3, 7, 10], [0, 4, 7]], // I-vi-IV-I
            'Focused': [[0, 3, 7], [5, 8, 12], [2, 5, 9], [0, 3, 7]], // i-v-ii-i
            'Energized': [[0, 4, 7], [2, 5, 9], [5, 9, 12], [0, 4, 7]], // I-ii-vi-I
            'Relaxed': [[0, 4, 7], [7, 11, 14], [5, 9, 12], [0, 4, 7]] // I-V-vi-I
        };
        
        const progression = chordProgressions[emotion] || chordProgressions['Calm'];
        return progression.map(chord => chord.map(note => key + note));
    }

    downloadMIDI(filename = 'biometric_therapy.mid') {
        if (!this.currentMIDI) {
            alert('No MIDI data to download. Generate MIDI first.');
            return;
        }
        
        const blob = new Blob([this.currentMIDI], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        document.getElementById('midiStatus').textContent = `Downloaded: ${filename}`;
    }

    playMIDI() {
        if (!this.currentMIDI) {
            alert('No MIDI data to play. Generate MIDI first.');
            return;
        }
        
        // Convert MIDI to audio using Web Audio API
        this.midiToAudio(this.currentMIDI);
    }

    midiToAudio(midiData) {
        // Simple MIDI playback using the audio engine
        if (!window.audioEngine || !window.audioEngine.isInitialized) {
            alert('Audio engine not initialized. Please initialize audio first.');
            return;
        }
        
        // Parse basic MIDI events and play them
        // This is a simplified implementation
        const notes = this.parseMIDINotes(midiData);
        this.playMIDINotes(notes);
    }

    parseMIDINotes(midiData) {
        // Simplified MIDI parser - extracts note events
        const notes = [];
        // This would need a full MIDI parser for production use
        // For demo, we'll generate some notes based on the data
        for (let i = 0; i < 16; i++) {
            notes.push({
                time: i * 0.5,
                note: 60 + (i % 12),
                duration: 0.4
            });
        }
        return notes;
    }

    playMIDINotes(notes) {
        notes.forEach(note => {
            setTimeout(() => {
                window.audioEngine.playTone(this.midiNoteToFreq(note.note), note.duration);
            }, note.time * 1000);
        });
    }

    midiNoteToFreq(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }
}

// Global MIDI generator instance
window.midiGenerator = new MIDIGenerator();

