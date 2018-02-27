/* states/records.js */

states['records'] = {
	init: () => {
		bg_sprite = game.add.tileSprite(0, 0,
			game.cache.getImage('background').width,
			game.cache.getImage('background').height, 'background');
	},
	create: () => {
	},
	shutdown: () => {
		LAST_GAME_STATE = 'records';
	}
}
