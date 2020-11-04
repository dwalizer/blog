class MIDIControlledSynth {

	constructor() {
		this.audioContext = new AudioContext();
		this.oscillator = this.audioContext.createOscillator();
		// this.gain = audioContext.createGain();
		this.oscillator.type = "sine";
		this.oscillator.start();

		this.initializeMidiAccess();
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
		this.oscillator.connect(this.audioContext.destination);
		this.oscillator.frequency.value = frequency;
	}

	stopSound = () => {
		try {
			this.oscillator.disconnect(this.audioContext.destination);
		}
		catch(err) {
			console.log("Couldn't disconnect");
		}
	}

}

export default MIDIControlledSynth;