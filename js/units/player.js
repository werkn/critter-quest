/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {

  constructor(scene, x, y) {
    this.scene = scene;

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = scene.anims;
    //PLAYER RUN ANIMATION
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNames("atlas", {
        prefix: "run/player-run-",
        suffix: '.png',
        start: 1,
        end: 6
      }),
      frameRate: 10,
      repeat: -1
    });

    //PLAYER IDLE ANIMATION
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNames("atlas", {
        prefix: "idle/player-idle-",
        suffix: '.png',
        start: 1,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    });

    //PLAYER CROUCH ANIMATION
    anims.create({
      key: "player-crouch",
      frames: anims.generateFrameNames("atlas", {
        prefix: "crouch/player-crouch-",
        suffix: '.png',
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });


    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "idle/player-idle-1.png", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, DOWN, W, A, S, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      s: S,
      d: D
    });
  }

  /**TODO: REMOVE WHEN DONE */
  jumpSpringBoard(sprite, body) {
    body.setVelocityY(-600);
    //note here that we use
    //this.sys.game... instead of this.scene.sys.game... this
    //method is provided context from the calling scene
    this.sys.game.soundManager.sfx.jump.play();
  }
 
  die(context) {
    context.sys.game.lives -= 1;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const acceleration = onGround ? 600 : 300;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      sprite.setAccelerationX(-acceleration);
      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite.
      sprite.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown) {
      sprite.setAccelerationX(acceleration);
      sprite.setFlipX(false);
    } else {
      sprite.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      sprite.setVelocityY(-500);
      this.scene.sys.game.soundManager.sfx.jump.play();
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (keys.down.isDown || keys.s.isDown) { sprite.anims.play("player-crouch", true); }
      else if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
      else sprite.anims.play("player-idle", true);
    } else {
      sprite.anims.stop();
      //start of jump is one sprite, once @ apex of jump switch to falling sprite.
      if (sprite.body.velocity.y < 0) {
        sprite.setTexture("atlas", "jump/player-jump-1.png");
      } else {
        sprite.setTexture("atlas", "jump/player-jump-2.png");
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
