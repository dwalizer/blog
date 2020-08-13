---
title: Reusing StyleSheets in React Native
date: "2020-08-10T14:07:03.284Z"
description: "How to reuse StyleSheets in React Native"
tags: ["programming", "react"]
---

While working on a project to learn React Native, I was faced with the typical problem of styling
objects in the application and how to manage that.  React allows you to do inline styles in JSX
using a format similar to CSS, albeit with some changes.

```xml
<div style={{color: "#c0c0c0", paddingBottom: "15px}}>
```

The styles are contained in an object, and instead of dashes in the property names, you have to
use camel case.  Now, this generally works out fine for relatively simple and quick styles, but
as the style of your component grows more complex, this can look really unwieldy in your code.
Typically, when working in React proper, you might just use a className and put your stylesheets
in a CSS file.

React Native is a little bit different, however; you can use the StyleSheet component and then
make this its own component in its own file, and then import it as needed into your components.

```javascript
import { StyleSheet } from "react-native";

const buttonStyle = StyleSheet.create({
    button: {
        backgroundColor: "#c0c0c0",
        borderRadius: 15.0,
        borderWidth: 2
    }
});

export { buttonStyle };
```

Say you've named this file style.js.  You can then import this into your components and use it.

```javascript
import { buttonStyle } from "./style.js";

...

<View style={{buttonStyle.button}}></View>
```

You can either import an entire stylesheet, or you can create stylesheets for different components
and then import just those pieces.  To add to the original style.js file:

```javascript
import { StyleSheet } from "react-native";

const buttonStyle = StyleSheet.create({
    button: {
        backgroundColor: "#c0c0c0",
        borderRadius: 15.0,
        borderWidth: 2
    }
});

const textStyle = StyleSheet.create({
    text: {
        fontSize: 20
    }
});

export { buttonStyle, textStyle };
```

And then in your component:

```javascript
import { buttonStyle, textStyle } from "./style.js";
```

That's all there is to it!