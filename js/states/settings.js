/* states/settings.js */

const SETTINGS_GUI = {
	BTNS: []
};

states['settings'] = {
	create: () => {
		SETTINGS_GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('ctrls');
		}, 'Управление', BTN_STYLE, 100));
	},
	shutdown: () => {
		LAST_GAME_STATE = 'settings';
	}
};
