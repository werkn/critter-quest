/**
 * A class that wraps up our frog-boss-enemy logic.
 */
export default class FrogBossEnemy {

	constructor(scene, x, y, name, scale=3, health=3) {
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

		//DEATH ANIMATION
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
			.setMaxVelocity(1000, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!

		//listen for animation complete callback on enemy death animation,
		//as soon as the animation completes kill the enemy and allow it to be 
		//removed from EnemyManager
		this.sprite.on('animationcomplete', function (animation, frame) {
		    if (animation.key == "enemy-die") {
				if (this.health <= 0) {
					this.dead = true;
				} else {
					//re-enable collider
					this.sprite.body.setEnable(true);
					this.sprite.state = "normal";
					
					//respawn in random location
					var { width, height } = this.scene.sys.game.config;
					var xSpawn = Math.floor(Math.random() * Math.floor(width));
					this.sprite.x = xSpawn;
//					this.sprite.y = xSpawn;

					//reduce size and increase speed
					this.sprite.scaleX-=0.5;
					this.sprite.scaleY-=0.5;
				}
			}
		}, this);

		//frog jump timer
		this.jumpTimer = scene.time.addEvent({
			delay:1750,                // ms
			callback: this.jump,
			//args: [],
			callbackScope: this,
			loop: true
		});

		this.health = health;
		this.sprite.name = name;
		this.sprite.state = "normal";
		this.sprite.setScale(scale);
		//this.sprite.setTint(0x330000);
		this.dead = false;
	}

	hit() {
		this.sprite.anims.play("enemy-die", true);
//		if (!this.enemySpawned) {
//			for (var i = 0; i < this.count; i++) {
//				var { width, height } = this.scene.sys.game.config;
//				var xSpawn = Math.floor(Math.random() * Math.floor(width));
//				var tempEnemy = new FrogBossEnemy(
//					this.scene,
//					xSpawn,
//					125, 
//					"clone",
//					2);
//
//				this.scene.enemyManager.add(tempEnemy);
//				this.scene.physics.world.addCollider(tempEnemy.sprite, this.scene.worldLayer);
//			}
//			this.enemySpawned = true;
		    this.health--;
		    this.sprite.state = "handling-hit";
//		}
	}

	jump() {
		const onGround = this.sprite.body.blocked.down;
		if (onGround) {
			this.scene.physics.moveTo(this.sprite, this.sprite.x - 500, this.sprite.y - 500, 100, 1000);
		}
	}

	update() {
		if (this.sprite.state == "normal") {
			const sprite = this.sprite;
			const onGround = sprite.body.blocked.down;
			const acceleration = onGround ? 600 : 300;

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
		} else if (this.sprite.state == "dying") {
			this.hit();
		}
	}

	destroy() {
		this.sprite.destroy();
		this.jumpTimer.remove();
	}
}
