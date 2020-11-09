class MIDIControlledSynth {

	#type;
	#releaseTime;

	constructor() {
		if(typeof window !== 'undefined') {
			this.oscillatorTypes = [ "sine", "square", "triangle", "sawtooth" ];
			this.#type = "sine";
			this.#releaseTime = 0.1;
			this.audioContext = new AudioContext();
			this.initializeMidiAccess();
		}
	}

	createNewOscillator = () => {
		if(this.gain) {
			this.gain.disconnect(this.audioContext.destination);
		}

		if(this.oscillator) {
			this.oscillator.stop();
		}
		
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = this.#type;
		this.gain = this.audioContext.createGain();
		this.oscillator.connect(this.gain);			
		this.oscillator.start();		
	}

	setOscillatorType(type) {
		if(this.oscillatorTypes.indexOf(type) !== -1 ) {
			this.#type = type;
		}
	}

	setReleaseTime(time) {
		if(time > 0) {
			this.stopSound();
			this.#releaseTime = parseFloat(time);
		}
	}

	parseMessage = (message) => {
		return {
			command: message.data[0] >> 4,
			channel: message.data[0] & 0xf,
			note: message.data[1],
			velocity: message.data[2]
		};
	}

	convertNoteToFrequency = (note) => {
		return 440 * Math.pow(2, (note - 69) / 12 );
	}

	initializeMidiAccess = () => {
		console.log("Initializing MIDI Access...");
		navigator.requestMIDIAccess({sysex: false}).then((midiAccess) => {
			const inputs = midiAccess.inputs.values();
			for(let input = inputs.next(); input && !input.done; input = inputs.next()) {
				if(input.value) {
					input.value.onmidimessage = this.processMidiMessage;
				}
			}
		}, (error) => {
			console.log("No MIDI support");
		});
	}

	processMidiMessage = (message) => {
		let parsedMessage = this.parseMessage(message);

		switch(parsedMessage.command) {
			case 8:
				this.stopSound();
				break;
			case 9:
				this.playSound(this.convertNoteToFrequency(parsedMessage.note));
				break;
			default:
				console.log("Unsupported command");
				break;                          
		}		
	}

	playSound = (frequency) => {
		this.createNewOscillator();
		this.gain.connect(this.audioContext.destination);
		this.oscillator.frequency.value = frequency;
	}

	stopSound = () => {
		try {
			this.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + this.#releaseTime);
		}
		catch(err) {
			console.log("Couldn't disconnect");
			console.log(err);
		}
	}

}

export default MIDIControlledSynth;