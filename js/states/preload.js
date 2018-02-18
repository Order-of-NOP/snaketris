/* states/preload.js */

states['preload'] = {
	preload: () => {
		game.load.spritesheet('sheet', 'img/sheet.png',
			TILE_SIZE, TILE_SIZE);
	},
	create: () => {
		// wanna do something useful on right click
		document.querySelector('canvas').oncontextmenu
			= function() { return false; };
		input = new Input();
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.stage.backgroundColor = '#1f6b75';
		//game.state.start('menu');
		game.state.start('game');
	}
};
