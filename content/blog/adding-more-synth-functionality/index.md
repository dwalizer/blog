---
title: JavaScript Synthesizer - Adding More Functionality
date: "2020-11-09T15:30:03.284Z"
description: "Adding some more diverse sounds"
tags: ["javascript", "programming", "music"]
---

In a prior blog, I mentioned that the Oscillator could be initialized with one of several different types.
But for that article, I just defaulted to the sine type.  However, when you're messing with a synthesizer,
you often want to be able to change the oscillator, among other things (that is partially the point, right?)
So let's take a look at making our synthesizer a little more diverse.

##Cleaning Up and Introducing Gain

Before we get started, I want to address the use of a GainNode here.  This will give us more control over
the signal itself, but for the moment we're just going to use it to make the sound a little bit nicer.
Now, let's go ahead and add the GainNode as well as make parts of this more reusable.  Let's create a
function to create a new oscillator (more on this in a moment):

```javascript
createNewOscillator = (type = "sine") => {
	if(this.oscillator) {
		this.oscillator.stop();
	}
	this.oscillator = this.audioContext.createOscillator();
	this.oscillator.type = type;
	this.gain = this.audioContext.createGain();
	this.oscillator.connect(this.gain);			
	this.oscillator.start();		
}
```

First, let's address the oscillator.start() and oscillator.stop() functions - while these names make it
sound like you would use this to start and stop playing a sound, it's a little misleading.  If you read
one of my prior blogs, you might've noticed I was connecting and disconnecting the oscillator from the
audioContext.destination whenever I started and stopped playing a note.  The reason for this is because
you can't reuse an OscillatorNode - so once you call stop(), the browser will actually clean this up,
and you'll get an error if you try to start that node again.  Instead, you have to actually create a new
oscillator each time.  So that's what we're doing in this function.

Now, previously we connected our oscillator to the audioContext.destination.  Instead, what we're going
to do is create a GainNode, using audioContext.createGain(), and then connect the oscillator to the
GainNode.  At the moment, we're not going to connect the Gain node to anything, but it's going to take
the Oscillator's place in a moment when we actually play sounds.

We also specify a type for the oscillator here, with the default being "sine" - this is the hook for
changing to different types of oscillators that we'll use later.

After making this function, you can remove the oscillator initialization code from your constructor,
and instead, head to the playSound function.

```javascript
playSound = (frequency) => {
	this.createNewOscillator();
	this.gain.connect(this.audioContext.destination);
	this.oscillator.frequency.value = frequency;
}
```

So, now we create a new oscillator when we want to play a sound (and thus a new GainNode), then we
connect the GainNode to the audioContext.destination and set the frequency of the note we want to play.
Then, when we stop playing the sound:

```javascript
stopSound = () => {
	try {
		this.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.1);
	}
	catch(err) {
		console.log("Couldn't ramp down");
	}
}
```

So we changed this - no longer are we disconnecting from the audioContext - instead, we're using this
function, exponentialRampToValueAtTime().  This function allows us to change the gain of the note
being played over time to give it a smooth drop off.  We use a small, but non zero value for the
first parameter, because this requires a non-zero value - this is the gain level we're ramping to.
The second parameter is the time.  Right now, I'm using 0.1, which gives a relatively quick drop off,
but if you want, you can change this value - a higher value will result in a longer drop off.  In other
words, we're changing the Release of the sound here.

Now, I don't know if this next part is necessary, but I went ahead and added this to the createNewOscillator()
function, just as a piece of potential house keeping.

```javascript
if(this.gain) {
	this.gain.disconnect(this.audioContext.destination);
}
```

I just figured I'd disconnect the gain before I recreated everything.

##Changing the Oscillator Type On the Fly

So let's say we want to be able to tweak the oscillator a bit more while we're playing around with the synthesizer.
First, we'll add the ability to toggle between the four different types of waveforms we discussed previously - sine,
square, triangle and sawtooth.

First, let's add a default type to the constructor instead, as well as an object to represent our different types.
This will mostly be for verification later on.

