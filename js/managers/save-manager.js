export default class SaveManager {

	static saveGame(levelState) {
		localStorage.setItem('save', JSON.stringify(levelState));
		console.log("Game progress saved.");
	}

	static loadGame(scene) {
		const levelState = JSON.parse(localStorage.getItem('save'));
		scene.sys.game.levelState = levelState;
		console.log("Game progress loaded.");
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

