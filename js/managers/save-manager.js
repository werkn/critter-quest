/**
 * User: werkn-development
 * Date: Fri Aug 23 13:01:33 MST 2019
 * 
 * SaveManager uses localStorage to save level progress.
 *
 * Currently it does not save any settings from the in-game menu such
 * as audio enabled/disabled.
 */

export default class SaveManager {

	static saveGame(levelState) {
		localStorage.setItem('save', JSON.stringify(levelState));
	}

	static loadGame(scene) {
		const levelState = JSON.parse(localStorage.getItem('save'));
		scene.sys.game.levelState = levelState;
	}

	static hasSavedGame(scene) {
		const levelState = JSON.parse(localStorage.getItem('save'));
		if (levelState != undefined) {
			return true;
		}

		return false;
	}

	static eraseSaveGame() {
		localStorage.removeItem("save");
	}

}

