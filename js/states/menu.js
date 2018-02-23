/* states/menu.js */

let menu_btn_ind = 0;

const MENU = {
	GUI: {
		BTNS: [],
		LBLS: []
	},
	STATES: []
};


states['menu'] = {
	create: () => {
		MENU.GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('ready');
		}, 'Start game', TXT_STL.BTN, 100));
		MENU.STATES.push('ready');

		MENU.GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('settings');
		}, 'Settings', TXT_STL.BTN, 160));
		MENU.STATES.push('settings');

		MENU.GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('records');
		}, 'Records', TXT_STL.BTN, 220));
		MENU.STATES.push('records');
	},

	update: () => {
		for(let i = 0; i < input.p.length; i++) {
			let ip = input.p[i];
			if (ip['down'].justReleased){
				MENU.GUI.BTNS[menu_btn_ind].choose(1);
				menu_btn_ind = MOD(menu_btn_ind, 1, MENU.GUI.BTNS.length);
				MENU.GUI.BTNS[menu_btn_ind].choose(0);
			} else 
			if (ip['up'].justReleased){
				MENU.GUI.BTNS[menu_btn_ind].choose(1);
				menu_btn_ind = MOD(menu_btn_ind, -1, MENU.GUI.BTNS.length);
				MENU.GUI.BTNS[menu_btn_ind].choose(0);
			} else
			if (ip['right'].justReleased) {
				MENU.GUI.BTNS[menu_btn_ind].choose(2);
				game.state.start(MENU.STATES[menu_btn_ind]);
			}
		}
	},

	shutdown: () => {
		LAST_GAME_STATE = 'menu';
		MENU.STATES = [];
		clear_gui(MENU.GUI);
	}
}
