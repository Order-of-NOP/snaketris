/* states/preload.js */

states['preload'] = {
	preload: () => {
		game.load.spritesheet('sheet', 'img/sheet.png',
			TILE_SIZE, TILE_SIZE);
		game.load.image('background', 'img/bg.png');
	},
	create: () => {
		// wanna do something useful on right click
		document.querySelector('canvas').oncontextmenu
			= function() { return false; };
		input = new Input();
		PAUSE.SWITCH_KEY = new Key(game.input.keyboard, Phaser.Keyboard.ESC);
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.stage.backgroundColor = '#120b92';
		//game.state.start('menu');
		game.state.start('game');
	},
	shutdown: () => {
		LAST_GAME_STATE = 'preload';
	}
};
