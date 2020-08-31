---
title: Using sound in React Native
date: "2020-08-31T17:00:03.284Z"
description: "Issues with playing audio in the application"
tags: ["programming", "react", "javascript"]
---

As indicated in previous entries, I've been working on a Round Timer application
in React Native, both as a project to try out React Native and as something I could
actually use while working out.  This has been a little slow going, as I do it in
my free time and between other projects, but the basic version of the timer is
progressing nicely and reaching a finishing point.

That brings us to today's topic - using audio in the application.  As of 2020, it
seems that audio is still not super well supported (or, rather, not at all supported)
by React Native itself.  So we have to use some community solutions.  At the moment,
I'm using the [react-native-sound](https://github.com/zmxv/react-native-sound/) library from zmxv.
This library doesn't seem particularly well maintained anymore, but it seems to have
a lot of use.  I'll probably try out the [react-native-audio-toolkit](https://github.com/react-native-community/react-native-audio-toolkit) to see if it works out a little better.

So, first, you have to install the library.

```
npm install react-native-sound --save
```

The official instructions have a step on linking, but this is apparently no longer
necessary.  Nevertheless, I did run this step:

```
react-native link react-native-sound
```

Now with the library installed, we can import it into our component:

```javascript
import Sound from "react-native-sound";
```

We then set the sound category.

```javascript
Sound.setCategory("Playback");
```

And finally, we create our sound.

```javascript
var bell_end = new Sound("bell_end.mp3", Sound.MAIN_BUNDLE, (error) => {
    if(error) {
        console.log("Failed to load the sound", error);
        return;
    }
});
```

Now, according to the official documentation, when working with Android, the sound
files need to be located at _android/app/src/res/raw/_, and they must be lower
cased with underscores.  In my case, this folder didn't exist, so I had to create
it, and then I dropped my files in there.  Now, to actually play the sound:

```javascript
bell_end.play((success) => {
    if(success) {
        console.log("Sound played");
    } else {
        console.log("Failed to play sound");
    }
    bell_end.release();
});
```

And now, our sound should work!  Should.  In practice, it didn't.  Instead,
 it kept giving me the error:

```
null is not an object (evaluating 'RNSound.IsAndroid')
```

I searched around for a little while and there were a lot of different recommendations
on how to fix this, and none of them worked for me.  Some of the solutions were
probably a result of an older version of React Native, where things were done
differently; for instance, it was recommended that the package be added in the
MainApplication.java, it was recommended to make changes to the gradle files, and so
on.  What finally fixed the issue for me was going into my Android emulator,
completely uninstalling the existing version of the app, then returning to my
terminal and running android again.

```
react-native run-android
```

Once this built and deployed to the emulator, I stopped getting the error.
But, my sounds still wouldn't play.  Initially, it couldn't find the resource - I
honestly have no idea how I fixed this aside from doing another deploy.  But once
it could find the resource, it would nevertheless indicate that it had failed to
play the sound.  I put in a call to **bell_end.getDuration()** just to see if it
was even getting the proper information about the file, but it was just giving me
a value of -1.

Looking around for solutions to this a bit more, I saw various people saying they
had trouble getting the sound to play on the Android emulator, but that it
worked fine on their actual device.  I decided to see if that was the case for me,
so I set my device up for USB debugging, connected it to my computer and deployed
the app.  Sure enough, the sound worked just fine!  So, it seems like there's
something the emulator doesn't like about this process.  I suppose I'll be using
my actual device more going forward!