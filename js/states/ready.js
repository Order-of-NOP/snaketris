/* states/ready.js */

const READY_GUI = {
	BTNS: [],
	LBL: []
};

const READY = new Gui();

const READY_FLGS = [ false, false ];
const READY_LBLS = ['READY', ''];

const TIME_DELAY = 0;

let RDY_TIME = null;

states['ready'] = {
	init: () => {
		bg_sprite = game.add.tileSprite(0, 0,
			game.cache.getImage('background').width,
			game.cache.getImage('background').height, 'background');
	},
	create: () => {
		READY.add_text(400, 170, 'Snake (arrows)', TXT_STL.LBL_SNK);
		READY.add_text(100, 170, 'Block (WASD)', TXT_STL.LBL_TTR);
		READY.add_text(100, 200, 'Press any key', TXT_STL.LBL_SCR);
		READY.add_text(400, 200, 'Press any key', TXT_STL.LBL_SCR);

		READY.add_text(0, 0, '', TXT_STL.LBL_TTL);
		READY.count_label = _.last(READY.GUI.LBLS);
		READY.count_label.centerX = game.world.centerX;
		READY.count_label.centerY = game.world.centerY - 200;

		READY.add_text(100, 240, READY_LBLS[1], TXT_STL.LBL_SCR);
		READY.add_text(400, 240, READY_LBLS[1], TXT_STL.LBL_SCR);
		add_fullscreen();
	},
	update: () => {
		if (RDY_TIME == null) {
			let offset = READY.GUI.LBLS.length - 1;
			for (let i = 0; i < 2; i++) {
				let ip = input.p[i];
				if (!READY_FLGS[i]) {
					if (ip['left'].justReleased) {
						READY_FLGS[i] = !READY_FLGS[i];
					}
					if (ip['down'].justReleased) {
						READY_FLGS[i] = !READY_FLGS[i];
					}
					if (ip['right'].justReleased) {
						READY_FLGS[i] = !READY_FLGS[i];
					}
					if (ip['up'].justReleased) {
						READY_FLGS[i] = !READY_FLGS[i];
					}
					
					if (READY_FLGS[i]) {
						READY.GUI.LBLS[offset - i].text = READY_LBLS[0];
					} else {
						READY.GUI.LBLS[offset - i].text = READY_LBLS[1];
					}
				}
			}
		}
		if (RDY_TIME === null) {
			if (READY_FLGS[0] && READY_FLGS[1]) {
				RDY_TIME = game.time.now + TIME_DELAY;
			}
		} else {
			let time = RDY_TIME - game.time.now;
			//READY.count_label.text = (time > -1 ? (time/1000).toFixed(2) : 0);
			if (time < 10) {
				game.state.start('game');
			}
		}
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ready';
		// Здесь всё занулять и чистить
		READY.clear();
		READY_FLGS[0] = false;
		READY_FLGS[1] = false;
		RDY_TIME = null;
	}
};
