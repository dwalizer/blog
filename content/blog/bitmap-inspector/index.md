---
title: BMP Inspector Tool
date: "2020-10-02T14:47:03.284Z"
description: "A quick tool to look at monochrome bitmaps"
tags: ["gaming", "programming", "c#", "wonderswan", "wonderwitch"]
---

After writing the last entry on dealing with loading an image into the WonderWitch,
I decided it was kind of a hassle to go through the hex of Bitmaps as I had been.
So, as a quick little project for myself, I decided to make a program that'd do it
for me, and just to get some more hands on experience with it, I opted to do it in C#.

I've since finished and uploaded that to [Github](https://github.com/dwalizer/BmpInspector).
This doesn't support non-monochrome bitmaps just yet but I'll probably develop it to do so
in the future.

An example of it being used on the smile.bmp file from the last project:

```bash
BmpInspector WonderWitchBuilds\display_image\smile.bmp
Monochrome Image
Signature | File Size    | Reserved     | Data Offset
42 4D     | BE 00 00 00  | 00 00 00 00  | 3E 00 00 00

Size         | Width        | Height       | Planes | Bits Per Pixel
28 00 00 00  | 20 00 00 00  | 20 00 00 00  | 01 00  | 01 00

Compression  | Image Size   | XpixelsPerM  | YpixelsPerM
00 00 00 00  | 80 00 00 00  | 00 00 00 00  | 00 00 00 00

Colors Used  | Important Colors
00 00 00 00  | 00 00 00 00

Red | Green | Blue | Reserved
00 | 00 | 00 | 00 |

Red | Green | Blue | Reserved
FF | FF | FF | 00 |

FF F8 1F FF  | 11111111 11111000 00011111 11111111
FF C7 E3 FF  | 11111111 11000111 11100011 11111111
FF 3F FC FF  | 11111111 00111111 11111100 11111111
FE FF FF 7F  | 11111110 11111111 11111111 01111111
FD FF FF BF  | 11111101 11111111 11111111 10111111
FB FF FF DF  | 11111011 11111111 11111111 11011111
F7 FF FF EF  | 11110111 11111111 11111111 11101111
EF FF FF F7  | 11101111 11111111 11111111 11110111
EF FF FF F7  | 11101111 11111111 11111111 11110111
DF FF FF FB  | 11011111 11111111 11111111 11111011
DF 00 00 7B  | 11011111 00000000 00000000 01111011
DF FF FF FB  | 11011111 11111111 11111111 11111011
BF FF FF FD  | 10111111 11111111 11111111 11111101
BF FF FF FD  | 10111111 11111111 11111111 11111101
BF FF FF FD  | 10111111 11111111 11111111 11111101
BF FF FF FD  | 10111111 11111111 11111111 11111101
BF FF FF FD  | 10111111 11111111 11111111 11111101
BF C7 E3 FD  | 10111111 11000111 11100011 11111101
BF A3 C5 FD  | 10111111 10100011 11000101 11111101
BF 41 82 FD  | 10111111 01000001 10000010 11111101
DF 41 82 FB  | 11011111 01000001 10000010 11111011
DF 65 A6 FB  | 11011111 01100101 10100110 11111011
DF BB DD FB  | 11011111 10111011 11011101 11111011
EF C7 E3 F7  | 11101111 11000111 11100011 11110111
EF FF FF F7  | 11101111 11111111 11111111 11110111
F7 FF FF EF  | 11110111 11111111 11111111 11101111
FB FF FF DF  | 11111011 11111111 11111111 11011111
FD FF FF BF  | 11111101 11111111 11111111 10111111
FE FF FF 7F  | 11111110 11111111 11111111 01111111
FF 3F FC FF  | 11111111 00111111 11111100 11111111
FF C7 F3 FF  | 11111111 11000111 11110011 11111111
FF F8 0F FF  | 11111111 11111000 00001111 11111111
```

As you can see, it looks more or less like what I wrote up in the article.
This should make it a bit quicker for me to generate these dumps if I end up
needing them again in the future.

While writing this in C# was a fun and interesting exercise, the resulting file
that I get from it ends up being something like 68MB, which is pretty huge for
such a simple program.  Originally, I had planned to write this in C or C++,
but decided it was an opportunity to try something else.  Still, doesn't make
it super portable, exactly.