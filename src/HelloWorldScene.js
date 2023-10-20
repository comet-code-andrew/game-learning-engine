import Phaser from 'phaser'
import { GridControls } from "./GridControls";
import { GridPhysics } from "./GridPhysics";
import { Player } from "./Player";
import { Direction } from "./Direction.js"


const sceneConfig = {
	active: false,
	visible: false,
	key: "hello-world",
};


export default class GameScene extends Phaser.Scene {

	static TILE_SIZE = 48;

	#gridControls;
	#gridPhysics;

	constructor() {
		super(sceneConfig)
		console.log(Phaser);

	}


	preload() {
		this.load.image("tiles", "assets/cloud_tileset.png")
		this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud_city.json")

		// Load our character onto the board
		this.load.spritesheet("player", "assets/characters.png", {
			frameWidth: 26,
			frameHeight: 36,
		});
	}

	create() {

		// tile map
		const cloudCityTilemap = this.make.tilemap({key: "cloud-city-map"});
		cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
		for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
			const layer = cloudCityTilemap
				.createLayer(i, "Cloud City", 0, 0)
			layer.setDepth(i);
			layer.scale = 3;
		}

		// character
		const playerSprite = this.add.sprite(5, 5, "player");
		playerSprite.setDepth(1);
		playerSprite.scale = 3;
		this.cameras.main.startFollow(playerSprite);
		this.cameras.main.roundPixels = true;
		const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

		// Movement
		// The GridPhysics engine requires the tile map to be able to check for collision detection
		this.#gridPhysics = new GridPhysics(player, cloudCityTilemap)
		this.#gridControls = new GridControls(this.input, this.#gridPhysics)

		// Sprite animation
		this.createPlayerAnimation(Direction.UP,90, 92)
		this.createPlayerAnimation(Direction.RIGHT,78, 80)
		this.createPlayerAnimation(Direction.DOWN,54, 56)
		this.createPlayerAnimation(Direction.LEFT,66, 68)
	}

	// A player animation function for creating animations
	createPlayerAnimation(name, startFrame, endFrame) {
		this.anims.create({
			key: name,
			frames: this.anims.generateFrameNumbers("player", {
				start: startFrame,
				end: endFrame
			}),
			frameRate: 10,
			repeat: -1,
			yoyo: true,
		})
	}


	update(_time, delta) {
		this.#gridControls.update();
		this.#gridPhysics.update(delta);
	}
}
