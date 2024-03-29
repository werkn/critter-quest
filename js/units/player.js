/**
 * User: werkn-development
 * Date: Fri Aug 23 12:53:00 MST 2019
 *
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

		//PLAYER DEATH ANIMATION
		anims.create({
			key: "player-die",
			frames: anims.generateFrameNames("atlas", {
				prefix: "hurt/player-hurt-",
				suffix: '.png',
				start: 1,
				end: 2
			}),
			frameRate: 10,
			repeat: -1
		});

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "atlas", "idle/player-idle-1.png")
			.setDrag(1000, 0)
			.setMaxVelocity(300, 1000);   //max horiz. speed as well as max jump height

		//we need to capture the original normal body because we modify it
		//when crouching the player (so they can move into smaller spaces)
		this.normalBody = { 
			//keep width at least 2 px larger then tile (stops player from sneaking through gaps)
			"width": 18,
			"height": this.sprite.body.height,
			"useGameObjectCenter":true,  //this is true by default
			"offsetX": this.sprite.body.offset.x,
			"offsetY": this.sprite.body.offset.y
		}

		this.crouchedBody = {
			"width": this.normalBody.width,
			"height": this.normalBody.height,
			"useGameObjectCenter": false, //we customize our offset when crouching, don't use GameObjects
			"offsetX": this.normalBody.offsetX + this.normalBody.width / 1.5,
			"offsetY": this.normalBody.offsetY + this.normalBody.height / 2,
		}

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

		this.sprite.name = "player";
		this.sprite.state = "normal";
	}

	update() {

		if (this.sprite.state == "normal") {
			const sprite = this.sprite;
			const onGround = sprite.body.blocked.down;
			const acceleration = onGround ? 600 : 300;


			// Apply horizontal acceleration when left/a or right/d are applied
			if (this.keys.left.isDown || this.keys.a.isDown) {
				sprite.setAccelerationX(-acceleration);
				// No need to have a separate set of graphics for running to the left & to the right. Instead
				// we can just mirror the sprite.
				sprite.setFlipX(true);
			} else if (this.keys.right.isDown || this.keys.d.isDown) {
				sprite.setAccelerationX(acceleration);
				sprite.setFlipX(false);
			} else {
				sprite.setAccelerationX(0);
			}

			// Only allow the player to jump if they are on the ground
			if (onGround && (this.keys.up.isDown || this.keys.w.isDown)) {
				sprite.setVelocityY(-500);
				this.scene.sys.game.soundManager.sfx.jump.play();
			}

			// Update the animation/texture based on the state of the player
			if (onGround) {

				if (this.keys.down.isDown || this.keys.s.isDown) { 
					sprite.anims.play("player-crouch", true);
					sprite.body.setSize(this.crouchedBody.width, 
						this.crouchedBody.height/2, 
						false); //false indicates we do not want to center on GameObject (owner of this body)
					sprite.setOffset(this.crouchedBody.offsetX, this.crouchedBody.offsetY);
				} else if (sprite.body.velocity.x !== 0) {
					sprite.body.setSize(this.normalBody.width, 
						this.normalBody.height, 
						true);
					sprite.anims.play("player-run", true);
				} else {
					sprite.anims.play("player-idle", true);
					sprite.body.setSize(this.normalBody.width, 
						this.normalBody.height, 
						true);
				}

			} else {
				sprite.anims.stop();
				//start of jump is one sprite, once @ apex of jump switch to falling sprite.
				if (sprite.body.velocity.y < 0) {
					sprite.setTexture("atlas", "jump/player-jump-1.png");
				} else {
					sprite.setTexture("atlas", "jump/player-jump-2.png");
				}
			}
		} else if (this.sprite.state == "dying") {
			this.die();
		} 
	}

	die() {
		//disable player body so we don't participate in collisions
		this.sprite.anims.play("player-die", true);
		this.sprite.body.stop();
		this.sprite.body.setVelocityY(-500);
		this.sprite.state = "death_animation";
		//wait 1 second before totally killing player (allows animation to run)
		this.scene.time.delayedCall(850, function() { 
			this.sprite.state = "dead"; 
		}, null, this);

		//remove collisions (note: if we manually handle collisions in update() or 
		//another class we need to also check in that class whether collision has
		//been disabled.  For instance, refer to update() in EnemyManager
		this.sprite.body.checkCollision.up= false;
		this.sprite.body.checkCollision.down = false;
		this.sprite.body.checkCollision.left= false;
		this.sprite.body.checkCollision.right = false;
	}

	destroy() {
		this.sprite.destroy();
	}
}
