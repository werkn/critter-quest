export default class SpringBoard {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;

        //GEM ANIMATION
        anims.create({
            key: "gem-spin",
            frames: anims.generateFrameNames("atlas", {
                prefix: "gem-",
                suffix: '.png',
                start: 1,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add
            .sprite(x, y, "gem-1.png", 0)
            .setDrag(1000, 0)
            .setMaxVelocity(0, 0);
    }

    update() {
        this.sprite.anims.play("gem-spin", true);
        this.sprite.body.debugBodyColor = this.sprite.body.touching.none ? 0x0099ff : 0xff9900;
    }

    destroy() {
        this.sprite.destroy();
    }
}
