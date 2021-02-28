---
title: A React Starter Guide
date: "2021-02-27T23:30:03.284Z"
description: "Getting a simple React application up and running"
tags: ["javascript", "programming", "react"]
---

I've been working with React for a few years now, so I thought it'd be interesting to
write a quick guide to help people get started with it.  I'm going to try to keep
this as simple as I can, so we're not going to get into running a Node.js server or
using a bundler like Webpack.  We're just going to be using an npm script as our build
tool.

##What is React?

React is a Javascript library for building UIs and UI components.  It originated at Facebook
and has been in development for some years.  At the time, it was noteworthy for its use of
a Virtual DOM, which keeps a cache of the DOM, compares changes to it, and then only changes
the parts that need to be changed.  This gives a pretty big performance boost compared to
other libraries at the time, but the Virtual DOM is increasingly a feature of other libraries.

React also only provides the view layer - some libraries will provide other features, like
dealing with Ajax calls - with React, you have to provide your own implementations and
libraries of these features.

##How to Start

First, we're going to need to install Node.js and npm.  There are a few different installers
for this, depending on your platform, which you can get [at the Node.js homepage](https://nodejs.org/en/download/).

After you install Node.js, you should already have access to npm.  You can run the following
commands to check the versions of each:

```bash
node -v
v14.4.0

npm -v
6.14.5
```

The Node Package Manater (npm) gives us access to a lot of different JavaScript libraries, which
is useful not only for installing and using React, but also a lot of different JavaScript libraries
you might want to use while developing your application.  Let's start by initializing the application.

```bash
npm init
```

This will take you through a brief prompt where you enter some information about your project.  If there's
anything you don't have an answer for, just leave it blank. 

Now, we'll install React.

```bash
npm install react react-dom
```

You should now have a **package.json** file in your folder.  This, among other things, specifies the
library versions that your application needs.  It should be a relatively simple file for now.

##Transpiling

Modern JavaScript has improved a lot over older versions, but browsers don't always support the latest
and greatest features, or different browsers will support different features, since they use different
JavaScript engines.  So to be able to leverage a lot of the new features, we have to use something
called a transpiler.  This is a step that's more or less the same as compiling - basically taking something
the browser can't understand and turning it into something that it **can** understand.

Part of why this is important to us is because it allows us to use the JSX syntax, which we'll cover
a little more later.  For now, let's install Babel, Browserify and Babelify.

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react browserify babelify
```

While there are a number of tools we can use, such as Webpack or Rollup, for now we're just going
to keep it simple and use the  command line interface.  In our **package.json** file, add a
scripts section that looks like this:

```javascript
  "scripts": {
    "build": "browserify -t [ babelify --presets [ @babel/preset-env @babel/preset-react ] ] src/index.js -o lib/bundle.js"
  },
```

This will let us run the command **npm build** to actually build our application.

##Creating a Component

Let's first make a **src** folder.  In that src folder, let's go ahead and make a file called **index.js**.
In our index file, we have to import React and React DOM, like so:

```javascript
import React from "react";
import ReactDOM from "react-dom";
```

The simplest way we can make a React application is like this:

```javascript
ReactDOM.render(
	<div>Hello world!</div>,
	document.getElementById('app')
);
```

Save this file and try running the **npm run build** command to build it.  It should build successfully
and output a file called **bundle.js** to our **lib** folder.  Go ahead and make an HTML file, like
**index.html**.

```html
<html>
	<body>
		<div id="app"></div>
		<script type="text/javascript" src="lib/bundle.js"></script>
	</body>
</html>
```

Save this file and go ahead and open it up in a browser.  If it worked, you should see a "Hello world!"
message.

##So what's it doing?

When we use React, we need to have an entry point for React to render into.  For our purposes, we've
chosen to use a div with the id of "app".  Hence, the first part of our call is what we're going to
render (a simple div containing our Hello world message) and the second part tells React where we're
going to render it.

##Adding a new Component

Now that we have this very basic example, we can make it a little more complicated.  Let's make a new
component called *HelloWorld.js* in our **src** folder.

```javascript
import React from "react";

function HelloWorld(props) {
	return <div>Hello world component!</div>
}

export default HelloWorld;
```

This is a component called a **stateless functional component**.  The name is pretty descriptive - it's
just a simple function that has no state (a feature found in classes and hooks).  Back in our **index.js**
file, we'll have to make some changes.  First, we need to make sure we import the new component.

```javascript
import HelloWorld from "./HelloWorld.js";
```

And then, we replace the div in the code with our new component.

```javascript
ReactDOM.render(
	<HelloWorld />,
	document.getElementById('app')
);
```

Go ahead and run **npm build** and refresh the page.  You should now see a slightly different message.

Let's dig in to what this component is doing.

```javascript
import React from "react";
```

We need to import the React library to actually be able to use it.  That's probably self explanatory.

```javascript
function HelloWorld(props) {
```

This is a function declaration, just like any other, where we name our component.  It receives a **props**
argument.  We'll cover what this does in a moment.

```javascript
return <div>Hello world component!</div>
```

This is the actual template we want to render.  Though this is simple HTML, React allows us to use something
called JSX, which is what you can see in the **src.js** component where we've included the HelloWorld
component.  We can make more complex components by adding further components here, but you typically need
a top level component - so you can't, for example, have something like this by default:

```javascript
<div>Div One</div>
<div>Div Two</div>
```

But you can get around this by enclosing them in an array.

```javascript
return [<div>Div One</div><div>Div Two</div>]
```

Finally, we have to export the component to make it available elsewhere.

```javascript
export default HelloWorld;
```

##Passing Data via Properties

Previously, I mentioned that we use JSX in React (although this is, technically, optional), and this
by and large looks like HTML or XML.  So, you can add data items the same way you would an HTML
element:

```javascript
<HelloWorld name="Don" />,
```

If we add this to the **index.js** file and then return to our HelloWorld component, we can access
this information via the **props** element passed in to our component.

```javascript
function HelloWorld(props) {
	return <div>Hello, {props.name}!</div>
}
```

Now if you build this and refresh the page, you should see the name you pass in to the component.
(P.S., it doesn't have to be my name you pass in).  But let's say you want to use an element even
more like an HTML element by passing in the contents of the body.

```javascript
<HelloWorld name="Don">Good morning</HelloWorld>,
```

And in the HelloWorld component, we can access this by using **props.children**, which will return
the body of the component just as it is.

```javascript
return <div>{props.children} {props.name}!</div>
```

Go ahead and build our new bundle and refresh the page.  Now you'll see a nice good morning greeting.

##More Advanced Stuff

Using these stateless functional components is good (and recommended if you don't really need state),
but you have more options for creating your components, which you can find in another blog I wrote
called [React Hooks and Classes](/react-hooks-classes/).

From here, you'll probably want to learn more about actually running your application on a server,
using a bundler like Webpack or Rollup instead of building with Babelify, and reading more about
the ins and outs of working with React by checking out the [official React tutorials](https://reactjs.org/tutorial/tutorial.html).

And that's it for today!