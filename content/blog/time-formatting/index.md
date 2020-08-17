---
title: A simple method for formatting a timer in Javascript
date: "2020-08-17T15:00:03.284Z"
description: "Formatting a timer display from milliseconds"
tags: ["javascript", "programming", "react"]
---

I've been working on a React Native project to make an interval timer for working out.
The purpose of this is not only so I can become more familiar with working with React Native,
but also because I needed a timer that better suited my needs while doing heavy bag
workouts.  It seemed like a decent project, since it'd deal not only with creating a
user interface with React Native, but also dealing with user interaction, saving and
loading data, playing sounds and so on.

Anyway, naturally you have to be able to display the time for this sort of thing, and
it feels like I'm always needing to do something like this.  So here's the simple function
I'm using.

```javascript
formatAsTime = (number) => {
    let seconds = number / 1000;
    let minutes = parseInt( seconds / 60 );
    seconds = seconds % 60;

    let displayTime = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

    return displayTime;
}
```