```javascript
constructor() {
	this.oscillatorTypes = [ "sine", "square", "triangle", "sawtooth" ];	
	this.type = "sine";
	this.audioContext = new AudioContext();
	this.initializeMidiAccess();
}
```

Then we can remove that from our createNewOscillator function, which should look like this.

```javascript
createNewOscillator = () => {
	if(this.gain) {
		this.gain.disconnect(this.audioContext.destination);
	}

	if(this.oscillator) {
		this.oscillator.stop();
	}
		
	this.oscillator = this.audioContext.createOscillator();
	this.oscillator.type = this.type;
	this.gain = this.audioContext.createGain();
	this.oscillator.connect(this.gain);			
	this.oscillator.start();		
}
```

Finally, let's make a function to change the type of the oscillator.

```javascript
setOscillatorType(type) {
	if(this.oscillatorTypes.indexOf(type) !== -1 ) {
		this.type = type;
	}
}
```

All we're really doing here is checking if the type passed in is one of the four types defined in
our array, and if so, setting that type.  This is just a simple way to prevent bad values from being
passed to it.  Of course, I should note that this property isn't private, so you could still directly
change that.  If you want, you can use the [private fields from the class proposal](https://github.com/tc39/proposal-class-fields)
to give better protection to it.

So now that we have a way of changing the oscillator type, let's add a way for the user to do that
to our Virtual Keyboard interface.  Let's add this to the Virtual Keyboard, before the actual key display:

```html
<div id="oscillator-controls">
	Type:
	<select id="oscillator-type" onChange={(event) => midiInput.setOscillatorType(event.target.value)}>
		<option value="sine">Sine</option>
		<option value="triangle">Triangle</option>
		<option value="square">Square</option>
		<option value="sawtooth">Sawtooth</option>
	</select>
</div>
```

Now you should be able to change the sound of the synthesizer from the UI and hear the different sounds.
If you're using an actual computer keyboard, you might have noticed, as I did, that at some point during all
of this, holding a button in would cause the sound to start playing, and then start skipping a whole bunch.
This is because the onkeydown event will fire repeatedly as a key is held down, so we want to prevent it from
doing so while a key is currently held down.  So you can do something like this.

```javascript
	let keyboardPressed = false;

	document.onkeydown = (e) => {
		if(!keyboardPressed) {
			keyboardPressed = true;
			let buttonCodes = ["KeyA","KeyW","KeyS","KeyE","KeyD","KeyF","KeyT","KeyG","KeyY","KeyH","KeyU","KeyJ"];
			let buttonCodeIndex = buttonCodes.indexOf(e.code);

			if(buttonCodeIndex !== -1) {
				let selectedKey = keys[buttonCodeIndex];
				keyPressed(selectedKey.frequency);
			}
		}
	}
	document.onkeyup = (e) => {
		keyboardPressed = false;
		keyReleased();
	}
```

##Add a Release Slider

Just for fun, let's add a slider so we can modify the change in gain when we release a note.  Following what we did
for the oscillator type control, let's create a releaseTime property in our constructor.

```javascript
this.releaseTime = 0.1;
```

Then, in our stopSound method, change the function to use this property instead of the hard coded number.

```javascript
this.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + this.releaseTime);
```

And finally, a setter function for our UI to actually use.

```javascript
setReleaseTime(time) {
	if(time > 0) {
		this.stopSound();
		this.#releaseTime = parseFloat(time);
	}
}
```

And now, we add a quick slider to the Keyboard UI to allow us to change the value.  This won't be anything
fancy, but it'll work for our purposes.

```html
Release:
<input type="range" min="0.1" max="2" step="0.1" id="release-slider" onInput={(event) => midiInput.setReleaseTime(event.target.value)} />
```

Now you can mess around with the slider and see how it changes the release of the notes.

That's it for today!  As always, the code is on [Github](https://github.com/dwalizer/WebMIDIInput) and you can try out my version [here](/synthesizer).