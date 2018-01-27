/* grid.js */

const MINO_TYPE = {
	EMPTY: 0,
	SNAKE: 1,
	HEAD_U: 2,
	HEAD_D: 3,
	HEAD_L: 4,
	HEAD_R: 5,
	// for controllable tetramino
	ACTIVE: 6,
	// just minos
	STILL: 7,
	// unremovable minos
	HEAVY: 8,
	// dead snake
	DEAD: 9,
	// snake food
	FRUIT: 10
};

const TILE_SIZE = 32;

class Grid {
	// needs width and height to construct
	constructor(w, h) {
		this.w = w;
		this.h = h;
		// grid (first coord is y, rembre?)
		this.g = new Array(h).fill(null).map(row => new Array(w).fill(null));
		// sprite grid
		this.sg = new Array(h).fill(null).map(row => new Array(w).fill(null));

		// wipe all the grids
		for (let r = 0; r < h; ++r)
		for (let c = 0; c < w; ++c) {
			this.g[r][c] = MINO_TYPE.EMPTY;
			this.sg[r][c] = game.add.sprite(c*TILE_SIZE, r*TILE_SIZE, 'sheet');
			// adding an animation for every MINO_TYPE
			_.each(MINO_TYPE, (t) => {
				// TODO when real animation starts, you will shit bricks
				this.sg[r][c].animations.add(t.toString(),
					[t], 0, true);
			});
			this.sg[r][c].play(MINO_TYPE.EMPTY.toString());
		}
	}
	// clear the screen for the new game
	clear() {
		for (let r = 0; r < this.h; ++r)
		for (let c = 0; c < this.w; ++c) {
			this.g[r][c] = MINO_TYPE.EMPTY;
			this.sg[r][c].play(MINO_TYPE.EMPTY.toString());
		}
	}
	// check if this minos collide with anything
	collide(li) {
		let res = [];
		_.each(li, ([x,y], i) => {
			let in_bounds = true;
			// bounds check
			if (x < 0 || x >= this.w) {
				res.push(['wall', i]);
				in_bounds = false;
			}
			if (y < 0) {
				res.push(['ceil', i]);
				in_bounds = false;
			}
			if (y >= this.h) {
				res.push(['floor', i])
				in_bounds = false;
			}
			// we can't pick a point when it's out of bounds
			if (in_bounds) {
				let t = this.g[y][x];
				console.log(JSON.stringify(t));
				if (t !== MINO_TYPE.EMPTY) {
					res.push([this.g[y][x], i]);
				}
			}
		});
		return res;
	}
	// set all the minos
	set(li, type) {
		if (typeof(type) !== 'number') {
			console.warn(`${type} is not a number`);
		}
		_.each(li, ([x,y]) =>{
			if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
				console.error(`(${x}, ${y}) is out of bounds!`);
				return;
			}
			this.g[y][x] = type;
			this.sg[y][x].play(type.toString());
		});
	}
}
