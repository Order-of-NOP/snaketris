let game;
let grid;
let input;

const SIZE = {H: 18, W: 24};
// reltive speed values
const SPEED = {
	SNAKE: 2,
	TETR_BOOST: 1,
	TETR: 8,
	FOOD: 48,
	FRUIT_FALL: 8
}

function init() {
	const config = {
		width: 768,
		height: 576,
		renderer: Phaser.AUTO,
		parent: 'game',
		antialias: true,
		multiTexture: true,
		state: {
			preload: preload,
			create: create,
			update: update,
			render: render
		}
		//,transparent: true
	};
	game = new Phaser.Game(config);
	//scores_view = document.getElementById('hudscore');
}

let sounds = {
	win: null,
	lose: null,
	eat: null
}

function preload() {
	//game.load.audio('win', '../music/win.wav');
	game.load.audio('eat', '../music/beep.wav');
	// load all the sprites, fonts and other stuff
	game.load.spritesheet('sheet', '../img/sheet.png', TILE_SIZE, TILE_SIZE);
}

function create() {
	// wanna do something useful on right click
	document.querySelector('canvas').oncontextmenu
		= function() { return false; };

	sounds.eat = game.add.audio('eat')
	grid = new Grid(SIZE.W, SIZE.H);
	input = new Input();

	// demo mode
	let ts = [0,1,2,6,7,8,9,10];
	for (let r = 0; r < grid.h; ++r) {
		grid.set(_.map(_.range(grid.w), (v) => {
			return [v,r];
		}), ts[r%ts.length]);
	}
}

function update() {
	// for slide changing
	/*if (
		game_state === ST.MENU
		|| game_state === ST.TUTOR1
		|| game_state === ST.TUTOR2
	) {
		if (enter_key.justReleased()) change_slide();
	}
	else if (game_state === ST.GAME) {
		// input for snake
		if (input[PL.SNK].up.justReleased()) {
			// choice dir
			if (!snake.turn_charged && snake.dir != MINO_TYPE.HEAD_D) {
				snake.dir = MINO_TYPE.HEAD_U;
				snake.turn_charged = true;
			}
		} else if (input[PL.SNK].down.justReleased()) {
			if (!snake.turn_charged && snake.dir != MINO_TYPE.HEAD_U) {
				snake.dir = MINO_TYPE.HEAD_D;
				snake.turn_charged = true;
			}
		} else if (input[PL.SNK].right.justReleased()) {
			if (!snake.turn_charged && snake.dir != MINO_TYPE.HEAD_L) {
				snake.dir = MINO_TYPE.HEAD_R;
				snake.turn_charged = true;
			}
		} else if (input[PL.SNK].left.justReleased()) {
			if (!snake.turn_charged && snake.dir != MINO_TYPE.HEAD_R) {
				snake.dir = MINO_TYPE.HEAD_L;
				snake.turn_charged = true;
			}
		}
		// input for tetris
		let new_minos = null;
		if (input[PL.TRS].up.justReleased()) {
			new_minos = tetr.rotate();
		} else if (input[PL.TRS].right.justReleased()) {
			new_minos = tetr.move("right");
		} else if (input[PL.TRS].left.justReleased()) {
			new_minos = tetr.move("left");
		}
		if (input[PL.TRS].down.isDown) {
			if (!tetr.boost) tetr.boost = true;
		} else {
			if (tetr.boost) tetr.boost = false;
		}
		if (new_minos !== null) {
			if (check_bounds(new_minos)) {
				erase(tetr.minos);
				tetr.set_pos(new_minos);
				activate(tetr.minos);
			}
		}
	}*/
	if (input.p[0]['down'].isDown) {
		console.log('head bend over');
	}
	if (input.p[1]['up'].justReleased) {
		console.log('raise da pasterior');
	}
	//if (input.p[1]['up'].isDown) {
		//console.log('raise da pasterior!');
	//}
}

function render() {
}
