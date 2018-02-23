/* states/menu.js */

const MENU_GUI = {
	BTNS: []
};

states['menu'] = {
	create: () => {

		MENU_GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('ready');
		}, 'Начать игру', TXT_STL.BTN, 100));

		MENU_GUI.BTNS.push(new ButtonLabel(()=>{
			game.state.start('ready');
		}, 'Ещё пункт меню', TXT_STL.BTN, 140));
	},
	shutdown: () => {
		LAST_GAME_STATE = 'menu';
	}
}
