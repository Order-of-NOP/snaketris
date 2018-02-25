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
		CTRLS.GUI.LBL.push( game.add.text(10, 10, "SNAKE", TXT_STL.LBL_TTL));
		CTRLS.GUI.LBL.push( game.add.text(340, 10, "TETRIS", TXT_STL.LBL_TTL));
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ctrls';
		clear_gui(CTRLS.GUI);
	}
}
