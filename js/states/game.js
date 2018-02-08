/* states/game.js */

let clk = null;
let ticks = 0;
let snake;
let tetr;
// active fruits
let fruits_a = [];
// static active fruits
let fruits_s = [];


function spawn_tetr() {
	return new Tetrimino(game.rnd.pick('litjlsoz'), [SIZE.W/2, 0]);
}

function spawn_fruit() {
	fruits_a.push([rndAB(0, SIZE.W), 0]);
}

// TODO handle pause
states['game'] = {
	init: () => {
		grid = new Grid(SIZE.W, SIZE.H);
	},
	create: () => {
		let tick_time = 100;
		clk = game.time.create(false);
		clk.loop(tick_time, tick, this)
		// TODO preparings
		snake = new Snake(5, 5);
		tetr = spawn_tetr();
		clk.start();
		game.input.onDown.add(() => {
			if (game.scale.isFullScreen) {
				game.scale.stopFullScreen();
			} else {
				game.scale.startFullScreen(false);
			}
		}, this);
		fruits_a = [
			[0, 0],
			[0, 1],
			[SIZE.W/2, 0],
			[SIZE.W-1, 0],
			[3, 0],
		];
		grid.set([[0, 3]], MINO_TYPE.DEAD);
		/*spawn_fruit();
		spawn_fruit();
		spawn_fruit();*/
	},
	update: () => {
		if (input.p[0]['down'].isDown) {
			console.log('head bend over');
		}
		if (input.p[1]['up'].justReleased) {
			console.log('raise da pasterior');
		}
	},
	// When you swith to another state
	shutdown: () => {
		grid = new Grid(SIZE.W, SIZE.H);
		ticks = 0;
		clk.destroy();
	}
}

function draw_fruits_a() {
	// create list of new coords
	let n_c = [];
	// init new coord
	for (let i = 0; i < fruits_a.length; i++) {
		n_c.push( [fruits_a[i][0], fruits_a[i][1] + 1] );
	}
	// get collide indexes
	let res = grid.collide_down(n_c);
	// problem indexes
	let ids = [];
	for (let i = 0; i < res.length; i++)
		ids.push(res[i][1]);
	// get normal fruits
	let _fruits_a = [];
	for(let i = 0; i < fruits_a.length; i++) {
		if (ids.includes(i)) continue;
		_fruits_a.push(fruits_a[i]);
	}
	// resolve collisions
	for (let i = 0; i < res.length; i++) {
		let pos = fruits_a[res[i][1]];
		// collide fruits with floor
		if (res[i][0] == 'floor') {
			fruits_s.push( [pos[0], pos[1]])
			res.splice(i, 1);
			i--;
		} else {
			// colliding with MINO_TYPES
			switch(res[i][0]) {
				case MINO_TYPE.SNAKE: {
					_fruits_a.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.ACTIVE: {
					_fruits_a.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.STILL: {
					fruits_s.push( [pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.HEAVY: {
					fruits_s.push( [pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.DEAD: {
					_fruits_a.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.FRUIT: {
					_fruits_a.push([pos[0], pos[1] - 1]);
				} break;
			}
		}
	}
	// clear
	grid.set(fruits_a, MINO_TYPE.EMPTY);
	fruits_a = _fruits_a;
	// move movable fruits
	for(let i = 0; i < fruits_a.length; i++) { 
			fruits_a[i][1]++;
	}
	grid.set(fruits_a, MINO_TYPE.FRUIT);

}

function draw_fruits_s() {
	grid.set(fruits_s, MINO_TYPE.HEAVY);
}

function tick()
{
	grid.set([[0, 3]], MINO_TYPE.DEAD);
	grid.set([[SIZE.W/2, 5]], MINO_TYPE.STILL);
	draw_fruits_s();
	if (ticks % SPEED.FRUIT_FALL == 0)
		draw_fruits_a();

	//grid.set([[0, 5].reverse()], MINO_TYPE.FRUIT);

	//grid.set([[0,0]], MINO_TYPE.FRUIT);
	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
