/* states/menu.js */

const MENU = new Gui();

states['menu'] = {
	init: () => {
		bg_sprite = game.add.tileSprite(0, 0,
			game.cache.getImage('background').width,
			game.cache.getImage('background').height, 'background');
		game.add.sprite(100, 100, 'logo');
	},
	create: () => {
		let st = state => game.state.start(state);
		MENU.__Y0 = 300;
		MENU.add_btn(()=>{ st('ready'); }, 'Start game',TXT_STL.BTN);
		MENU.add_btn(()=>{ st('settings'); }, 'Settings',TXT_STL.BTN);
		MENU.add_btn(()=>{ st('records'); }, 'High scores',TXT_STL.BTN);
		_.each(MENU.GUI.BTNS, (e)=>{e.set_x(100);});
		add_fullscreen();
	},
	update: () => {
		MENU.btn_choose();
	},

	shutdown: () => {
		LAST_GAME_STATE = 'menu';
		MENU.clear();
	}
}
