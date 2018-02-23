/* states/ctrls.js */

const CTRLS_GUI = {
	BTNS: []
};

states['ctrls'] = {
	create: () => {
		SETTINGS_GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('settings');
		}, 'Назад', BTN_STYLE, 500));
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ctrls';
	}
}
