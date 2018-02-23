/* states/ready.js */

const READY_GUI = {
	BTNS: [],
	LBL: [],
	RD_LBL: []
};

const READY_FLGS = [ false, false ];
const READY_LBLS = ['READY', 'NOT READY'];

const TIME_DELAY = 3000;

let RDY_TIME = null;

states['ready'] = {
	create: () => {
		READY_GUI.LBL.push( game.add.text(100, 200, 
			'Press any key for say \'READY\'', TXT_STL.LBL_SCR));
		READY_GUI.LBL.push( game.add.text(400, 200, 
				'Press any key for say \'READY\'', TXT_STL.LBL_SCR));
		READY_GUI.LBL.push( game.add.text(0,0, 
				'', TXT_STL.LBL_TTL));
		READY_GUI.LBL[2].centerX = game.world.centerX;
		READY_GUI.LBL[2].centerY = game.world.centerY - 200;
		READY_GUI.RD_LBL.push( game.add.text(100, 240, 
			READY_LBLS[1], TXT_STL.LBL_SCR));
		READY_GUI.RD_LBL.push( game.add.text(400, 240, 
			READY_LBLS[1], TXT_STL.LBL_SCR));
	},
	update: () => {
		if (RDY_TIME == null) {
			for (let i = 0; i < 2; i++) {
				let ip = input.p[i];
				if (!READY_FLGS[i]) {
					if (ip['left'].justReleased) {READY_FLGS[i] = !READY_FLGS[i];}
					if (ip['down'].justReleased) { READY_FLGS[i] = !READY_FLGS[i]; }
					if (ip['right'].justReleased) { READY_FLGS[i] = !READY_FLGS[i]; }
					if (ip['up'].justReleased) { READY_FLGS[i] = !READY_FLGS[i]; }
					
					if (READY_FLGS[i]) {
						READY_GUI.RD_LBL[i].text = READY_LBLS[0];
					} else {
						READY_GUI.RD_LBL[i].text = READY_LBLS[1];
					}
				}
			}
		}
		if (RDY_TIME == null) {
			if (READY_FLGS[0] && READY_FLGS[1]) {
				console.log('READY!!!');
				RDY_TIME = game.time.now + TIME_DELAY;
			}
		} else {
			let time = RDY_TIME - game.time.now;
			READY_GUI.LBL[2].text = (time > -1 ? (time/1000).toFixed(2) : 0);
			if (time < 10) {
				game.state.start('game');
			}
		}
	},
	shutdown: () => {
		LAST_GAME_STATE = 'ready';
		// Здесь всё занулять и чистить
		clear_gui(READY_GUI);
		READY_FLGS[0] = false;
		READY_FLGS[1] = false;
		RDY_TIME = null;
	}
};
