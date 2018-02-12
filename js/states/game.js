/* states/game.js */

let clk = null;
let ticks = 0;
let snake;
let tetr;
// active fruit
let fruit = [];
// dead snake 
let snake_d = [];
// for snake respawn timer
let snk_spwn_time = 0.0;
//  for spawn animation 
let timer_anim = null;
let snk_spwn_anim_dl = 100;
let snk_spwn_anm_alph = 0.0;
// delay spawn in milliseconds
let snk_spwn_dl = 5000;
// snake's spawn positions
let SPAWN_PALYER_CHOICE = 'right';

let SPAWN_POS_Y = 2;

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

function spawn_snake_at() {
	snake.reset(5,5);
	if (snake.cur_dir == 'left') {
		set_left_spwn();
	} else { set_right_spwn(); }
	snake.alive = false;
}

function set_left_spwn() {
	let n_c = [
		[5, SPAWN_POS_Y],
		[4, SPAWN_POS_Y],
		[3, SPAWN_POS_Y]
	]
	_.each(snake.seg, (e)=>{
		grid.sg[e[1]][e[0]].alpha = 1.0;
	});
	grid.set(snake.seg, MINO_TYPE.EMPTY);
	snake.cur_dir = 'right';
	snake.set_pos(n_c);
	grid.set(snake.seg, MINO_TYPE.SNAKE);
	grid.set([snake.seg[0]], MINO_TYPE.HEAD_L);
}

function set_right_spwn() {
	let n_c = [
		[SIZE.W - 5, SPAWN_POS_Y],
		[SIZE.W - 5 + 1, SPAWN_POS_Y],
		[SIZE.W - 5 + 2, SPAWN_POS_Y]
	]
	_.each(snake.seg, (e)=>{
		grid.sg[e[1]][e[0]].alpha = 1.0;
	});
	grid.set(snake.seg, MINO_TYPE.EMPTY);
	snake.cur_dir = 'left';
	snake.set_pos(n_c);
	grid.set(snake.seg, MINO_TYPE.SNAKE);
	grid.set([snake.seg[0]], MINO_TYPE.HEAD_R);
	console.log(snake.cur_dir);
}

