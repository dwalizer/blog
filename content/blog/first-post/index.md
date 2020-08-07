---
title: Unity mysteriously failing to start
date: "2020-08-06T14:14:03.284Z"
description: "Unity apparently doesn't like change, but you have to find that out for yourself."
---

Recently, I was doing some work with Unity.  After closing my session and coming back later,
I found that trying to load my project from the Unity Hub just resulted in Unity crashing
with no error message or explanation.

Initially, I thought I had caused this by moving the license file I had created to another
folder.  So I tried to revoke and renew the license, but the issue persisted.  I even went
as far as to reinstall the whole thing.

It turns out, the issue is that I had recently bought a Wi-Fi adapter for my new computer,
as the built in adapter didn't get a particularly good connection on my network.  After
connecting the new adapter, I had disabled the on board adapter.  Unity, it seems, doesn't
like when you do that!  After re-enabling the original adapter (even though I'm not using it),
Unity finally loaded up as it was supposed to.

Evidently, this is an issue that's existed for <a href="https://forum.unity.com/threads/if-the-network-adaptor-changes-lan-to-wi-fi-the-hub-silently-fails-to-launch-unity-instances.580909/">some time</a>.

Something to keep in mind for the future.