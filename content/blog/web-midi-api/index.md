---
title: Using the Web MIDI API for MIDI input
date: "2020-10-24T20:26:03.284Z"
description: "Making things musical"
tags: ["programming", "javascript", "music"]
---

A few months ago, in the midst of staying at home amid the pandemic, I
decided to invest a little bit in a MIDI Controller so that I could play
piano / keyboard on my computer and mess around with music.  Of course, that's
been a fun endeavor in itself, but I became curious about how the MIDI input
is actually read on the computer.  This is partially because I had been
using a web application for learning songs on the piano, which could read
the attached MIDI controller.  So I did some research on the Web MIDI API
and here we are.

Before jumping in, you can take a look at the MIDIAccess information on
the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess) and
the [MIDI Association](https://www.midi.org/17-the-mma/99-web-midi).  There's
also a pretty cool tutorial on it at the [Keith McMillen Instruments](https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/) website.

#Getting Started

So the first thing we have to do is actually request the MIDI access.

```javascript
let initializeMIDIAccess = () => {
	navigator.requestMIDIAccess({sysex: false}).then((midiAccess) => {
		console.log(midiAccess);
	}, (error) => {
		console.log("MIDI not supported");
	})
}
```

This is a simple enough way to start.  In our function, we call to request MIDI
access and we set **sysex** to false.  This is the default value for sysex, which
we need to set to false to be able to use on Chrome over HTTP.  You can read
more about sysex [here](https://factotumo.com/2017/03/web-midi-access-sysex-and-ssl/).

We pass a success function and a return function to this; assuming that we were
granted MIDI access, we can then output that in the log.  This won't really tell
us that much though.  In my case, I see an object with these properties.

```
{
	inputs: MIDIInputMap {size: 4}
	onstatechange: null
	outputs: MIDIOutputMap {size: 4}
	sysexEnabled: false
}
```

For now we're mostly concerned with the inputs.  So let's iterate through
the inputs and see what we get.

```javascript
const inputs = midiAccess.inputs.values();
for(let input = inputs.next(); input && !input.done; input = inputs.next()) {
    console.log(input);
}
```

Again, what I see looks like this:

```javascript
{
	done: false
	value: MIDIInput {
		connection: "open", 
		id: "input-0", 
		manufacturer: "AKAI  Professional M.I. Corp.", 
		name: "MPK261", 
		onmidimessage: ƒ, …
	}
},
{
	done: false
	value: MIDIInput {
		connection: "open", 
		id: "input-1", 
		manufacturer: "AKAI  Professional M.I. Corp.", 
		name: "MIDIIN2 (MPK261)",
		onmidimessage: ƒ, …
	}
},
{
	done: false
	value: MIDIInput {
		connection: "open", 
		id: "input-2", 
		manufacturer: "AKAI  Professional M.I. Corp.", 
		name: "MIDIIN3 (MPK261)", 
		onmidimessage: ƒ, …
	}
},
{
	done: false
	value: MIDIInput {
		connection: "open", 
		id: "input-3",
		manufacturer: "AKAI  Professional M.I. Corp.", 
		name: "MIDIIN4 (MPK261)",
		onmidimessage: ƒ, …
	}
}
```

Since I'm using an MPK261, this is about what I want to see.  Obviously, what you see
will vary depending on your connected MIDI Controller.  What we're most interested in
here is the **onmidimessage** function.  In our loop, let's add:

```javascript
if(input.value) {
    input.value.onmidimessage = (message) => {
		console.log(message);
	}
}
```

If everything worked correctly, we should now be able to press keys on our MIDI
controller and get results in our log.  This is what I see when I hit a C key.

```javascript
MIDIMessageEvent {
	bubbles: true,
	cancelBubble: false,
	cancelable: false,
	composed: false,
	currentTarget: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	data: Uint8Array(3) [144, 60, 127],
	defaultPrevented: false,
	eventPhase: 0,
	isTrusted: true,
	path: [],
	returnValue: true,
	srcElement: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	target: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	timeStamp: 568123.3599999687,
	type: "midimessage"
}
MIDIMessageEvent {
	bubbles: true,
	cancelBubble: false,
	cancelable: false,
	composed: false,
	currentTarget: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	data: Uint8Array(3) [128, 60, 0],
	defaultPrevented: false,
	eventPhase: 0,
	isTrusted: true,
	path: [],
	returnValue: true,
	srcElement: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	target: MIDIInput {connection: "open", id: "input-0", manufacturer: "AKAI  Professional M.I. Corp.", name: "MPK261", onmidimessage: ƒ, …},
	timeStamp: 568409.3649999704,
	type: "midimessage"
}
```

So we have two MIDIMessageEvent objects here and the biggest difference between
the two is the value in the data property.  The first message says [144, 60, 127] and
the second says [128, 60, 0].  This is telling us the command, channel, note and
velocity of what was hit.  The 60 is the note - if we hit C#, it'll become 61, if we
hit D, it'll become 62, and so on.  The 127 and 0 are the velocity - so this changes
depending on how hard you hit the note (with the range being between 0 and 127).
Since the second one is when the note is released, the value is 0.  Now we have to
break all this information up.  Care of [Stack Overflow](https://stackoverflow.com/questions/40902864/how-to-parse-web-midi-api-input-messages-onmidimessage):

```javascript
function parseMidiMessage(message) {
  return {
    command: message.data[0] >> 4,
    channel: message.data[0] & 0xf,
    note: message.data[1],
    velocity: message.data[2] / 127
  }
}
```

This probably looks a little confusing - what's going on with message.data[0]?
For more information on that, we can look at this [Summary of MIDI Messages](https://www.midi.org/specifications/item/table-1-summary-of-midi-message) which show us how the
whole thing breaks down.  Basically, the first four bits of the data give us
the command - whether the note has been pressed, released, and so on.  So if
you look at the values for command, you'll see it's 9 when the key is pressed
and 8 when the key is released.

Let's make that function our own and then add it to our original function.

```javascript
let parseMessage = (message) => {
    return {
        command: message.data[0] >> 4,
        channel: message.data[0] & 0xf,
        note: message.data[1],
        velocity: message.data[2]
    };
}

...

let parsedMessage = parseMessage(message);

switch(parsedMessage.command) {
    case 8:
        console.log("note released");
        break;
    case 9:
		console.log("note pressed");
		break;
}
```

Now we can see when the note has been pressed and when it's been released.
To convert this note into a frequency, we can use the following function:

```javascript
let convertNoteToFrequency = (note) => {
	return 440 * Math.pow(2, (note - 69) / 12 );
}

...

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

And that's it!  We've now got input from a MIDI controller.  Next time,
we'll look at actually playing some sounds with this information.  For now,
the source will be up on [Github](https://github.com/dwalizer/WebMIDIInput/).