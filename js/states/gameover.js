/* state/gameover.js */

const GAMEOVER = new Gui();

states['gameover'] = {
	create: () => {
		GAMEOVER.add_text(
			game.world.centerX - 100,
			100,
			'Game over',
			TXT_STL.LBL_TTL);
		GAMEOVER.add_text(
			game.world.centerX - 80,
			200,
			'Your score: ' + score,
			TXT_STL.BTN);
		GAMEOVER.__Y0 = 300;// margin top for buttons

		GAMEOVER.add_btn(()=>{
			game.state.start('ready');
		}, 'Again', TXT_STL.BTN);

		GAMEOVER.add_btn(()=>{
			game.state.start('menu');
		}, 'Main menu', TXT_STL.BTN);
		
	},
	update: () => {
		GAMEOVER.btn_choose();
	},
	shutdown: () => {
		LAST_GAME_STATE = 'gameover';
		GAMEOVER.clear();
	}
};
