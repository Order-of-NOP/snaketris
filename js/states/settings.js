/* states/settings.js */

let settings_btn_ind = 0;

const SETTINGS = new Gui();

states['settings'] = {
	create: () => {
		SETTINGS.add_btn(
			()=>{
				CONFIG.FULL_SCREEN_MODE = !CONFIG.FULL_SCREEN_MODE;
				SETTINGS.GUI.LBL[0].text = CONFIG.FULL_SCREEN_MODE ? 'ON' : 'OFF';
			}, 'Full screen mode', TXT_STL.BTN);

		// init callbacks
		SETTINGS.CALLBACKS.push();

		SETTINGS.CALLBACKS.push(()=>{ game.state.start('ctrls'); });

		SETTINGS.CALLBACKS.push(()=>{ game.state.start(LAST_GAME_STATE); });

		// states button
		SETTINGS.GUI.BTNS.push(new ButtonLabel(
			SETTINGS.CALLBACKS[0], 'Full screen mode:', TXT_STL.BTN, 100 ));

		SETTINGS.GUI.BTNS.push(new ButtonLabel(
			SETTINGS.CALLBACKS[1], 'controls', TXT_STL.BTN, 200));

		SETTINGS.GUI.BTNS.push(new ButtonLabel(
			SETTINGS.CALLBACKS[2], 'back', TXT_STL.BTN, 0 ));
		SETTINGS.GUI.BTNS[2].back();

		// label
		SETTINGS.GUI.LBL.push( 
			game.add.text(game.world.centerX + 160, 105, 'OFF', TXT_STL.BTN));

	},
	update: () => {
		SETTINGS.btn_choose();
	},
	shutdown: () => {
		LAST_GAME_STATE = 'settings';
		SETTINGS.STATES = [];
		clear_gui(SETTINGS.GUI);
	}
};
