/* states/menu.js */


const MENU = new Gui();

states['menu'] = {
	create: () => {
		let st = state => game.state.start(state);
		MENU.add_btn(()=>{ st('ready'); }, 'Start game', TXT_STL.BTN);
		//MENU.add_btn(()=>{ st('settings'); }, 'Settings', TXT_STL.BTN);
		MENU.add_btn(()=>{ st('records'); }, 'Records', TXT_STL.BTN);		
	},
	update: () => {
		MENU.btn_choose();
	},

	shutdown: () => {
		LAST_GAME_STATE = 'menu';
		MENU.clear();
	}
}
