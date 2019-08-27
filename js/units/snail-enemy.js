export default class SnailEnemy {

	constructor(scene, x, y, name) {
		this.scene = scene;

		const anims = scene.anims;
		//IDLE ANIMATION
		anims.create({
			key: "snail-idle",
			frames: anims.generateFrameNames("additional_enemies_atlas", {
				prefix: "slug-",
				suffix: '.png',
				start: 1,
				end: 4
			}),
			frameRate: 1,
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
			.sprite(x, y, "additional_enemies_atlas", "slug-1.png")
			.setImmovable(true);

		//listen for animation complete callback on enemy death animation,
		//as soon as the animation completes kill the enemy and allow it to be 
		//removed from EnemyManager
		this.sprite.on('animationcomplete', function (animation, frame) {
			if (animation.key == "enemy-die") {
				//kill enemy after animation has played
				//this.dead state is checked in EnemyManager
				this.dead = true;
			}
		}, this);

		this.sprite.name = name;
		this.sprite.state = "normal";
		this.dead = false;
		this.sprite.anims.play("snail-idle", true);
	}

	//plays enemy death animation
	die() {
		this.sprite.anims.play("enemy-die", true);
	}

	destroy() {
		this.sprite.destroy();
	}
}
