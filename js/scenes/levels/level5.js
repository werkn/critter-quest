import PlatformerScene from "../platformer-scene.js";

/**
 * A class that extends from PlatformerScene and implements a level.  We need to overload preload
 * and the constructor to load different levels.  I attemtped to do everything via a level loading script
 * solely in platform but due to the way Phaser3 works I don't seem to be able to load multiple tilemaps
 * within the same scene.  This is a workaround.
 */
export default class Level5 extends PlatformerScene {

  constructor(config) {
      super({ key: 'level5' });
      super.currentLevel = 5;
  }
}
