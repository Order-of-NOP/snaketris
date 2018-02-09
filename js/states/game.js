/* states/game.js */

let clk = null;
let ticks = 0;
let snake;
let tetr;
// active fruit
let fruit = [];

function spawn_tetr() {
	return new Tetrimino(game.rnd.pick('litjlsoz'), [SIZE.W/2, 0]);
}

function spawn_fruit() {
	fruit.push([rndAB(0, SIZE.W - 1), 0]);
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

function draw_fruit() {
	// static active fruit (need for collision between fruit)
	let fruit_s = [];
	// create list of new coords
	let n_c = _.map(fruit, (e)=>{ return [e[0], e[1] + 1]});
	// get collide indexes
	let res = grid.collide(n_c);
	// problem indexes
	let ids = _.unzip(res); ids = ids.length == 0 ? [] : ids[1];
	// get normal fruit
	let _fruit = _.filter(fruit, (e, i) => { return !ids.includes(i);});
	// resolve collisions
	for (let i = 0; i < res.length; i++) {
		let pos = fruit[res[i][1]];
		// There is reslolve collisions with floor
		if (res[i][0] == 'floor') {
			fruit_s.push( [pos[0], pos[1]]);
			res.splice(i, 1); i--;
		} else {
			// There is resolve collisions with minos 
			switch(res[i][0]) {
				case MINO_TYPE.SNAKE: {
					_fruit.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.ACTIVE: {
					_fruit.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.STILL: {
					fruit_s.push( [pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.HEAVY: {
					fruit_s.push( [pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.DEAD: {
					_fruit.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.FRUIT: {
					_fruit.push([pos[0], pos[1] - 1]);
				} break;
			}
		}
	}
	// clear
	grid.set(fruit, MINO_TYPE.EMPTY);
	fruit = _fruit;
	// move movable fruit
	_.each(fruit, (e)=> {e[1]++;});
	// draw fruit
	grid.set(fruit, MINO_TYPE.FRUIT);
	// draw current iteration's static fruit
	if (fruit_s.length > 0)
		grid.set(fruit_s, MINO_TYPE.HEAVY);
}

function tick() {
	// Actions with fruit (draw, collisions e.t.c)
	if (ticks % SPEED.FOOD == 0) {
		spawn_fruit();
	}

	if (ticks % SPEED.FRUIT_FALL == 0) {
		draw_fruit();
	}

	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
