/* states/settings.js */

let settings_btn_ind = 0;

const SETTINGS = new Gui();
const CFG_TXT = {
	ON_OFF: ['ON', 'OFF'],
	FLL_SCRN_MD: 'Full screen mode: ',
	SND_MT: 'Sound mute: '
};

states['settings'] = {
	create: () => {
		SETTINGS.add_btn(
			()=>{
				// switch global config
				CONFIG.FULL_SCREEN_MODE = !CONFIG.FULL_SCREEN_MODE;
				SETTINGS.GUI.BTNS[0].lbl.text = CFG_TXT.FLL_SCRN_MD;
				SETTINGS.GUI.BTNS[0].lbl.text += 
					CONFIG.FULL_SCREEN_MODE ? CFG_TXT.ON_OFF[0] : CFG_TXT.ON_OFF[1];
			}, CFG_TXT.FLL_SCRN_MD + (CONFIG.FULL_SCREEN_MODE ? CFG_TXT.ON_OFF[0] : CFG_TXT.ON_OFF[1]), TXT_STL.BTN);

		SETTINGS.add_btn(
			()=>{
				// switch global config
				CONFIG.SOUND_MUTE = !CONFIG.SOUND_MUTE;
				SETTINGS.GUI.BTNS[1].lbl.text = CFG_TXT.SND_MT;
				SETTINGS.GUI.BTNS[1].lbl.text += 
					CONFIG.SOUND_MUTE ? CFG_TXT.ON_OFF[0] : CFG_TXT.ON_OFF[1];
			}, CFG_TXT.SND_MT + (CONFIG.SOUND_MUTE ? CFG_TXT.ON_OFF[0] : CFG_TXT.ON_OFF[1]), TXT_STL.BTN);
	
		/*SETTINGS.add_btn(()=>{
			game.state.start('ctrls');
		}, 'Controls', TXT_STL.BTN);*/

		SETTINGS.add_btn(()=>{
			game.state.start(LAST_GAME_STATE);
		}, 'Back', TXT_STL.BTN);

		SETTINGS.GUI.BTNS[SETTINGS.GUI.BTNS.length - 1].back();
	},
	update: () => {
		SETTINGS.btn_choose();
	},
	shutdown: () => {
		LAST_GAME_STATE = 'settings';
		SETTINGS.clear();
	}
};
