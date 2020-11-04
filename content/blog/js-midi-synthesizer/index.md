---
title: MIDI Controlled Synthesizer in JavaScript
date: "2020-11-03T22:30:03.284Z"
description: "Using the MIDI API and AudioContext"
tags: ["javascript"]
---

Previously, we covered how to read MIDI input using the Web MIDI API.  Now, we're going to actually
do something with that input by taking the first steps to create a very, very simple synthesizer - in
this case, it'll be a single oscillator, monophonic synthesizer.  Which means this isn't going to sound
very interesting beyond very simple melodies, but it's a nice stepping stone.

I used a few different sources for this, building upon the ones from last time, such as the [AudioContext MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) and this blog post from [marcgg.com](https://marcgg.com/blog/2016/11/01/javascript-audio/).

So, let's dive in.

##What is an Oscillator?

An oscillator, in simple terms, creates a wave form that produces a sound.  The shape of the wave form
determines the type of sound you get - out of the box, the AudioContext API has supports for sine, sawtooth,
triangle and square oscillators.  These are four very common types of waveforms that each produce a
unique sound that we use as a building block for digital music.  Synthesizers will often have multiple
oscillators, which can use different waveforms, but right now, we're just going to deal with a single one.

[![Waveforms, provided by Omegatron](https://upload.wikimedia.org/wikipedia/commons/7/77/Waveforms.svg)](https://commons.wikimedia.org/wiki/File:Waveforms.svg)
*Omegatron, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons*

##Creating an Oscillator in JavaScript

First, obviously, we'll need to create the oscillator, and for that, we need to get the AudioContext.

```javascript
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
let oscillator = audioCtx.createOscillator();
```

Depending on your situation, you might not need the first line - I didn't when I was writing this and
working on it, but my Gatsby build failed when I was just trying to create a new AudioContext.  This is the
MDN recommended way to achieve cross browser support.

When creating an AudioContext, you might get a message in our console about how it failed to start because
it needs a user gesture.  This is to prevent autoplaying sounds and what not, so you might need to add
a button or something later on that tells the AudioContext to enable/resume.  I'll cover that a bit later.
Now that we have our oscillator, we need to determine the type of waveform we're going to use.  I'll go ahead
and use a sine wave, but you're welcome to try the sawtooth, triangle and square waves as well to see the
different sounds they create.

```javascript
oscillator.type = "sine";
```

Setting the type is as simple as that.  Now, we have to start the oscillator.

```javascript
oscillator.start();
```

At this point, this still doesn't really do anything.  We're going to need to actually connect the oscillator
to something, but we don't want to do that right now as it'll generate a constant sound.  Let's instead
prepare our oscillator to play actual notes.

##Sending Notes to the Oscillator

Recall that in the MIDI API blog, we created a structure that looked something like this:

```javascript
switch(parsedMessage.command) {
    case 8:
        console.log("note released");
        console.log("Freq: " + convertNoteToFrequency(parsedMessage.note))
        break;
    case 9:
        console.log("note pressed");
        console.log("Freq: " + convertNoteToFrequency(parsedMessage.note))
		break;
	default:
		console.log("Unsupported command");
		break;
}
```

This is where we were actually seeing what notes we pressed on the MIDI controller and converting those
into a usable frequency.  Well, it turns out, that's pretty much all the work done already to make
this work.  Let's make a function to actually play the frequency.

```javascript
let playSound = (frequency) => {
	oscillator.connect(audioCtx.destination);
	oscillator.frequency.value = frequency;
}
```

Notice that we're now finally connecting the oscillator to something, as I mentioned earlier.  This doesn't
have to be the audio context, but we'll cover that later.  Intuitively, you might think this is where you
should use the oscillator.start() function, but trying to use that as well as oscillator.stop() to control
when notes are played and released actually won't work - the application will probably throw an error if you
try it.

So let's modify the structure as such:

```javascript
case 9:
	playSound(convertNoteToFrequency(parsedMessage.note));
	break;
```

And on the other side of things, we need to tell the sound to stop when we release the key:

```javascript
let stopSound = () => {
	try {
		oscillator.disconnect(audioCtx.destination);
	}
	catch(err) {
		console.log("Couldn't disconnect");
	}
}
```

This bit is a little more complicated than the part that actually started the sound.  The reason why I had
to wrap it in a try/catch block is because sometimes there'd be an error when trying to disconnect the
oscillator - this didn't *seem* to impact the starting and stopping of the sounds, but catching it at
least gives us some more insight.

Now, we'll update the other part of our case statement:

```javascript
case 8:
	stopSound();
	break;
```

If you try to run the code now, you should find that you can actually hit keys on your MIDI controller and
produce actual output notes.  For my purposes, I actually ended up wrapping all of this in a class file,
but it's really up to you how you decide to use this.  You can check out a [simple demo here](/synthesizer).

You might notice if you go that page that there's an Enable button.  This is related to what I was talking
about earlier when I said the browser will sometimes refuse to start the AudioContext without some kind of
gesture from the user.  Now, in my experience, when I add this Enable button, the whole thing works even
without me clicking on it, but your mileage may vary (and I'm still working all of this out anyway).  So
for the sake of completeness, we can just write a function and a button like so:

```javascript
let resumeMidiInput = () => {
    midiInput.audioCtx.resume();
}
```

```html
<button onClick={resumeMidiInput}>Enable</button>
```

And that's pretty much it.  Of course, you can't do much with this yet except play very simple melodies,
but we'll see about expanding this in the future.