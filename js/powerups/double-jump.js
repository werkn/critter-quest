export default class DoubleJumpPowerup {
	constructor(scene, x, y) {
		this.scene = scene;

		const anims = scene.anims;

		//ANIMATION
		anims.create({
			key: "cherry-idle",
			frames: anims.generateFrameNames("atlas", {
				prefix: "cherry-",
				suffix: '.png',
				start: 1,
				end: 7
			}),
			frameRate: 3,
			repeat: -1
		});

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "atlas", "cherry-1.png")
			.setDrag(1000, 0)
			.setMaxVelocity(0, 0);

		this.sprite.anims.play("cherry-idle", true);
		this.sprite.body.debugBodyColor = this.sprite.body.touching.none ? 0x0099ff : 0xff9900;
		this.sprite.name = "double-jump-powerup";
	}

	update() {}

	destroy() {
		this.sprite.destroy();
	}

}

