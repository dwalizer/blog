---
title: Reading button input on WonderWitch
date: "2020-08-17T11:00:03.284Z"
description: "How to read button presses on WonderWitch"
tags: ["gaming", "programming", "c", "wonderswan", "wonderwitch"]
---

Following on from our Hello World example, let's start with something basic - reading user input.
In the Hello World example, we used the function **key_wait()** to wait for user input before
closing the application.  We're going to revisit that function to capture button presses.
Let's start with setting up the text.

```c
#include <stdio.h>
#include <sys/bios.h>

void main() {
	int quit = 0;

    text_screen_init();
    text_put_string(0, 0, "Please press a button.");
	text_put_string(0, 1, "Press start to quit.");

}
```

As before, we initialize the screen for text input.  Then, we add two text strings.  The
text put string function takes two numbers and a string, as above.  The first two numbers,
as you might expect, decide the X and Y coordinates on the screen where the string appears.
We just want this to appear on two different lines, so we use 0 and 1.  Further, we put an
integer at the top, **quit**, to deal with the loop we'll be adding in the next step.

```c
	while(quit == 0) {
		switch(key_wait()) {
			case KEY_UP1:
				text_put_string(0, 3, "UP   ");
				break;
			case KEY_DOWN1:
				text_put_string(0, 3, "DOWN ");
				break;
			case KEY_LEFT1:
				text_put_string(0, 3, "LEFT ");
				break;
			case KEY_RIGHT1:
				text_put_string(0, 3, "RIGHT");
				break;
			case KEY_START:
				text_put_string(0, 3, "START");
				quit = 1;
				break;
			case KEY_Y1:
				text_put_string(0, 3, "Y1   ");
				break;
			case KEY_Y2:
				text_put_string(0, 3, "Y2   ");
				break;
			case KEY_Y3:
				text_put_string(0, 3, "Y3   ");
				break;
			case KEY_Y4:
				text_put_string(0, 3, "Y4   ");
				break;
		}
	}
```

We create a while loop that keeps running until the user quits.  We'll go ahead and set the
start button to be quit.  In our switch statement, we get the value from **key_wait()** and
then act upon it.  The above switch statement will handle both the Y and X buttons as well
as the start button.  For each one, we display a string on the screen at line 4 (it's zero
indexed, so line 4 is 3).  Note that I've added spacing to the end of the strings.  This is
because it doesn't clear the line before putting new text to it - it overwrites what's there.
So, I had to add the spacing so that we don't end up with buggy text.  There might be a better
way to do this, but I'm still figuring things out.

You can find the full code and finished **.fx** file on my [Github](https://github.com/dwalizer/wonderwitch)