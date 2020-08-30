---
title: Using colorful text in WonderWitch
date: "2020-08-30T16:00:03.284Z"
description: "Adding a little color to the display"
tags: ["gaming", "programming"]
---

Next up in this line of articles about the WonderWitch, we're going to add a little color
to the display.  **Note that if you're testing on MiracleMage, as far as I know it does not
support color output**.  Initially I thought this would be a quick thing to do and write
about and had planned to have this done a few days ago, but it ended up a little more
complicated than I had anticipated, and I didn't have as much time to work on it as I wanted.

In any case, here we go.

##Including the header file and setting the palette

I used the Calendar sample program supplied by the WonderWitch install as the basis of this;
there are two versions of it, one of which is marked with "wwc" at the end.  This is the
version for the WonderWitch with color.  You can take a look at it for some more information.

First, we're going to need to include a new header file.

```c
#include <sys/libwwc.h>
```

After that, let's go ahead and copy what's in the Calendar sample program to create an **init\_color**
function before our main procedure.

```c
void init_color()
{
    if (wwc_get_hardarch() == HARDARCH_WSC) {
		wwc_set_color_mode(COLOR_MODE_4COLOR);
		wwc_palette_set_color(0, 0, 0x0fff);	/* white */
		wwc_palette_set_color(0, 1, 0x000f);	/* blue */
		wwc_palette_set_color(0, 2, 0x0f00);	/* red */
		wwc_palette_set_color(0, 3, 0x0000);	/* black */
    }
}
```

Now, if we take a look in the libwwc.h file, we can get a little insight into some of this.  First,
we see a function, **wwc\_get\_hardarch()** which is checking a constant **HARDARCH\_WSC**.  This is
checking to see if the hardware is the WonderSwan Color.  **HARDARCH\_WSC** is an integer that's set
to either 0 (WonderSwan) or 1 (WonderSwan Color).  Since we're using a WonderSwan Color for this, we
know that the if statement will be entered.

Next, the color mode is set.  We have four color mode options:

```c
#define COLOR_MODE_GRAYSCALE		0x00
#define COLOR_MODE_4COLOR		0x80
#define COLOR_MODE_16COLOR		0xC0
#define COLOR_MODE_16PACKED		0xE0
```

So, what's the difference between these modes?  The names sound mostly self explanatory.  Here's what
the official documentation has to say.

>グレースケールモード
>
>キャラクタあたり4色のグレースケール階調で画像を表現するモードです。ワンダースワンと互換性をもっており、ソフトウェア的な変更は必要ありません。特に指定しない限り、プログラム開始時はこのモードになっています。
>

This is basically saying that the Grayscale mode provides four different levels of gray and is
for the WonderSwan mode.  So we should have four different gradients of gray in this mode.

>4色カラーモード
>
>キャラクタカラーパレットの各カラー番号に対してRGB各4bit、4096色中の1色を設定し、1キャラクタあたり4色で表現したフォントをカラー表示するモードです。 カラーパレットの設定のみで、既存のモノクロ版ソフトウェアを簡易的にカラー化することができます。
>
>キャラクタフォント内の各ピクセルは0～3のカラー番号で表され、従来と同じ形式のフォントデータで指定します。 各キャラクタカラーパレットのカラー番号0～3に設定された色を用います。
>
>注意: ワンダースワンカラーで実行する場合のみ、利用可能です。
>

As far as I can understand this, in the 4 color mode, each color in the pallete is a 4 bit RGB value.
We can represent up to 4096 colors in this mode.  You can apparently easily turn a monochrome application
into a color one by simply setting this mode.  Each pixel is represented by a number from 0 to 3.

