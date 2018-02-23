/* state/gameover.js */

states['gameover'] = {
	create: () => {
		// TODO goto menu, ready
	},
	shutdown: () => {
		LAST_GAME_STATE = 'gameover';
	}
};
