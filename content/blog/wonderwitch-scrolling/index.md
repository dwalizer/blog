---
title: Scrolling the screen in WonderWitch
date: "2020-08-21T15:00:03.284Z"
description: "Using the screen_set_scroll function to move the screen"
tags: ["gaming", "programming"]
---

Today, I wanted to build on the last example of accepting input to do something a little more
interactive.  This is pretty much based on the **scroll** example in the samples folder of the
WonderWitch directory, albeit with some modifications.

So what we're going to do here today is output some text to the screen, and then scroll the
screen (and thus the text) by pressing the direction buttons.  So, we start with something
like the following:

```c
#include <stdlib.h>
#include <sys/bios.h>

void main() {
	int quit = 0, x = 0, y = 0;

	text_set_screen(SCREEN2);
    text_screen_init();
    text_put_string(x, y, "Hello!");

	do {
		switch(key_wait()) {
			case KEY_LEFT1:
				screen_set_scroll(SCREEN2, x++, y);
				break;
			case KEY_RIGHT1:
				screen_set_scroll(SCREEN2, x--, y);
				break;
			case KEY_DOWN1:
				screen_set_scroll(SCREEN2, x, y--);
				break;
			case KEY_UP1:
				screen_set_scroll(SCREEN2, x, y++);
				break;			
			case KEY_START:
				quit = 1;
				break;
			default:
				break;
		}
	} while(!quit);
}
```
Now, if we build it (you can copy the last makefile and .cf file and modify them to use the new names)
and run it, we notice that when we hit a direction, the text moves.  But, if you hold the button down,
nothing happens.  That's not really surprising, since even though it's in a loop, **key_wait()** is pretty
much just waiting for a single button press.  So instead, let's try the function **key\_hit\_check\_with\_repeat()**.
Thus, we modify the code as follows:

```c
do {
	switch(key_hit_check_with_repeat()) {
		case KEY_LEFT1:
			screen_set_scroll(SCREEN2, x++, y);
			break;
		case KEY_RIGHT1:
			screen_set_scroll(SCREEN2, x--, y);
			break;
		case KEY_DOWN1:
			screen_set_scroll(SCREEN2, x, y--);
			break;
		case KEY_UP1:
			screen_set_scroll(SCREEN2, x, y++);
			break;			
		case KEY_START:
			quit = 1;
			break;
		default:
			break;
	}
} while(!quit);
```

Now if we build and run the application, pressing down on a key will cause the screen to keep scrolling,
but it scrolls super fast!  So let's slow that down a bit.  We can add the function **sys_wait(1)** after
the switch statement in our loop.  Now, the text will continue to move, but at a reasonable rate.

It's important to note that we're scrolling the screen here - so if you're using this on an actual WonderWitch
instead of using the MiracleMage emulator, you'll likely see garbage in the background!  So how do we clear
this?  Well, the method I went with was to add the following to the start of my file:

```
text_set_screen(SCREEN1);
text_screen_init();
```

In truth, I don't know if this is necessary, but for our purposes, it does clear the screen below what
we're seeking.  And that's it!  As always, this code is available on [Github](https://github.com/dwalizer/wonderwitch/tree/master/scroll_screen).