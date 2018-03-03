/* states/game.js */

let clk = null;
let ticks = 0;
let snake;
let tetr;
let tetr_jp_dir = X_DIR.NONE;
// active fruit
let fruit = [];
// dead snake 
let snake_d = [];
let snake_spawner = null;
let bg_sprite;

let score = 0;
let lvl = 0;

let score_label;
// for switch beetwen menu with help key
let pause_btn_ind = 0;

let name_input = null;

// For pause
let PAUSE = new Gui();
PAUSE.SWITCH_KEY  = null;
PAUSE.SCREEN_SPRT = null;
PAUSE.TO_SETTINGS = null;
PAUSE.PAUSED = false;
PAUSE.LST_PRS1 = [true, true, true];
PAUSE.LST_PRS2 = [true, true, true];
PAUSE.GAMEOVER = false;

function clear_pause() {
	PAUSE.TO_SETTINGS = null;
	PAUSE.PAUSED = false;
	PAUSE.LST_PRS1 = [true, true, true];
	PAUSE.LST_PRS2 = [true, true, true];
	PAUSE.GAMEOVER = false;
}

const LVL_DELAY = [100, 90, 80, 70, 60, 50];

function spawn_tetr() {
	// TODO check collisions w/ snake and fruit
	return new Tetrimino(game.rnd.pick('litjlsoz'), [SIZE.W/2, 0]);
}

