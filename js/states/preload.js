/* states/preload.js */

states['preload'] = {
	preload: () => {
		game.load.spritesheet('sheet', '../img/sheet.png',
			TILE_SIZE, TILE_SIZE);
	},
	create: () => {
		// wanna do something useful on right click
		document.querySelector('canvas').oncontextmenu
			= function() { return false; };

		grid = new Grid(SIZE.W, SIZE.H);
		input = new Input();

		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.input.onDown.add(() => {
			if (game.scale.isFullScreen) {
				game.scale.stopFullScreen();
			} else {
				game.scale.startFullScreen(false);
			}
		}, this);

		//game.state.start('menu');
		game.state.start('game');
	}
};
