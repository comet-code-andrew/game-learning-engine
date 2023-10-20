import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 528;

const config = {
	title: "Sample",
	render: {
		antialias: false,
	},
	type: Phaser.AUTO,
	scene: [HelloWorldScene],
	scale: {
		parent: 'app',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: window.innerWidth,
		height: window.innerHeight
	},
	parent: 'app',


}

export default new Phaser.Game(config)
