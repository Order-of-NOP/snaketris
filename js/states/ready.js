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
			'Press any key for say \'READY\'', LBL_RDY_STL));
		READY_GUI.LBL.push( game.add.text(400, 200, 
				'Press any key for say \'READY\'', LBL_RDY_STL));
		READY_GUI.LBL.push( game.add.text(game.world.centerX-10, 100, 
				'', BTN_STYLE));
		READY_GUI.RD_LBL.push( game.add.text(100, 240, 
			READY_LBLS[1], LBL_RDY_STL));
		READY_GUI.RD_LBL.push( game.add.text(400, 240, 
			READY_LBLS[1], LBL_RDY_STL));
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
		_.each(READY_GUI.BTNS, (e)=>{ e.destroy(); });
		_.each(READY_GUI.LBL, (e)=>{ e.destroy(); });
		_.each(READY_GUI.RD_LBL, (e)=>{ e.destroy(); });
		READY_GUI.BTNS = [];
		READY_GUI.LBL = [];
		READY_GUI.RD_LBL = [];
		READY_FLGS[0] = false;
		READY_FLGS[1] = false;
		RDY_TIME = null;
	}
};