function anim_flashing_snake() {
	snk_spwn_anm_alph = (snk_spwn_anm_alph + 0.09) % 1.0;
	// There is code for time for snake is spawning
	_.each(snake.seg, (e)=>{
		grid.sg[e[1]][e[0]].alpha = snk_spwn_anm_alph;
	});
	// There is code for end of spawn
	if (snk_spwn_time < game.time.now) {
		_.each(snake.seg, (e)=>{
			grid.sg[e[1]][e[0]].alpha = 1.0;
		});
		snake.alive = true;
		snk_spwn_anm_alph = 0.0;
		timer_anim.stop(true);
		timer_anim.destroy();
		timer_anim = null;
	}
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
		// For Snake
		if (input.p[0]['down'].justReleased) {
			if (snake.alive) {
				snake.set_dir('down');
				console.log('snake down');
			}
		} else if (input.p[0]['up'].justReleased) {
			if (snake.alive) {
				snake.set_dir('up');
				console.log('snake up');
			}
		} else if (input.p[0]['left'].justReleased) {
			if (snake.alive) {
				snake.set_dir('left');
				console.log('snake left');
			} else {
				SPAWN_PALYER_CHOICE = 'left';
				set_left_spwn();
			}
		} if (input.p[0]['right'].justReleased) {
			if (snake.alive) {
				snake.set_dir('right');
				console.log('snake right');
			} else {
				SPAWN_PALYER_CHOICE = 'right';
				set_right_spwn();
			}
		}
		// For Tetris
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
	// return previous position
	let ret_pos = (l,p) => { l.push([p[0], p[1] - 1]); };
	// send fruit to static
	let to_static = (l,p,r,i) => { l.push([p[0], p[1]]); r.splice(i,1); i--; };
	// snake eat fall fruit
	let snk_eat = (r,i) => { r.splice(i,1); i--; snake.push_seg(); }
	// static active fruit (need for collision between fruit)
	let fruit_s = [];
	// create list of new coords
	let n_c = _.map(fruit, (e) => { return [e[0], e[1] + 1] });
	// get collisions
	var res = grid.collide(n_c);
	// collided indices
	let ids = _.unzip(res);	ids = ids.length == 0 ? [] : ids[1];
	// get normal fruit
	let _fruit = _.filter(fruit, (e, i) => { return !ids.includes(i); });
	// resolve collisions
	for (var i = 0; i < res.length; i++) {
		let pos = fruit[res[i][1]];
		// There is reslolve collisions with floor
		// TODO handle wall collisions when is pushed by Tetr
		if (res[i][0] == 'floor') {
			to_static(fruit_s, pos, res, i);
		} else {
			// There is resolve collisions with minos 
			switch(res[i][0]) {
				case MINO_TYPE.SNAKE: ret_pos(_fruit, pos); break;
				case MINO_TYPE.ACTIVE: ret_pos(_fruit, pos); break;
				case MINO_TYPE.STILL: to_static(fruit_s, pos, res, i); break;
				case MINO_TYPE.HEAVY: to_static(fruit_s, pos, res, i); break;
				case MINO_TYPE.DEAD: to_static(fruit_s, pos, res, i); break;
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
				// Additional cases
				case MINO_TYPE.HEAD_U: snk_eat(res, i); break;
				case MINO_TYPE.HEAD_L: snk_eat(res, i); break;
				case MINO_TYPE.HEAD_R: snk_eat(res, i); break;
				case MINO_TYPE.HEAD_D: snk_eat(res, i); break;
			}
		}
	}
	// clear
	grid.set(fruit, MINO_TYPE.EMPTY);
	// switch previous pos
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

// !!! WARNING
// I have done collide with head only
function draw_snake() {
	// get new coord
	let n_c = snake.move();
	// get collisions with gead only!!!
	let res = grid.collide([n_c[0]]);
	// resolve collisions
	for(let i = 0; i < res.length; i++) {
		let ind = res[i][1];
		let type = res[i][0];
		// if head of snake collide
		if (ind === 0) {
			if (type != MINO_TYPE.FRUIT) {
				// Without this if snake can kill self
				if (type != MINO_TYPE.SNAKE) {
					grid.set(snake.seg, MINO_TYPE.EMPTY);
					for(let k = 0; k < snake.seg.length; k++) {
						snake_d.push(snake.seg[k]);
					}
					//adding delay and spawn option
					snk_spwn_time = game.time.now + snk_spwn_dl;
					spawn_snake_at();
					// draw in grid
					grid.set(snake.seg, MINO_TYPE.SNAKE);
					grid.set([snake.seg[0]], MINO_TYPE.HEAD_R);
					// clear timer
					if (timer_anim !== null) { timer_anim.destroy(); } 
					// start new animation timer
					timer_anim = game.time.create(false);
					timer_anim.loop(snk_spwn_anim_dl, anim_flashing_snake, this);
					timer_anim.start(0.0);
					return;
				} else { // Theris snake cut self
					let it = -1;
					for(let k = 1; k < n_c.length; k++)
						if (n_c[k][0] == n_c[0][0] &&
							n_c[k][1] == n_c[0][1]) {
								it = k;
								break;
							}
					if (it != -1) {
					// get part alive snake
					let half_f = n_c.splice(0, it);
					// clear parts of snake
					let tail_d = [];
					for(let k = snake.seg.length - 1; k > it-1; k-- ) {
						tail_d.push(snake.seg[k]);
					}
					grid.set(tail_d, MINO_TYPE.EMPTY);
					// push dead part of snake to snake_d
					for(let k = 0; k < n_c.length; k++) {
						snake_d.push(n_c[k]);
					}
					// swap n_c
					n_c = half_f;
					}
				}
			} else { // snake eat it
				// add new segment
				let n = snake.seg.length - 1;
				n_c.push([snake.seg[n][0], snake.seg[n][1]])
				// find fruit with this position and pop it
				for(let k = 0; k < fruit.length; k++) {
					if (fruit[k][0] == n_c[0][0] && fruit[k][1] == n_c[0][1]) {
						// pop elem
						fruit.splice(k, 1);
						// clean map
						grid.set([[n_c[0][0], n_c[0][1]]], MINO_TYPE.EMPTY);
						break;
					}
				}
			}
		} 
	}

	let h = n_c[0];
	// clear
	try
	{
	grid.set(snake.seg, MINO_TYPE.EMPTY);
	// draw head
	grid.set(n_c, MINO_TYPE.SNAKE);
	// set head sprite
	grid.set([h], DIR_HEAD[snake.cur_dir]);
	// snake set new pos
	snake.set_pos(n_c);
	}
	catch(e){
		console.log(e);
	}
}

function draw_snake_d() {
	// for each snake_d check bottom
	// and move it if there is nothing
	let n_c = [];
	// Important ! There is drawing segments
	// for correct next loop _.each
	grid.set(snake_d, MINO_TYPE.DEAD);

	_.each(snake_d, (e) => {
		let _x = e[0];
		let _y = e[1] + 1;
		if (_y < SIZE.H) {
			if (grid.g[_y][_x] === MINO_TYPE.EMPTY) {
				n_c.push([_x, _y]);
			} else {
				n_c.push([_x, _y - 1]);	
			}
		} else {
			n_c.push([_x, _y - 1]);
		}
	});
	grid.set(snake_d, MINO_TYPE.EMPTY);
	grid.set(n_c, MINO_TYPE.DEAD);
	snake_d = n_c;
}

function tick() {
	// TODO snake goes here
	if (ticks % SPEED.SNAKE == 0) {
		if (snk_spwn_time < game.time.now) {
			draw_snake();
		} 
	}
	// draw snake segments
	if (ticks % SPEED.SNAKE_FALL == 0) {
		draw_snake_d();
	}
	// TODO tetr goes here
	// Actions with fruit (draw, collisions e.t.c)
	// NOTE: always draw fruit before spawning another one
	if (ticks % SPEED.FRUIT_FALL == 0) {
		draw_fruit();
	}

	if (ticks % SPEED.FOOD == 0) {
		// if snake isn't alive we aren't spawning fruit
		if (timer_anim == null)
			spawn_fruit();
	}

	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
