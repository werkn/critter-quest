/**
 * A class that wraps up our frog-enemy logic.
 */
export default class EagleEnemy {

	constructor(scene, x, y, name) {
		this.scene = scene;

		// Create the enemy's idle animations from the texture atlas. These are stored in the global
		// animation manager so any sprite can access them.
		const anims = scene.anims;
		//FROG IDLE ANIMATION
		anims.create({
			key: "eagle-idle",
			frames: anims.generateFrameNames("atlas", {
				prefix: "eagle-attack-",
				suffix: '.png',
				start: 1,
				end: 4
			}),
			frameRate: 10,
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
			.sprite(x, y, "atlas", "eagle-attack-1.png")
			.setDrag(1000, 0)
			.setMaxVelocity(300, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!
		this.sprite.body.setAllowGravity(false);	
			

		//listen for animation complete callback on enemy death animation,
		//as soon as the animation completes kill the enemy and allow it to be 
		//removed from EnemyManager
		this.sprite.on('animationcomplete', function (animation, frame) {
			console.log(this);
			console.log(animation);
		    if (animation.key == "enemy-die") {
				this.dead = true;
			}
		}, this);

		//we use this.sprite.name to check if the class FrogEnemy has been killed
		//when it changes to 'dead' we know the enemy has been killed
		//and can be removed from the scene
		//
		//~~~Why not just set a field on the FrogEnemy class? ~~~ 
		//Phaser3 as far as I can tell attaches our physics collider to the 
		//sprite object and offers no nice built-in way to go from
		//the sprite collider (provided in collision callbacks) to the
		//class it is associated with... this essentially means when we use ANY
		//of the physics callbacks that we cannot get a reference to the class of the
		//sprite involved in the collision and subsequently have no nice way to call methods
		//in response.  By change this.sprite.name we can loop through a collection of FrogEnemy
		//class instances, and check this.sprite.name to call methods.  This is how we handle 
		//it in PlatformerScene.  Hacky, less then ideal technique but Phaser3 documentation and
		//examples don't really show a nicer way to do this.
		this.sprite.name = name;
		this.sprite.state = "normal";
		this.direction = -1;
		this.dead = false;

		this.canCollideWithWidget = true;
	}

	die() {
		this.sprite.anims.play("enemy-die", true);
	}

	update() {
		if (this.sprite.state != "dying") {
			const sprite = this.sprite;

			this.sprite.x += (1*this.direction);

			if (this.canCollideWithWidget && this.sprite.state == "flip_direction") {
				sprite.flipX = !sprite.flipX;
				this.direction *= -1;
				this.canCollideWithWidget = false;
	    		this.scene.time.delayedCall(1500, function() { 
					this.sprite.state = "normal";
					this.canCollideWithWidget = true; 
				}, null, this);
			}
			sprite.anims.play("eagle-idle", true);
			
		} else {
			this.die();
		}
	}

	destroy() {
		this.sprite.destroy();
	}
}
