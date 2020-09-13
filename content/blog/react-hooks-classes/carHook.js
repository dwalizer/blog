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