states['game'] = {
	init: () => {
		bg_sprite = game.add.tileSprite(0, 0,
			game.cache.getImage('background').width,
			game.cache.getImage('background').height, 'background');
		game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
		grid = new Grid(SIZE.W, SIZE.H);
		grid.add_callback('clear', () => {
			fruit = [];
			snake_d = [];
			lvl = 0;
			score = 0;
		});
	},
	create: () => {
		let tick_time = LVL_DELAY[lvl];
		//clk = game.time.create(false);
		clk = game.time.events.loop(tick_time, tick, this)
		snake = new Snake(5, 2);
		tetr = spawn_tetr();
		//clk.start();
		game.input.onDown.add((ptr) => {
			if (!ptr.rightButton.isDown) return;
			if (game.scale.isFullScreen) {
				game.scale.stopFullScreen();
			} else {
				game.scale.startFullScreen(false);
			}
		}, this);
		snake_spawner = new SnakeSpawner(grid.g);
		snake_spawner.spawn('left');
		
		score_label = game.add.text(10, 10, "SCORE: ", TXT_STL.LBL_SCR);

		grid.set(tetr.minos, MINO_TYPE.ACTIVE);
	},
	update: () => {
		//input.debug();
		tetr.boost = input.p[PL.TETR]['down'].isDown;
		if (tetr_jp_dir === X_DIR.NONE) {
			tetr_jp_dir =
				(input.p[PL.TETR]['left'].justPressed)*X_DIR.LEFT +
				(input.p[PL.TETR]['right'].justPressed)*X_DIR.RIGHT;
		}
		tetr.x_dir =
			(input.p[PL.TETR]['left'].isDown)*X_DIR.LEFT +
			(input.p[PL.TETR]['right'].isDown)*X_DIR.RIGHT;
		if (input.p[PL.TETR]['up'].justPressed) tetr.to_rotate = true;
		// For Snake
		if (input.p[0]['down'].justPressed) {
			if (snake.alive) {
				snake.set_dir('down');
			}
		} else if (input.p[0]['up'].justPressed) {
			if (snake.alive) {
				snake.set_dir('up');
			}
		} else if (input.p[0]['left'].justPressed) {
			if (snake.alive) {
				snake.set_dir('left');
			} else {
				snake_spawner.set_player_choice('left');
			}
		} if (input.p[0]['right'].justPressed) {
			if (snake.alive) {
				snake.set_dir('right');
			} else {
				snake_spawner.set_player_choice('right');
			}
		}
		// Esc for pause
		if (PAUSE.SWITCH_KEY.justReleased) {
			game.paused = ! game.paused;
		}
	},
	// When you swith to another state
	shutdown: () => {
		pause_btn_ind = 0;
		LAST_GAME_STATE = 'game';
		if (!PAUSE.TO_SETTINGS) {
			grid.clear();
			ticks = 0;
			score = 0;
		} else {
			PAUSE.clear();
			clear_pause();
		}
		if (PAUSE.SCREEN_SPRT != null) {
			PAUSE.SCREEN_SPRT.destroy();
			PAUSE.SCREEN_SPRT = null;
		}
	},
	paused: () => {
		if (LAST_GAME_STATE != 'game') {
			game.paused = false;
			LAST_GAME_STATE = 'game';
			return;
		}
		// Init alpha screen
		PAUSE.SCREEN_SPRT = game.add.sprite(0, 0, 'sheet');
		PAUSE.SCREEN_SPRT.width = game.world.width;
		PAUSE.SCREEN_SPRT.height = game.world.height;
		PAUSE.SCREEN_SPRT.alpha = 0.5;
		PAUSE.SCREEN_SPRT.tint = '#ffffff';
		PAUSE.SCREEN_SPRT.animations.add('simple', [5], 500, true);
		PAUSE.SCREEN_SPRT.animations.play('simple');
		// There is init pause menu components
		if (!PAUSE.GAMEOVER) {
			let pause = () => { game.paused = false; }
			let st = state => game.state.start(state); 
			PAUSE.__Y0 = 120;
			PAUSE.add_btn(()=> {
				 pause();
				}, 'Resume game', TXT_STL.BTN);
			
			PAUSE.add_btn(()=> {
				 grid.clear();
				 pause();
				 st('ready');
			}, 'New game', TXT_STL.BTN);
			
			PAUSE.add_btn(()=> { 
				grid.clear();
				pause();
				st('menu');
			}, 'Quit to title', TXT_STL.BTN);
		} else {
			score_tab.check(score, (new_record) => {
				x = game.world.centerX - 100;
				PAUSE.add_text(x, 50,
					'Game over',
					TXT_STL.LBL_TTL
				);
				PAUSE.add_text(x, 200,
					'Your score is ' + score,
					TXT_STL.BTN
				);
				if (new_record) {
					PAUSE.add_text(x + 20, 230,
						'It\'s a new record!',
						TXT_STL.LBL_MAGENTA
					);
					name_input = new InputField(x, 330);
					if (GJAPI.bActive && GJAPI.sUserName) {
						name_input.val = GJAPI.sUserName;
					}
				}
				PAUSE.__Y0 = 400; // margin top for buttons
				PAUSE.add_btn(()=>{
					if (new_record) {
						name_input.active = false;
						score_tab.add(score, name_input.value || 'Incognito');
					}
					game.paused = false;
					grid.clear();
					game.state.start(new_record ? 'records': 'menu'); 
				}, 'Continue', TXT_STL.BTN);
			});
		}
	},
	pauseUpdate: () => {
		// Esc for pause
		if (PAUSE.SWITCH_KEY.justReleased) {
			game.paused = !game.paused;
		}
		if (name_input !== null && name_input.active) {
			return;
		}
		let isDown;
		let F1 = i => { PAUSE.LST_PRS1[i] = isDown; } 
		let F2 = i => { PAUSE.LST_PRS2[i] = isDown; } 
		isDown = input.p[0]['down'].isDown;
		if (isDown && !PAUSE.LST_PRS1[0]) { PAUSE.next(); } F1(0);
		isDown = input.p[0]['up'].isDown;
		if (isDown && !PAUSE.LST_PRS1[1]) { PAUSE.prev(); } F1(1);
		isDown = input.p[0]['right'].isDown;
		if (isDown && !PAUSE.LST_PRS1[2]) { PAUSE.call(); } F1(2);
		isDown = input.p[1]['down'].isDown;
		if (isDown && !PAUSE.LST_PRS2[0]) { PAUSE.next(); } F2(0);
		isDown = input.p[1]['up'].isDown;
		if (isDown && !PAUSE.LST_PRS2[1]) { PAUSE.prev(); } F2(1);
		isDown = input.p[1]['right'].isDown;
		if (isDown && !PAUSE.LST_PRS2[2]) { PAUSE.call(); } F2(2);
	},
	resumed: () => {
		if (!PAUSE.TO_SETTINGS) {
			clear_pause();
		}
		PAUSE.clear();
		if (PAUSE.SCREEN_SPRT != null) {
			PAUSE.SCREEN_SPRT.destroy();
			PAUSE.SCREEN_SPRT = null;
		}
		game.world.alpha = 1;
	}
}

function draw_fruit() {
	for (let i = 0; i < fruit.length; ++i) {
		if (fruit[i].grav) {
			fruit[i].move('down');
		} else {
			fruit[i].grav = true;
		}
	}
}

