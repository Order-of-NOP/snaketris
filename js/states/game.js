/* states/game.js */

let clk = null;
let ticks = 0;
let snake;
let tetr;
// active fruit
let fruit = [];
// fruit that was moved by Tetr in the current tick
let ttf = [];

function spawn_tetr() {
	// TODO check collisions w/ snake and fruit
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
		});

		grid.set(tetr.minos, MINO_TYPE.ACTIVE);
	},
	update: () => {
		tetr.boost = input.p[PL.TETR]['down'].isDown;
		tetr.x_dir =
			(input.p[PL.TETR]['left'].isDown)*X_DIR.LEFT +
			(input.p[PL.TETR]['right'].isDown)*X_DIR.RIGHT;
		if (input.p[PL.TETR]['up'].justReleased) tetr.to_rotate = true;
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
	ids = ids.length === 0 ? [] : ids[1];
	// final result. Storing not collided fruit now
	let _fruit = _.filter(fruit, (e, i) => {
		// TODO check tetr_threaten
		return !ids.includes(i);
	});
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

// TODO возможно исчезание фруктов, проверить этот кейс позже
// TODO fruit to snake's head collides need some careful handling
function tetr_fall() {
	// return threaten fruit. Maybe to take it back later
	fruit = fruit.concat(ttf);
	ttf = [];
	let snake_body = [MINO_TYPE.SNAKE, MINO_TYPE.HEAD_U, MINO_TYPE.HEAD_D,
		MINO_TYPE.HEAD_L, MINO_TYPE.HEAD_R];
	let blockers = ['floor', MINO_TYPE.STILL, MINO_TYPE.HEAVY, MINO_TYPE.DEAD];
	let np = tetr.move('down');
	let cs = _.filter(grid.collide(np), (p) => {
		return p[0] !== MINO_TYPE.ACTIVE;
	})
	for (let i = 0; i < cs.length; ++i) {
		let [c, n] = cs[i];
		if (c === 'wall') console.warn('id10t: What? A wall down there? 0_o');
		if (blockers.indexOf(c) >= 0) {
			grid.set(tetr.minos, MINO_TYPE.STILL);
			tetr = spawn_tetr();
			grid.set(tetr.minos, MINO_TYPE.ACTIVE);
			return;
		}
		if (snake_body.indexOf(c) >= 0) {
			// TODO collide w/ snake
		}
		if (c === MINO_TYPE.FRUIT) {
			let f = np[n];
			let find_f = (el) => { return el[0] === f[0] && el[1] === f[1]; };
			// stop tracking gravity on this fruit
			let f_idx = _.findIndex(fruit, find_f);
			if (f_idx >= 0) {
				fruit.splice(f_idx, 1);
				grid.set([f], MINO_TYPE.EMPTY);
			}
			f = [f[0], f[1] + 1];
			let fc = grid.collide([f]);
			if (fc.length === 0) {
				grid.set([f], MINO_TYPE.FRUIT);
				ttf.push(f);
			} else {
				// smash the fruit!
				// TODO play an animation
			}
		}
	}
	// the way is free
	grid.set(tetr.minos, MINO_TYPE.EMPTY);
	tetr.set_pos(np);
	grid.set(np, MINO_TYPE.ACTIVE);
}

function tetr_rotate() {
	if (!tetr.to_rotate) return;
	let snake_body = [MINO_TYPE.SNAKE, MINO_TYPE.HEAD_U, MINO_TYPE.HEAD_D,
		MINO_TYPE.HEAD_L, MINO_TYPE.HEAD_R];
	let blockers = ['wall', 'ceil', 'floor', MINO_TYPE.STILL, MINO_TYPE.HEAVY,
		MINO_TYPE.DEAD];
	let np = tetr.rotate();
	let cs = _.filter(grid.collide(np), (p) => {
		return p[0] !== MINO_TYPE.ACTIVE;
	});
	for (let i = 0; i < cs.length; ++i) {
		let [c, n] = cs[i];
		if (blockers.indexOf(c) >= 0) {
			tetr.to_rotate = false;
			return;
		}
		if (snake_body.indexOf(c) >= 0) {
			// TODO interact w/ snake
		}
		if (c === MINO_TYPE.FRUIT) {
			let f = np[n];
			let f_idx = _.findIndex(fruit, (el) => {
				return el[0] === f[0] && el[1] === f[1];
			});
			/* tetr's center is the first mino */
			let ctr = tetr.minos[0];
			/* fruit coord relative to tetr's center */
			let f_ = [f[0] - ctr[0], f[1] - ctr[1]];
			/* delta fruit's pos */
			let mv;
			/* rotate clockwise */
			if (f_[0] > 0 && f_[1] >= 0) mv = [ 0,  1];
			if (f_[0] <= 0 && f_[1] > 0) mv = [-1,  0];
			if (f_[0] < 0 && f_[1] <= 0) mv = [ 0, -1];
			if (f_[0] >= 0 && f_[1] < 0) mv = [ 1,  0];
			let nf = [f[0] + mv[0], f[1] + mv[1]];
			/* move out of tetr */
			while (_.find(np, (el) => {
				return el[0] === nf[0] && el[1] === nf[1];
			}) !== undefined) {
				mv = [mv[0] === 0 ? 0 : mv[0] + 1, mv[1] === 0 ? 0 : mv[1]];
				nf = [f[0] + mv[0], f[1] + mv[1]];
			}
			/* check collisions */
			let fc = grid.collide([nf]);
			if (fc.length === 0) {
				grid.set([f], MINO_TYPE.EMPTY);
				fruit[f_idx] = nf;
				grid.set([nf], MINO_TYPE.FRUIT);
			} else {
				fc = _.unzip(fc)[0];
				// there is a collision w/ a blocker
				if (_.intersection(
					fc, blockers.concat([MINO_TYPE.FRUIT, MINO_TYPE.SNAKE]
				)).length !== 0) {
					grid.set([f], MINO_TYPE.EMPTY);
					fruit.splice(f_idx, 1);
					// TODO smash em fruit!
				}
				// TODO unhandled snake head collision
			}
		}
	}
	grid.set(tetr.minos, MINO_TYPE.EMPTY);
	tetr.set_pos(np);
	grid.set(np, MINO_TYPE.ACTIVE);
	tetr.to_rotate = false;
}

function tetr_shift() {
	if (tetr.x_dir === X_DIR.NONE) return false;
	let snake_body = [MINO_TYPE.SNAKE, MINO_TYPE.HEAD_U, MINO_TYPE.HEAD_D,
		MINO_TYPE.HEAD_L, MINO_TYPE.HEAD_R];
	let blockers = ['wall', 'floor', MINO_TYPE.STILL, MINO_TYPE.HEAVY,
		MINO_TYPE.DEAD];
	let np = tetr.move(tetr.x_dir === X_DIR.LEFT ? 'left' : 'right');
	let cs = _.filter(grid.collide(np), (p) => {
		return p[0] !== MINO_TYPE.ACTIVE;
	});
	for (let i = 0; i < cs.length; ++i) {
		let [c, n] = cs[i];
		if (blockers.indexOf(c) >= 0) return;
		if (snake_body.indexOf(c) >= 0) {
			// TODO interact w/ snake
		}
		if (c === MINO_TYPE.FRUIT) {
			let f = np[n];
			let f_idx = _.findIndex(fruit, (el) => {
				return el[0] === f[0] && el[1] === f[1];
			});
			/* the new fruit's position */
			let nf = [f[0] + (tetr.x_dir === X_DIR.LEFT ? -1 : 1), f[1]];
			let fc = grid.collide([nf]);
			// TODO fruit to snake's head collides need some careful handling
			if (fc.length === 0) {
				grid.set([f], MINO_TYPE.EMPTY);
				fruit[f_idx] = nf;
				grid.set([nf], MINO_TYPE.FRUIT);
			} else {
				fc = _.unzip(fc)[0];
				// there is a collision w/ a blocker
				if (_.intersection(
					fc, blockers.concat([MINO_TYPE.FRUIT, MINO_TYPE.SNAKE]
				)).length !== 0) {
					grid.set([f], MINO_TYPE.EMPTY);
					fruit.splice(f_idx, 1);
					// TODO smash em fruit!
				}
				// TODO unhandled snake head collision
			}
		}
	}
	grid.set(tetr.minos, MINO_TYPE.EMPTY);
	tetr.set_pos(np);
	grid.set(np, MINO_TYPE.ACTIVE);
}

function tick() {
	// TODO snake goes here
	// tetr goes here
	if (ticks % SPEED.TETR_BOOST === 0) {
		tetr_rotate();
		tetr_shift();
	}
	if (ticks % (tetr.boost ? SPEED.TETR_BOOST : SPEED.TETR) === 0) {
		tetr_fall();
	}
	// Actions with fruit (draw, collisions e.t.c)
	// NOTE: always draw fruit before spawning another one
	if (ticks % SPEED.FRUIT_FALL === 0) {
		draw_fruit();
	}

	if (ticks % SPEED.FOOD === 0) {
		spawn_fruit();
	}

	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
