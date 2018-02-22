/* states/ready.js */

const READY_GUI = {
	BTNS: []
};

states['ready'] = {
	create: () => {
		READY_GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('game');
			game.paused = false;
		}, 'Начать игру', BTN_STYLE, 100));
	},
	update: () => {
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ready';
	}
};
