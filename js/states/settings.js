/* states/settings.js */

let settings_btn_ind = 0;

const SETTINGS = {
	GUI: {
		BTNS: [],
		LBL: []
	},
	CALLBACKS: []
};

states['settings'] = {
	create: () => {
		// init callbacks
		SETTINGS.CALLBACKS.push(()=>{
			CONFIG.FULL_SCREEN_MODE = !CONFIG.FULL_SCREEN_MODE;
			SETTINGS.GUI.LBL[0].text = CONFIG.FULL_SCREEN_MODE ? 'ON' : 'OFF';
		});

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
		for(let i = 0; i < input.p.length; i++) {
			let ip = input.p[i];
			if (ip['down'].justReleased){
				SETTINGS.GUI.BTNS[settings_btn_ind].choose(1);
				settings_btn_ind = MOD(settings_btn_ind, 1, SETTINGS.GUI.BTNS.length);
				SETTINGS.GUI.BTNS[settings_btn_ind].choose(0);
			} else 
			if (ip['up'].justReleased){
				SETTINGS.GUI.BTNS[settings_btn_ind].choose(1);
				settings_btn_ind = MOD(settings_btn_ind, -1, SETTINGS.GUI.BTNS.length);
				SETTINGS.GUI.BTNS[settings_btn_ind].choose(0);
			} else
			if (ip['right'].justReleased) {
				SETTINGS.GUI.BTNS[settings_btn_ind].choose(0);
				SETTINGS.CALLBACKS[settings_btn_ind]();
			}
		}
	},
	shutdown: () => {
		LAST_GAME_STATE = 'settings';
		SETTINGS.STATES = [];
		clear_gui(SETTINGS.GUI);
	}
};
