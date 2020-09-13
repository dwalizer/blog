---
title: React Hooks and Classes
date: "2020-09-13T17:00:03.284Z"
description: "Two ways of creating React components"
tags: ["react", "javascript", "programming"]
---

I started working with React about 4 or 5 years ago now, in the earlier days
of the framework, where your main options for creating a component in React
was to use React.createClass, extending the React.Component, or making stateless
functional components.  Some time back, they introduced the concept of [Hooks](https://reactjs.org/docs/hooks-overview.html)
into the language, as a side-by-side feature with classes (but as a likely replacement).
Admittedly, I haven't played around with hooks too much.  I've made a few components
using them, and one of the projects I'm working on I've used a mixture of classes and
hooks.  A good exercise would probably be to rewrite some of my classes as hooks.

Interestingly, I've seen a lot of people say that classes are difficult to understand,
something which I, personally, have never felt.  To me, classes are part of what
makes React components easy to reason about, though I do understand they have some issues.
To quote part of the motivation documentation:

> In addition to making code reuse and code organization more difficult, we’ve found that classes can be a large barrier to learning React. You have to understand how **this** works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable syntax proposals, the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Personally, I don't feel that classes make code reuse or organization more difficult.  It
is true that you have to remember to bind the event handlers, which can be a source of mistakes,
and there are a few ways to do this in a class that can be a bit confusing, to say the least.

Method one, for instance, is to bind it in your constructor.

```javascript
constructor(props) {
	this.myFunction = this.myFunction.bind(this);
}

<button onClick={this.myFunction}>Click Me</button>
```

Method two is to use an arrow function to bind it in the callback:

```javascript
<button onClick={() => this.myFunction()}>Click Me</button>
```

And method three is to use the class fields syntax:

```javascript
myFunction = () => {
	...
}
```

I can certainly see how this would create confusion for new people.  After being a few years into
the language, I've likely forgotten what it was like to first pick up binding events like this.

In any case, let's take a look at how to make a Class component in React.

##Classes

The first thing we have to do is bring in our imports - at the very least, React itself.  Then we
can create a simple class and export it.

```javascript
import React from "react";

class Car extends React.Component {
	render() {
		return <span>Vroom</span>;
	}
}

export default Car;
```

This is a Car class, and the only thing it does right now is output a span with the text "Vroom".
Simple enough, right?  Currently, this does nothing useful, but it does give us access to the
[React lifecycle methods](https://reactjs.org/docs/react-component.html).  Within the class,
we can add a constructor, which will allow us to initialize the state of the class - you can
look at the state as being the various pieces of information about our class that provide details
and functionality.

```javascript
constructor(props) {
	super(props);

	this.state = {
		isStarted: false,
		currentSpeed: 0
	};
}
```

To be honest, I'm not much of a car guy, so I'm not even sure why I chose this as my example, but we're
in too deep.  So let's say our car has two pieces of information we care about - whether the car has
been started, and what the current speed is.  We'll initialize these two values as above and update our
render function:

```javascript
return <span>The car is {this.state.isStarted ? "running" : "off"}, going {this.state.currentSpeed} mph.</span>;
```

If we actually use this component somewhere, we'll see:

```
The car is off, going 0 mph.
```

We need some way to modify these two values, so we'll create a few functions.

```javascript
startCar = () => {
	this.setState({isStarted: true});
}

stopCar = () => {
	this.setState({isStarted: false});
}

increaseSpeed = () => {
	let currentSpeed = this.state.currentSpeed;
	this.setState({currentSpeed: currentSpeed + 5});
}

decreaseSpeed = () => {
	let currentSpeed = this.state.currentSpeed;
	this.setState({currentSpeed: currentSpeed > 0 ? currentSpeed - 5 : 0});
}
```

Now we can actually control the car, if we have the right buttons to do so.  So let's change our render
method again:

```javascript
return (
	<div>
		<button onClick={this.startCar}>Start</button>
		<button onClick={this.stopCar}>Stop</button>
		<button onClick={this.increaseSpeed}>Accelerate</button>
		<button onClick={this.decreaseSpeed}>Brake</button>
		<span>The car is {this.state.isStarted ? "running" : "off"}, going {this.state.currentSpeed} mph.</span>
	</div>
)
```

React will take care of actually updating the values in the span for us as we make changes.  Now, some of these
buttons don't really make sense to have active all the time.  You can't stop a car that's already stopped, or
decelerate a car that's not moving.  So we'll add some quick checks to disable the buttons.

```javascript
<button onClick={this.startCar} disabled={this.state.isStarted}>Start</button>
<button onClick={this.stopCar} disabled={!this.state.isStarted}>Stop</button>
<button onClick={this.increaseSpeed} disabled={!this.state.isStarted}>Accelerate</button>
<button onClick={this.decreaseSpeed} disabled={!this.state.isStarted || this.state.currentSpeed === 0}>Brake</button>
```

We should probably also reset the speed to 0 if the car is stopped, so we'll update our stop function.

```javascript
stopCar = () => {
	this.setState({isStarted: false, currentSpeed: 0});
}
```

Now we have a relatively simple class component, which should look something like this:

```javascript
import React from "react";

class Car extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isStarted: false,
			currentSpeed: 0
		};
	}

	startCar = () => {
		this.setState({isStarted: true});
	}
	
	stopCar = () => {
		this.setState({isStarted: false, currentSpeed: 0});
	}
	
	increaseSpeed = () => {
		let currentSpeed = this.state.currentSpeed;
		this.setState({currentSpeed: currentSpeed + 5});
	}
	
	decreaseSpeed = () => {
		let currentSpeed = this.state.currentSpeed;
		this.setState({currentSpeed: currentSpeed > 0 ? currentSpeed - 5 : 0});
	}	

	render() {
		return (
			<div>
				<button onClick={this.startCar} disabled={this.state.isStarted}>Start</button>
				<button onClick={this.stopCar} disabled={!this.state.isStarted}>Stop</button>
				<button onClick={this.increaseSpeed} disabled={!this.state.isStarted}>Accelerate</button>
				<button onClick={this.decreaseSpeed} disabled={!this.state.isStarted || this.state.currentSpeed === 0}>Brake</button>
				<span>The car is {this.state.isStarted ? "running" : "off"}, going {this.state.currentSpeed} mph.</span>
			</div>
		)
	}
}

export default Car;
```

So now let's rewrite this using Hooks.

##Hooks

While I don't have trouble understanding that class, and hopefully you don't either, it is rather verbose.
Let's see how it looks if we rewrite it with hooks.  Starting from the most basic version:

```javascript
import React, {useState} from "react";

function CarHook() {

	return (
		<span>Vroom</span>
	)
}

export default CarHook;
```

Hooks introduces **useState**, which allows us to instead declare our state variables within the function
like this:

```javascript
const [isStarted, setStarted] = useState(false);
const [currentSpeed, setSpeed] = useState(0);
```

We can then change our render statement similar to when we made a Class, except now we don't need to use
**this.state** to access the values.

```javascript
<span>The car is {isStarted ? "running" : "off"}, going {currentSpeed} mph.</span>
```

We should see a display similar to earlier:

```
The car is off, going 0 mph.
```

Let's rewrite our control functions like regular functions, now using the state functions we declared
above.

```javascript
function startCar() {
	setStarted(true);
}
	
function stopCar() {
	setStarted(false);
	setSpeed(0);
}
	
function increaseSpeed() {
	setSpeed(currentSpeed + 5);
}
	
function decreaseSpeed() {
	setSpeed((currentSpeed > 0 ? currentSpeed - 5: 0 ));
}		
```

So let's go ahead and modify the return statement to add in the buttons to control the vehicle, and
modify it to no longer use **this.state** for the variables, and to use our new functions.

```javascript
<button onClick={() => startCar()} disabled={isStarted}>Start</button>
<button onClick={() => stopCar()} disabled={!isStarted}>Stop</button>
<button onClick={() => increaseSpeed()} disabled={!isStarted}>Accelerate</button>
<button onClick={() => decreaseSpeed()} disabled={!isStarted || currentSpeed === 0}>Brake</button>	
```

Note the difference in the onClick events between hooks and classes.  As noted earlier, you
can use a similar method for classes to bind events in the onClick section, but I opted not
to for this blog, as it feels cleaner to me.  When using Hooks, however, don't forget to bind
it like this, otherwise you might get an error about there being too many renders.

Now, we should have two components that have identical functionality.  The Hook version should
look like this.

```javascript
import React, {useState} from "react";

function CarHook() {
	const [isStarted, setStarted] = useState(false);
	const [currentSpeed, setSpeed] = useState(0);

	function startCar() {
		setStarted(true);
	}
	
	function stopCar() {
		setStarted(false);
		setSpeed(0);
	}
	
	function increaseSpeed() {
		setSpeed(currentSpeed + 5);
	}
	
	function decreaseSpeed() {
		setSpeed((currentSpeed > 0 ? currentSpeed - 5: 0 ));
	}		

	return (
		<div>
			<button onClick={() => startCar()} disabled={isStarted}>Start</button>
			<button onClick={() => stopCar()} disabled={!isStarted}>Stop</button>
			<button onClick={() => increaseSpeed()} disabled={!isStarted}>Accelerate</button>
			<button onClick={() => decreaseSpeed()} disabled={!isStarted || currentSpeed === 0}>Brake</button>	
			<span>The car is {isStarted ? "running" : "off"}, going {currentSpeed} mph.</span>
		</div>
	)
}

export default CarHook;
```

If you look at them side by side, the version with Hooks is almost ten lines shorter, and I think it
does end up looking a bit simpler.  Both of these could be written without the various startCar, stopCar, etc.
functions, but I felt for the sake of clarity, I'd use both.   So either component could be even smaller
if you want them to be.

I still need to spend more time with Hooks and see how they stack up against Classes, but my feelings
have often been that if you reach a point where a stateless functional component needs to be turned into
a component with state, it's a lot quicker and easier to do that by turning it into a Hook rather than a
Class.  Classes do give you a lot of good lifecycle methods that I think work well for more complex
components.  I'll have to write another article on **useEffect** with React Hooks to show how that changes
things.  For now, at least, relatively simple components work very well using Hooks.

You can grab the code for both of these components on [Github](https://github.com/dwalizer/blog/tree/master/content/blog/react-hooks-classes/)
or from these links:

[Car Class](./car.js)

[Car Hook](./carHook.js)