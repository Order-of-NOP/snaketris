/* states/ctrls.js */

const CTRLS = {
	GUI : {
		BTNS: [],
		LBL: []
	}
};

states['ctrls'] = {
	create: () => {
		// back button
		CTRLS.GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('settings');
		}, 'back', TXT_STL.BTN, 0));
		CTRLS.GUI.BTNS[0].back();

		// labels
		//LBL.push( game.add.text(0, 0, ""))
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ctrls';
		clear_gui(CTRLS.GUI);
	}
}
