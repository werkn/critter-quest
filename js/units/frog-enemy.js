/**
 * A class that wraps up our frog-enemy logic.
 */
export default class FrogEnemy {

  constructor(scene, x, y) {
    this.scene = scene;

    // Create the enemy's idle animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = scene.anims;
    //FROG IDLE ANIMATION
    anims.create({
      key: "frog-idle",
      frames: anims.generateFrameNames("atlas", {
        prefix: "idle/frog-idle-",
        suffix: '.png',
        start: 1,
        end: 4
      }),
      frameRate: 3,
      repeat: -1
    });

    //FROG DEATH ANIMATION
    anims.create({
      key: "enemy-die",
      frames: anims.generateFrameNames("atlas", {
        prefix: "enemy-death-",
        suffix: '.png',
        start: 1,
        end: 6
      }),
      frameRate: 10,
      repeat: 0 
    });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "atlas", "idle/frog-idle-1.png")
      .setDrag(1000, 0)
      .setMaxVelocity(300, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!

    // Frog jump timer
    this.jumpTimer = scene.time.addEvent({
	        delay:2750,                // ms
	        callback: this.jump,
	        //args: [],
	        callbackScope: this,
	        loop: true
     });

	this.dead = false;
  }

  die() {
    this.dead = true;
    this.sprite.anims.play("enemy-die", true);
    //TODO: Add more complex death logic when adding EnemyManager
  }

  jump() {
    const onGround = this.sprite.body.blocked.down;
    if (onGround) {
      this.sprite.setVelocityY(-500);
    }
  }

  update() {
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const acceleration = onGround ? 600 : 300;
    if (!this.dead) {
      if (onGround) {
        sprite.anims.play("frog-idle", true);
      } else {
        //start of jump is one sprite, once @ apex of jump switch to falling sprite.
        if (sprite.body.velocity.y < 0) {
          sprite.setTexture("atlas", "jump/frog-jump-1.png");
        } else {
          sprite.setTexture("atlas", "jump/frog-jump-2.png");
        }
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