>16色カラーモード、16色カラーパックトモード
>
>1キャラクタあたり16色を使って画像表現を行なうモードです。キャラクタフォントは4bitのカラー番号を1ピクセルとするビットマップデータで、1バイトで2ピクセル、4バイトで1ライン(8ピクセル)を表現し、32バイトで8ライン(1キャラクタ)分のデータを構成します。
>
>16色カラーモードと16色カラーパックトモードは、各ラインの4バイトデータにピクセルデータを割り振る方法が異なります。 16色カラーモードでは、 従来のフォントデータと同様、各バイトの同じビット位置のデータ4bitを使って1ピクセル分のカラー番号を指定します。
>これに対して、16色カラーパックトモードでは、2ピクセルで1バイトのデータを 左から順に並べます。 1バイトの中では上位4ビットが左側のピクセルに対応し、下位4ビットが右側のピクセルに対応します。
>

So, the gist of this, as I understand it, is that the 16 bit color mode is used for images, and the
difference between 16 Color and 16 Packed is how the data is actually allocated.  If you're interested
in this mode and are capable of reading Japanese or are willing to use Google Translate, this is all in
section 12.5 of the Color Library manual in the documentation.  Since we're just going to be doing text,
the 16 color mode probably isn't of interest to us just now, but inevitably we'll revisit it later.

Back to our function, we see that we're now setting the palette colors.  The header for this function
looks like this:

```c
void wwc_palette_set_color(unsigned palette_no, unsigned index, unsigned rgb);
```

So we have a palette_no, index and rgb.  Recall from just above that we have to represent each
color we're going to use first by an index between 0 and 3, and then a 4 bit RGB value.  We can
see in the function that each color is using the pallette at index 0, and then for colors 0, 1, 2 and 3,
a color value is being set:

```c
		wwc_palette_set_color(0, 0, 0x0fff);	/* white */
		wwc_palette_set_color(0, 1, 0x000f);	/* blue */
		wwc_palette_set_color(0, 2, 0x0f00);	/* red */
		wwc_palette_set_color(0, 3, 0x0000);	/* black */
```

From looking at this, we can see that the second value in our colors is red, and the last is
blue, which means the third is green.  So what's the first one?  Well, nothing.  According to the
documentation:

>|未使用|Ｒ成分|Ｇ成分|Ｂ成分|

未使用(みしよう/mishiyou) means "unused".  So we don't seem to need to worry about this one.  You can
choose to set the colors as whatever you'd like.  I actually went ahead and changed white to
green (0x00f0) just for fun.

##Putting it in action

We could just use each of these, display a few different colors and call it a day.  But I felt
like making it slightly more interactive, so instead we'll change the color of some text based
on the button press.  In our main function, we need to start with an integer or boolean to quit,
as well as to initialize the text screen, and call our above color initialization function.
Additionally, we'll add a little bit of informative text at the top just so we know what the
application is supposed to be doing.

```c
	int quit = 0;

    text_screen_init();

	init_color();

    text_put_string(0, 0, "Please press a button to");
	text_put_string(0, 1, "to change the text color");
	text_put_string(0, 2, "Press start to quit.");	
```

Now, let's create a loop that waits for the user to press a button on the system and then
prints some text of a given color.

```c
	while(quit == 0) {
		switch(key_wait()) {
			case KEY_UP1:
				font_set_color(0x00);
				break;
			case KEY_DOWN1:
				font_set_color(0x01);
				break;
			case KEY_LEFT1:
				font_set_color(0x02);
				break;
			case KEY_RIGHT1:
				font_set_color(0x03);
				break;
			case KEY_START:
				quit = 1;
				break;
		}

		text_put_string(0, 4, "Hello!");
	}
```

We're using the Start button to initiate the quit condition here.  Then, at the end of it,
we print a simple greeting.

Now, just compile this (you can rework a previous makefile and .cf file), transfer the
resulting **.fx** file to the WonderWitch via TransMagic, and give it a run.  Now, when
you press the buttons (specifically X1, X2, X3 and X4), you should see some text pop up
corresponding to our different colors.

If you decided to change the first color in the pallette from something other than white,
you might notice what actually happened is that the entire background is painted with that
color - so I guess the first color in the pallete is used for the background.  You can
play around with this a bit more if you'd like - try setting it to black and seeing how
the different colors show up on it.

And that's it!  As always, the source code is available on [Github](https://github.com/dwalizer/wonderwitch/tree/master/colorful_text).