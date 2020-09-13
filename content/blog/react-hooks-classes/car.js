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