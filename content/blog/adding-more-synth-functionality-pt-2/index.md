---
title: JavaScript Synthesizer - Adding More Functionality Part 2
date: "2021-01-31T18:30:03.284Z"
description: "Adding a gain control to the mix"
tags: ["javascript", "programming", "music"]
---

Let me tell you, the holiday season can certainly be a very distracting time, especially when
you spend much of it playing vidoe games.  But hey, here we are again in a new year, so it's
about time I write something new.  Recently, I bought a KORG Kross 2 synthesizer workstation
and it's made me think about this project a little more.  There are still some more things
I'd like to try with it, but for today, we're just going to add a gain slider to the mix.

Gain is, in a very simple way, the volume of our tone - and I mean very very simple way,
because while gain and volume are similar, they're not the same.  The gain will actually
change the tone of the sound, which you'll notice when you actually mess with the gain
slider. But, previously, we've used it to give a sort of Release effect to the audio, causing
it to sort of gradually fade to nothing instead of abruptly doing so.

So, let's dive in.

##Adding the Gain Slider

We're basically just going to copy what we did for the Release slider and slap it into
our interface.

```javascript
Gain:
<input type="range" min="0" max="2" step="0.1" id="release-slider" onInput={(event) => midiInput.setGain(event.target.value)} />
```

Feel free to wrap this, and the Release and Oscillator types in separate elements to make
the display a bit nicer, otherwise it's going to start to look ugly.  Or, well, uglier,
since it's not really a pretty sight to begin with.

##Making it Do Something

Now that we have the UI slider, we need to add a setGain function to our synthesizer.  Recall
that we can do private variables by preceding them with a # sign.  Thus, at the top, add a gain
property like so:

```javascript
#type;
#releaseTime;
#gain;
```

Don't forget to then set this in our constructor.

```javascript
constructor() {
	if(typeof window !== 'undefined') {
		this.oscillatorTypes = [ "sine", "square", "triangle", "sawtooth" ];
		this.#type = "sine";
		this.#releaseTime = 0.1;
		this.#gain = 1;
		this.audioContext = new AudioContext();
		this.initializeMidiAccess();
	}
}
```

We're setting gain to 1 just as a default value.  You're free to change that to
whatever you prefer.  Now the function to actually set the input that we get from the slider:

```javascript
setGain(gain) {
	if(gain >= 0) {
		this.stopSound();
		this.#gain = parseFloat(gain);
	}
}	
```

This is actually a little bit different from our release setter - namely, that we're
checking for equality to 0, rather than just being greater than 0.  The gain value can
range from -3.4 all the way to 3.4 (check out [the WebAudio API MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API) for more info on this),
but for our purposes 0 is effectively muting it, so that'll be our lower value.  
If we don't account for the gain value being 0, the gain value won't update when
the slider is moved all the way to the left side.

So now we've accepted the gain input from the user - where do we actually use it?

In our createNewOscillator function, let's add a line:

```javascript
...

this.gain = this.audioContext.createGain();
this.gain.gain.value = this.#gain;
this.oscillator.connect(this.gain);		

...
```

Remember that you have to set gain.gain, not just gain.value.  This will set the gain to
our new value on the next key press (i.e. the next oscillator cycle).  Give it a shot
and you should find that the tone / volume of the key press changes as you move the
slider around.  This means, however, that you can't change the gain while holding a
key - the gain changes won't take effect until a new oscillator is created.  This is
maybe something to look at doing in the future.

Previously I had been trying to use the gain function, **exponentialRampToValueAtTime** to
simulate the Attack part of the envelope, but so far I've had mixed results.  Even when
I get it to sound how I want it to, it doesn't play nicely with the actual keyboard part.
So, maybe some day in the future when I have more time to mess with that, we'll see what
we can do.

 As always, the code is on [Github](https://github.com/dwalizer/WebMIDIInput) and you can try out my version [here](/synthesizer).