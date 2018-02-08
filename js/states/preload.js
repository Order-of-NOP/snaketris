/* states/preload.js */

states['preload'] = {
	preload: () => {
		game.load.spritesheet('sheet', '../img/sheet.png',
			TILE_SIZE, TILE_SIZE);
	},
	create: () => {
		game.state.start('menu');
	}
};
