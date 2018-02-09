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
	let xs, y;
	/* loop through all the lines seeking for an empty space */
	for (y = 0; y < SIZE.H; ++y) {
		xs = _.filter(_.range(SIZE.W), (x) => {
			return grid.collide([[x, y]]).length === 0;
		});
		if (xs.length > 0) break;
	}
	if (y === SIZE.H) {
		console.warn('Whoa! No place for fruit!');
		return;
	}
	let pos = [_.sample(xs), y];

	//let pos = [_.random(0, SIZE.W - 1), 0];
	grid.set([pos], MINO_TYPE.FRUIT);
	fruit.push(pos);
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

		snake = new Snake(5, 5);
		tetr = spawn_tetr();
		clk.start();
		// TODO uncomment when making fullscreen
		/*game.input.onDown.add(() => {
			if (game.scale.isFullScreen) {
				game.scale.stopFullScreen();
			} else {
				game.scale.startFullScreen(false);
			}
		}, this);*/
		grid.add_callback('clear', () => {
			fruit = [];
			grid._cbs = {};
		})
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
		grid.clear();
		ticks = 0;
		clk.destroy();
	}
}

function draw_fruit() {
	// static active fruit (need for collision between fruit)
	let fruit_s = [];
	// create list of new coords
	let n_c = _.map(fruit, (e) => { return [e[0], e[1] + 1] });
	// get collisions
	let res = grid.collide(n_c);
	// collided indices
	let ids = _.unzip(res);
	ids = ids.length == 0 ? [] : ids[1];
	// get normal fruit
	let _fruit = _.filter(fruit, (e, i) => { return !ids.includes(i); });
	// resolve collisions
	for (let i = 0; i < res.length; i++) {
		let pos = fruit[res[i][1]];
		// There is reslolve collisions with floor
		// TODO handle wall collisions when is pushed by Tetr
		if (res[i][0] == 'floor') {
			fruit_s.push([pos[0], pos[1]]);
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
					fruit_s.push([pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.HEAVY: {
					fruit_s.push([pos[0], pos[1]])
					res.splice(i, 1); i--;
				} break;
				case MINO_TYPE.DEAD: {
					_fruit.push([pos[0], pos[1] - 1]);
				} break;
				case MINO_TYPE.FRUIT: {
					// TODO too complex. Can be made simple
					// этот код позволяет фруктам не блокировать друг друга при
					// падении. Код сканирует столбец грида вниз начиная с pos,
					// пока не наткнётся на что-то, кроме фрукта
					let stuck = true;
					for (let y = pos[1]+1; i < SIZE.H; ++y) {
						let t = grid.collide([[pos[0], y]]);
						if (t.length === 0) {
							_fruit.push([pos[0], pos[1]]);
							stuck = false;
							break;
						}
						else if (t[0][0] === MINO_TYPE.FRUIT) continue;
						else break;
					}
					if (stuck) _fruit.push([pos[0], pos[1] - 1]);
				} break;
			}
		}
	}
	// clear
	grid.set(fruit, MINO_TYPE.EMPTY);
	fruit = _fruit;
	// move movable fruit
	_.each(fruit, (e) => { e[1]++; });
	// draw fruit
	grid.set(fruit, MINO_TYPE.FRUIT);
	// draw current iteration's static fruit
	if (fruit_s.length > 0) {
		grid.set(fruit_s, MINO_TYPE.HEAVY);
	}
	// TODO food Snake with some fruit!
}

function tick() {
	// TODO snake goes here
	// TODO tetr goes here
	// Actions with fruit (draw, collisions e.t.c)
	// NOTE: always draw fruit before spawning another one
	if (ticks % SPEED.FRUIT_FALL == 0) {
		draw_fruit();
	}

	if (ticks % SPEED.FOOD == 0) {
		spawn_fruit();
	}

	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
