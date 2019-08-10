import Player from "../units/player.js";
import FrogEnemy from "../units/frog-enemy.js";
import SpringBoard from "../physicsObjects/springBoard.js";
import Gem from "../collectables/gem.js";
import EnemyManager from "../managers/enemy-manager.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {

	constructor(level) {
		if (level) {
			console.log("Using provided level for PlatformerScene constructor...");
			console.log("Creating level:" + level.key + " with map: map" + level.key);
			super({ key: level.key });
			this.currentLevel = level.key;
		} else {
			console.log("Using default PlatformerScene constructor...");
			//always load level 1 by default
			super({ key: 'level1' });
			this.currentLevel = 1;
		}
	}

	preload() {
		//"this" === Phaser.Scene
		//load repeating background image
		this.load.image("background-repeat", "./assets/tilesets/environment/back.png");
		//load tileset image
		this.load.image("tiles", "./assets/tilesets/environment/tileset.png");

		//load tilemap
		this.load.tilemapTiledJSON("map"+this.currentLevel, "./assets/tilemaps/level"+ this.currentLevel + ".json");

		//note if using a Multi-packed atlas we need to modify our load method to use Multipack
		this.load.atlas("atlas", "./assets/atlas/items_and_characters_atlas.png", "./assets/atlas/items_and_characters_atlas.json");

		//load audio
		this.load.audio("jump", "./assets/audio/jump.wav");
		this.load.audio("coinCollected", "./assets/audio/coin_collected.wav");
		this.load.audio("music", "./assets/audio/music.ogg");
	}

	hitCollectable(sprite) {
		this.sys.game.soundManager.sfx.coinCollected.play();
		//update player gem count and add a new life every 100 gems
		if (++this.sys.game.gems == 100) {
			this.sys.game.lives += 1;
			this.sys.game.gems = 0;
		}

		//change the sprite name to collected, this flag allows us to
		//delete collected gems on the next pass through of scene.update()
		sprite.name = "collected";

		// Return true to exit processing collision of this tile vs the sprite - in this case, it
		// doesn't matter since the coin tiles are not set to collide.
		return false;
	}

	create() {
		// You can access the game's config to read the width & height
		const { width, height } = this.sys.game.config;

		// Creating a repeating background sprite
		const bg = this.add.tileSprite(0, 0, width, height, "background-repeat");
		bg.setOrigin(0, 0);

		// In v3, you can chain many methods, so you can create text and configure it in one "line"
		this.add
			.text(width / 2, height / 2, "Tilemap\nPhaser 3\nDemo!", {
				font: "64px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(5, 5, "#5588EE", 0, true, true);

		//setup tilemap
		const map = this.make.tilemap({ key: "map"+this.currentLevel });

		// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
		// Phaser's cache (i.e. the name you used in preload)
		const tileset = map.addTilesetImage("tileset", "tiles");

		// Parameters: layer name (or index) from Tiled, tileset, x, y
		this.belowLayer = map.createStaticLayer("BackgroundDecorator", tileset, 0, 0);
		this.worldLayer = map.createStaticLayer("Collision", tileset, 0, 0);
		this.aboveLayer = map.createStaticLayer("ForegroundDecorator", tileset, 0, 0);

		//property is set internal to the Tiled tilemap (In Tiled, Edit Tileset, Set Custom Properties).
		this.worldLayer.setCollisionByProperty({ collides: true });

		// By default, everything gets depth sorted on the screen in the order we created things. Here, we
		// want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
		// Higher depths will sit on top of lower depth objects.
		this.belowLayer.setDepth(0);
		this.worldLayer.setDepth(2);
		this.aboveLayer.setDepth(3);

		// Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
		// Note: instead of storing the player in a global variable, it's stored as a property of the
		// scene.
		const spawnPoint = map.findObject(
			"Objects",
			obj => obj.name === "Spawn Point"
		);

		this.player = new Player(this, spawnPoint.x, spawnPoint.y);

		//get a list of all Objects from the Objects Layer of our Tiled map(s) 
		var tileMapObjects = map.objects[0].objects;
		this.gems = [];

		this.enemyManager = new EnemyManager(this);

		// Setup all objects from our tilemap for the current level
		var tempEnemy;
		for (var i = 0; i < tileMapObjects.length; i++) {
			if (tileMapObjects[i].name == "Gem") {
				this.gems.push(new Gem(this, 
					tileMapObjects[i].x + tileMapObjects[i].width/2, 
					tileMapObjects[i].y - tileMapObjects[i].height/2));
				this.physics.world.addOverlap(this.gems[this.gems.length-1].sprite,
					this.player.sprite, this.hitCollectable, null, this);
			} else if (tileMapObjects[i].name == "Enemy") {
				tempEnemy = new FrogEnemy(this, 
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"enemy"+i);
				this.physics.world.addCollider(tempEnemy.sprite, this.worldLayer);
				this.enemyManager.add(tempEnemy);
			}
		}

		//check that we haven't already set these stats
		this.sys.game.hp = (this.sys.game.hp == undefined) ? 1 : this.sys.game.hp;
		this.sys.game.gems = (this.sys.game.gems == undefined) ? 0 : this.sys.game.gems;
		this.sys.game.lives = (this.sys.game.lives == undefined) ? 5 : this.sys.game.lives;

		// Watch the player and worldLayer for collisions, for the duration of the scene:
		this.physics.world.addCollider(this.player.sprite, this.worldLayer);

		// Phaser supports multiple cameras, but you can access the default camera like this:
		this.cameras.main.startFollow(this.player.sprite);
		// Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		// Help text that has a "fixed" position on the screen
		this.tipText = this.add
			.text(width * 0.05, height * 0.1, 'Arrow keys to move\nPress D to show hitboxes\nPress ESC to show in-game menu.\nPress C to hide tips', {
				font: "18px monospace",
				fill: "#ffffff",
				padding: { x: 20, y: 10 },
				backgroundColor: "#000000"
			})
			.setScrollFactor(0);

		this.input.keyboard.on("keydown_ESC", event => {
			console.log("Launching in_game_menu...");
			this.scene.launch("in_game_menu", { sceneName: "level"+this.currentLevel});
		});

		// Debug graphics
		this.input.keyboard.once("keydown_D", event => {

			// Turn on physics debugging to show player's hitbox
			this.physics.world.createDebugGraphic();

			// Create worldLayer collision graphic above the player, but below the help text
			const graphics = this.add
				.graphics()
				.setAlpha(0.75)
				.setDepth(20);
			this.worldLayer.renderDebug(graphics, {
				tileColor: null, // Color of non-colliding tiles
				collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
				faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
			});
		});

		this.input.keyboard.once("keydown_C", event => {
			//this.tipText.setText("");
		});

		this.inGame = true;

		//start hud-overlay
		//we control our hud as a standalone scene and simply draw it overtop of the platformer scene,
		//this seems to be the easiest way to abstract out the hud and not clutter up
		//the platformer scene	  
		console.log("Launching HudOverlayScene...");
		this.scene.launch("hud_overlay", { sceneName: "level"+this.currentLevel});
	}

	update(time, delta) {
		// Allow the player to respond to key presses and move itself
		if (this.inGame === true) {

			this.player.update();
			this.enemyManager.update();

			//update all gems in scene, we iterate backwards so we can do
			//live removal from array (this.gems)
			var i;
			for (i = this.gems.length-1; i >= 0; i--) {
				if (this.gems[i].sprite.name === "collected") {
					console.log("Destroying gem");
					this.gems[i].destroy();

					//remove the gem from the array, its been collected/destroyed
					this.gems.splice(i,1);
				}
			}

			if (this.player.sprite.y > this.worldLayer.height) {

				//remove hud overlay
				this.scene.stop('hud_overlay');
				this.player.die(this);

				if (this.sys.game.lives > 0) {
					this.scene.start("level"+this.currentLevel);
				} else {
					this.scene.start('game_over');
				}
			}
		}
	}
}
