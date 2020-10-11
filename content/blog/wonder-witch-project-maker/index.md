---
title: WonderWitch Project Maker
date: "2020-10-11T00:56:03.284Z"
description: "Automating the process of making new projects"
tags: ["gaming", "programming", "python", "bash", "wonderswan", "wonderwitch"]
---

This is just a quick entry to note that I wrote two scripts (they're both the same, just one's Bash, one's Python)
to automate the process of creating new WonderWitch projects.  Since there a few different things to create to make
these example files, I decided to just write a script to do it for me, which you can get at [Github](https://github.com/dwalizer/WonderWitchProjectMaker).

They're relatively simple scripts (and probably not very good, frankly) that get the job done.  It'd probably make
more sense at this point to create a more sophisticated Makefile for all of this, so maybe I'll do that some day.
In the meantime, this script should suit my needs of quickly making new WonderWitch projects.

It creates the target folder, an initial .C file, a .CF file and a makefile.  The makefile assumes the same
directory structure that I've been using, so you'll have to modify it to suit your purposes, unless your location
is the same as mine.

Next up, I'll be looking into actually moving sprites around the screen, so stay tuned for that.