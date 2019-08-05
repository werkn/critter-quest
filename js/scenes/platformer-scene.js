import Player from "../units/player.js";
import SpringBoard from "../physicsObjects/springBoard.js";

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
    // "this" === Phaser.Scene
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

  hitCollectable(sprite, tile) {
    this.collectableLayer.removeTileAt(tile.x, tile.y);
    this.sys.game.soundManager.sfx.coinCollected.play();
    //update player gem count
    this.sys.game.gems += 1;	  
    console.log("Collected tile id: " + tile.index);

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
    this.collectableLayer = map.createDynamicLayer('Collectables', tileset, 0, 0);

    //property is set internal to the Tiled tilemap (In Tiled, Edit Tileset, Set Custom Properties).
    this.collectableLayer.setCollisionByProperty({ collides: true });
    this.worldLayer.setCollisionByProperty({ collides: true });

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    this.aboveLayer.setDepth(10);

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
    // Note: instead of storing the player in a global variable, it's stored as a property of the
    // scene.
    const spawnPoint = map.findObject(
      "Objects",
      obj => obj.name === "Spawn Point"
    );

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    //check that we haven't already set these stats
    this.sys.game.hp = (this.sys.game.hp == undefined) ? 1 : this.sys.game.hp;
    this.sys.game.gems = (this.sys.game.gems == undefined) ? 0 : this.sys.game.gems;
    this.sys.game.lives = (this.sys.game.lives == undefined) ? 5 : this.sys.game.lives;

    /**TODO: REMOVE WHEN DONE */
    this.collidableTest = new SpringBoard(this, spawnPoint.x + 400, spawnPoint.y - 100);

    this.physics.world.addOverlap(this.collidableTest.sprite,
      this.player.sprite, this.player.jumpSpringBoard, null, this);

    this.physics.world.addCollider(this.collidableTest.sprite, this.worldLayer);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.world.addCollider(this.player.sprite, this.worldLayer);
    this.physics.world.addOverlap(this.player.sprite, this.collectableLayer);

    // This will set Tile ID 262 (the coin tile) to call the function "hitCoin" when collided with
    this.collectableLayer.setTileIndexCallback(262, this.hitCollectable, this);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    this.cameras.main.startFollow(this.player.sprite);
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes\nPress ESC to show in-game menu.', {
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

      //collidable test
      this.collidableTest.update();

      if (this.player.sprite.y > this.worldLayer.height) {
	this.player.die(this);
        this.scene.start('game_over');
      }
    }
  }
}
