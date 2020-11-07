import React from "react";
import MIDIInput from "../components/midiControlledSynth"

import "../styles/synthesizer.css";

let midiInput = new MIDIInput();

const VirtualKeyboard = () => {

	let keys = [
		{ note: "C", frequency: 261.6 },
		{ note: "C#", accidental: true, frequency: 277.2 },
		{ note: "D", frequency: 293.7 },
		{ note: "D#", accidental: true, frequency: 311.1 },
		{ note: "E", frequency: 329.6},
		{ note: "F", frequency: 349.2},
		{ note: "F#", accidental: true, frequency: 370},
		{ note: "G", frequency: 392},
		{ note: "G#", accidental: true, frequency: 415.3},
		{ note: "A", frequency: 440},
		{ note: "A#", accidental: true, frequency: 466.2},
		{ note: "B", frequency: 493.9}
	];	

	if(typeof window !== undefined && window.document) {
		document.onkeydown = (e) => {
			let buttonCodes = ["KeyA","KeyW","KeyS","KeyE","KeyD","KeyF","KeyT","KeyG","KeyY","KeyH","KeyU","KeyJ"];
			let buttonCodeIndex = buttonCodes.indexOf(e.code);

			if(buttonCodeIndex !== -1) {
				let selectedKey = keys[buttonCodeIndex];
				keyPressed(selectedKey.frequency);
			}
		}

		document.onkeyup = (e) => {
			keyReleased();
		}
	}

	let keyPressed = (frequency) => {
		midiInput.playSound(frequency);
	}
	
	let keyReleased = () => {
		midiInput.stopSound();
	}
	
	let createVirtualKeyboard = () => {	
		let keyPosition = 450;

		return (
			<div>
				<div id="virtual-keyboard">
					{keys.map((key, index) => {
						keyPosition += (index === 5 ? 50 : 25);
						return (
							<div onMouseDown={() => keyPressed(key.frequency)} onMouseUp={keyReleased}
							     onMouseLeave={keyReleased}
								 className={"key" + (key.accidental ? " accidental" : "")} 
								 style={{ left: keyPosition + "px"}}>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	return createVirtualKeyboard();
}

export default VirtualKeyboard;