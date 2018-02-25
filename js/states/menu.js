/* states/menu.js */


const MENU = new Gui();

states['menu'] = {
	create: () => {
		MENU.add_btn(
			()=>{ game.state.start('ready'); }, 'Start game', TXT_STL.BTN);

		MENU.add_btn(
			()=>{ game.state.start('settings'); }, 'Settings', TXT_STL.BTN);
		
		MENU.add_btn(
			()=>{ game.state.start('records'); }, 'Records', TXT_STL.BTN);	
		
		MENU.add_btn(
			()=>{ game.state.start('gameover'); }, 'Game over', TXT_STL.BTN);	
	
	},
	update: () => {
		MENU.btn_choose();
	},

	shutdown: () => {
		LAST_GAME_STATE = 'menu';
		MENU.clear();
	}
}