let boost_drop = false;
function tetr_fall(pwr) {
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
			snake.cut_on_tetr();
			boost_drop = true;
		}
		if (c === MINO_TYPE.FRUIT) {
			let [fx, fy] = np[n];
			let f = fruit_find(fx, fy);
			f.grav = false;
			f.move('down', snake_body.includes(f.stack()) || pwr);
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
			snake.cut_on_tetr();
			boost_drop = true;
		}
		if (c === MINO_TYPE.FRUIT) {
			let [fx, fy] = np[n];
			let f = fruit_find(fx, fy);
			/* tetr's center is the first mino */
			let ctr = tetr.minos[0];
			/* fruit coord relative to tetr's center */
			let f_ = [fx - ctr[0], fy - ctr[1]];
			/* delta fruit's pos */
			let mv;
			/* rotate clockwise */
			if (f_[0] > 0 && f_[1] >= 0) mv = [ 0,  1];
			if (f_[0] <= 0 && f_[1] > 0) mv = [-1,  0];
			if (f_[0] < 0 && f_[1] <= 0) mv = [ 0, -1];
			if (f_[0] >= 0 && f_[1] < 0) mv = [ 1,  0];
			let nf = [fx + mv[0], fy + mv[1]];
			/* move out of tetr */
			while (_.find(np, (el) => {
				return el[0] === nf[0] && el[1] === nf[1];
			}) !== undefined) {
				mv = [mv[0] === 0 ? 0 : mv[0] + Math.sign(mv[0])
					, mv[1] === 0 ? 0 : mv[1] + Math.sign(mv[1])];
				nf = [fx + mv[0], fy + mv[1]];
			}
			/* now move (collision-proof!) */
			while (mv[0] !== 0 || mv[1] !== 0) {
				if (mv[0] !== 0) {
					f.move(mv[0] < 0 ? 'left' : 'right', true);
					mv[0] += mv[0] < 0 ? 1 : -1;
				}
				if (mv[1] !== 0) {
					f.move(mv[1] < 0 ? 'up' : 'down', true);
					mv[1] += mv[1] < 0 ? 1 : -1;
				}
			}
		}
	}
	grid.set(tetr.minos, MINO_TYPE.EMPTY);
	tetr.set_pos(np);
	grid.set(np, MINO_TYPE.ACTIVE);
	tetr.to_rotate = false;
}

function tetr_shift() {
	let x_dir = (tetr.x_dir === X_DIR.NONE) ? tetr_jp_dir : tetr.x_dir;
	if (x_dir === X_DIR.NONE) return;
	tetr_jp_dir = X_DIR.NONE;

	let snake_body = [MINO_TYPE.SNAKE, MINO_TYPE.HEAD_U, MINO_TYPE.HEAD_D,
		MINO_TYPE.HEAD_L, MINO_TYPE.HEAD_R];
	let blockers = ['wall', 'floor', MINO_TYPE.STILL, MINO_TYPE.HEAVY,
		MINO_TYPE.DEAD];
	let np = tetr.move(x_dir === X_DIR.LEFT ? 'left' : 'right');
	let cs = _.filter(grid.collide(np), (p) => {
		return p[0] !== MINO_TYPE.ACTIVE;
	});
	for (let i = 0; i < cs.length; ++i) {
		let [c, n] = cs[i];
		if (blockers.indexOf(c) >= 0) return;
		if (snake_body.indexOf(c) >= 0) {
			snake.cut_on_tetr();
		}
		if (c === MINO_TYPE.FRUIT) {
			let [fx, fy] = np[n];
			let f = fruit_find(fx, fy);
			f.move(x_dir === X_DIR.LEFT ? 'left' : 'right');
		}
	}
	grid.set(tetr.minos, MINO_TYPE.EMPTY);
	tetr.set_pos(np);
	grid.set(np, MINO_TYPE.ACTIVE);
}

