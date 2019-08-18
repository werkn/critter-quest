import Player from "../units/player.js";
import FrogEnemy from "../units/frog-enemy.js";
import EagleEnemy from "../units/eagle-enemy.js";
import OpossumEnemy from "../units/opossum-enemy.js";
import FrogBossEnemy from "../units/bosses/frog-boss-enemy.js";
import SpringBoard from "../physicsObjects/springBoard.js";
import Gem from "../collectables/gem.js";
import EnemyManager from "../managers/enemy-manager.js";
import Exit from "../objects/exit.js";
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
		this.load.image("middleground-repeat", "./assets/tilesets/environment/middle.png");
		//load tileset image
		this.load.image("tiles", "./assets/tilesets/environment/tileset.png");
		this.load.image("props", "./assets/tilesets/environment/props.png");
		this.load.image("widgets", "./assets/tilesets/widgets/widgets.png");

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
		
		//max time before player is killed (in seconds)
		this.sys.game.maxLevelTime = 180;

		//setup tilemap
		const map = this.make.tilemap({ key: "map"+this.currentLevel });

		// Creating a repeating background sprite
		const bg = this.add.tileSprite(0, 0, map.widthInPixels, height/2, "background-repeat");
		bg.setOrigin(0, 0);
		const mg = this.add.tileSprite(0, height/4, map.widthInPixels, height/2, "middleground-repeat");
		mg.setOrigin(0, 0);

		// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
		// Phaser's cache (i.e. the name you used in preload)
		var tileset = [];
		tileset.push(map.addTilesetImage("tileset", "tiles"));
		tileset.push(map.addTilesetImage("props", "props"));
		tileset.push(map.addTilesetImage("widgets", "widgets"));

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
		// scene	var logTiles = map..
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
			} else if (tileMapObjects[i].name == "FrogBossEnemy") {
				tempEnemy = new FrogBossEnemy(this, 
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"frog_boss_"+i,
					2, 
				    3);
				this.physics.world.addCollider(tempEnemy.sprite, this.worldLayer);
				this.enemyManager.add(tempEnemy);
			} else if (tileMapObjects[i].name == "EagleEnemy") {
				tempEnemy = new EagleEnemy(this, 
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"eagle_"+i);
				this.physics.world.addCollider(tempEnemy.sprite, this.worldLayer);
				this.enemyManager.add(tempEnemy);
			} else if (tileMapObjects[i].name == "OpossumEnemy") {
				tempEnemy = new OpossumEnemy(this, 
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"opossum_"+i);
				this.physics.world.addCollider(tempEnemy.sprite, this.worldLayer);
				this.enemyManager.add(tempEnemy);
			} else if (tileMapObjects[i].name == "FrogEnemy") {
				tempEnemy = new FrogEnemy(this, 
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"frog_"+i);
				this.physics.world.addCollider(tempEnemy.sprite, this.worldLayer);
				this.enemyManager.add(tempEnemy);
			} else if (tileMapObjects[i].name == "Exit") {

				this.levelExit = new Exit(this,
					tileMapObjects[i].x, 
					tileMapObjects[i].y, 
					"exit"+i);
				this.physics.world.addCollider(this.levelExit.sprite, this.worldLayer);
			}
		}

		//turn all tiles with custom property collide_top_only 
		//(Set in Tiled editor for Tileset) into collision top only
		//allowing the player to jump through these tiles 
		this.tileIdsWithCollideDmg = [];
		this.worldLayer.layer.data.forEach((row) => { // here we are iterating through each tile.
			row.forEach((Tile) => {
				if (Tile.properties.collide_top_only) { 
						Tile.collideDown = false;
						Tile.collideLeft = false;
						Tile.collideRight = false;
				} 
				
				if (Tile.properties.collide_dmg) {
					// This will add Tile ID XX to list tileIdsWithCollideDmg
					// where we will then call:
					//     this.collectableLayer.setTileIndexCallback(tileIdsWithCollideDmg[i], 
					//         this.methodToCall(), this);
					if (this.tileIdsWithCollideDmg.indexOf(Tile.index) == -1) {
						this.tileIdsWithCollideDmg.push(Tile.index);
					}
				} 
				
				if (Tile.properties.widget) {
					//Tile.setVisible(false);
					//make a callback to detect when enemy hit the widget tile
					Tile.setCollisionCallback(function(collidingSprite, tile) { 
						if (collidingSprite.name != "player" &&
								collidingSprite.state == "normal") {
							collidingSprite.state = "flip_direction";
						}
					}, this);
				}
			})
		});

		//add callbacks for each tile.id in tileIdsWithCollideDmg
		this.worldLayer.setTileIndexCallback(this.tileIdsWithCollideDmg, function(collidingSprite, tile) { 
			//for now try to kill whatever touches a tile with 'collide_dmg'
			//this is hacky, but should only kill enemies and the player,
			//ie: GameObjects that watch for state 'dying'
			collidingSprite.state = "dying";
		}, this); 

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
		if (this.currentLevel == 1) {
			this.tipText = this.add
				.text(width * 0.15, height * 0.1, 'Arrow keys to move\nPress D to show hitboxes\nPress ESC to show in-game menu.\nPress C to hide tips', {
					font: "18px monospace",
					fill: "#ffffff",
					padding: { x: 20, y: 10 },
					backgroundColor: "#000000"
				})
				.setScrollFactor(1);
		}

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
		
		
		this.sys.game.gameTimer = this.time.addEvent({
			delay: this.sys.game.maxLevelTime * 1000,                // 3 min 
			callback: function() { this.player.sprite.state = "dying"; },
			callbackScope: this,
			loop: false,
			repeat: 0,
			startAt: 0,
			timeScale: 1,
			paused: false
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
			this.levelExit.update();

			//check if player has made it to the exit yet
			if (this.levelExit.sprite.state == "exit_touched") {
				this.scene.stop("hud_overlay");
				this.scene.start("level" + ++this.currentLevel)
			}

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

			if (this.player.sprite.y > this.worldLayer.height || this.player.sprite.state == "dead") {

				//remove hud overlay
				this.scene.stop('hud_overlay');
				if (--this.sys.game.lives > 0) {
					this.scene.start("level"+this.currentLevel);
				} else {
					this.scene.start('game_over');
				}
			}
		}
	}
}
