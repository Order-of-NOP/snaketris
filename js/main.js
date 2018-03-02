let game;
let grid;
let input;
let states = {};

const SIZE = {H: 18, W: 24};
// relative speed values
// TIP: less -> faster
const SPEED = {
	SNAKE: 2,
	TETR_BOOST: 1,
	TETR_ROTATE: 1,
	TETR_SHIFT: 2,
	TETR: 8,
	FOOD: 48,
	SNAKE_FALL: 1,
	// must be = TETR
	FRUIT_FALL: 8
}

const DIR_HEAD = {
	left: MINO_TYPE.HEAD_L,
	right: MINO_TYPE.HEAD_R,
	up: MINO_TYPE.HEAD_U,
	down: MINO_TYPE.HEAD_D
};

const PL = {
	SNAKE: 0,
	TETR: 1
};

function MOD(a, b, c) {
	let s = a + b;
	if ( s == 0 ) return 0;
	if (s > 0) return s % c;
	if (s < 0) return c + s;
}

const CONFIG = {
	FULL_SCREEN_MODE: false,
	SOUND_MUTE: false,
	MUSIC_ON: true
};



let LAST_GAME_STATE = '';

function init() {
	const config = {
		width: SIZE.W*TILE_SIZE,
		height: SIZE.H*TILE_SIZE,
		renderer: Phaser.AUTO,
		parent: 'game',
		antialias: true,
		multiTexture: true,
		//transparent: true
	};
	game = new Phaser.Game(config);
	for (let s in states) {
		game.state.add(s, states[s]);
	}
	game.state.start('preload');
	//scores_view = document.getElementById('hudscore');
}