function draw_snake() {
	// relevant when was killed by Tetr
	if (snake.seg.length == 0) {
		grid.set(snake.seg, MINO_TYPE.EMPTY);
		snake_d = snake_d.concat(snake.seg);
		//adding delay and spawn option
		if (!snake_spawner.spawn('left') && !snake_spawner.spawn('right')) {
			snake_spawner.wait();
		} 
		return;
	}
	// get new coord
	let np = snake.move();
	let res = grid.collide(np);
	// resolve collisions
	for (let i = 0; i < res.length; i++) {
		let [c, n] = res[i];
		if (n === 0 && c === MINO_TYPE.FRUIT) {
			// add new segment
			let n = snake.seg.length - 1;
			np.push([snake.seg[n][0], snake.seg[n][1]])
			// find fruit with this position and pop it
			fruit_find(np[0][0], np[0][1]).destroy();
			set_score(5);
		}
		if (n === 0 && ![MINO_TYPE.SNAKE, MINO_TYPE.FRUIT].includes(c)) {
			// die, mah-fukker, die!
			grid.set(snake.seg, MINO_TYPE.EMPTY);
			snake_d = snake_d.concat(snake.seg);
			//adding delay and spawn option
			if (!snake_spawner.spawn('left') && !snake_spawner.spawn('right')) {
				snake_spawner.wait();
			} 
			return;
		}
		if (c === MINO_TYPE.ACTIVE) {
			let skin = snake.cut(n);
			grid.set(skin, MINO_TYPE.EMPTY);
			snake_d = snake_d.concat(skin);
			np.splice(n);
			boost_drop = true;
			break;
		}
	}
	let h = np[0];
	// clear
	grid.set(snake.seg, MINO_TYPE.EMPTY);
	// draw head
	grid.set(np, MINO_TYPE.SNAKE);
	// set head sprite
	grid.set([h], DIR_HEAD[snake.cur_dir]);
	// snake set new pos
	snake.set_pos(np);
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

function set_score(val) {
	score += parseInt(val);
	if (lvl === LVL_DELAY.length - 1) return;
	if (parseInt(score / 500) > lvl) {
		clk.delay = LVL_DELAY[++lvl];
	}
}

function erase_lines() {
	let full = [];
	let heavy = [];
	let blk = [MINO_TYPE.STILL, MINO_TYPE.DEAD, MINO_TYPE.HEAVY];
	for (let r = 0; r < grid.h; ++r) {
		let c;
		for (c = 0; c < grid.w; ++c) {
			if (!blk.includes(grid.g[r][c])) break;
		}
		if (c === grid.w) {
			full.push(r);
			let inters = _.intersection(blk, grid.g[r]);
			if (inters.length === 1 && inters[0] === MINO_TYPE.HEAVY) {
				heavy.push(r);
			}
		}
	}
	if (full.length === 0) return;
	snake_d = [];
	for (let i = 0; i < full.length; ++i) {
		if (heavy.includes(full[i])) {
			let r = full[i];
			_.each(grid.g[r], (mino, idx) => {
				grid.set([[idx, r]], MINO_TYPE.STILL);
			});
		}
		/* running through all the columns */
		for (let c = 0; c < grid.w; ++c) {
			for (let r = full[i]; r > 0; --r) {
				if (grid.g[r][c] === MINO_TYPE.HEAVY) {
					if (r + 1 < grid.h && grid.g[r + 1][c] !== MINO_TYPE.HEAVY) {
						grid.set([[c, r+1]], MINO_TYPE.EMPTY);
					}
					break;
				}
				if (!blk.concat(MINO_TYPE.EMPTY).includes(grid.g[r][c]))
					continue;
				grid.set([[c, r]],
					[MINO_TYPE.STILL, MINO_TYPE.DEAD].includes(grid.g[r-1][c])
					? grid.g[r-1][c] : MINO_TYPE.EMPTY);
			}
			//grid.set([[c, 0]], MINO_TYPE.EMPTY);
		}
		// visuals
		grid.animate(0, full[i], heavy.includes(full[i])
			? 'crimson'
			: 'lightning');
	}
	set_score(40*(lvl+1) + 20*(full.length - 1));
	// more visuals
	game.plugins.screenShake.shake(16);
	for (let r = 0; r < grid.h; ++r)
	for (let c = 0; c < grid.w; ++c) {
		if (grid.g[r][c] === MINO_TYPE.DEAD) {
			snake_d.push([c, r]);
		}
	}
}

function game_over() {
	for (let i = 0; i < grid.w; ++i) {
		if (grid.g[0][i] === MINO_TYPE.STILL) {
			PAUSE.GAMEOVER = true;
			game.paused = true;
		}
	}
}

function tick() {
	erase_lines();
	game_over();
	if (ticks % SPEED.TETR_ROTATE === 0) tetr_rotate();
	if (ticks % SPEED.TETR_SHIFT === 0) tetr_shift();
	if (ticks % ((tetr.boost && !boost_drop) ? SPEED.TETR_BOOST
		: SPEED.TETR) === 0)
	{
		boost_drop = false;
		tetr_fall(tetr.boost);
	}
	if (ticks % SPEED.SNAKE == 0) {
		if (snake.alive) {
			draw_snake();
		} 
	}
	// draw snake segments
	if (ticks % SPEED.SNAKE_FALL == 0) {
		draw_snake_d();
	}
	// NOTE: always draw fruit before spawning another one
	if (ticks % SPEED.FRUIT_FALL === 0) {
		draw_fruit();
	}
	if (ticks % SPEED.FOOD === 0 || fruit.length === 0) {
		let f = new Fruit();
		f.spawn();
	}

	// грязный хак, который работает
	grid.set(tetr.minos, MINO_TYPE.ACTIVE);

	score_label.text = "SCORE: " + score;

	// Don't remove
	ticks++;
	let m = _.max(SPEED);
	if (ticks > m) ticks -= m;
}
