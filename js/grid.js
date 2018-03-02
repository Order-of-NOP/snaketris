/* grid.js */

/**
 * Enum for tile codes used in Grid#g as values and in {@link Grid#sg} as
 * animation codes.
 */
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
	FRUIT: 10,
	// see draw snake in js/states/game.js
};

/**
 * Size of a tile in pixels.
 * @type {number}
 */
const TILE_SIZE = 32;

/**
 * Grid is the main field of a game. It consists of tiles that hold only a
 * number, representing it's type.
 */
class Grid {
	/**
	 * Create a grid. Normally there is only one grid per game.
	 * @param {number} w - The [width]{@link Grid#w} value.
	 * @param {number} h - The [height]{@link Grid#h} value.
	 */
	constructor(w, h) {
		/**
		 * The width of the grid.
		 * @member {number}
		 */
		this.w = w;
		/**
		 * The height of the grid.
		 * @member {number}
		 */
		this.h = h;
		/**
		 * A grid. Holds the integer values of [type]{@link MINO_TYPE} for
		 * every mino. Is mostly used for collide detection and other game
		 * mechanics.
		 * @member {list}
		 */
		this.g = new Array(h).fill(null).map(row => new Array(w).fill(null));
		/**
		 * A sprite grid. This is, basically, a screen, where all the action
		 * is shown. Consists of sprite objects with animations set up.
		 * @member {list}
		 */
		this.sg = new Array(h).fill(null).map(row => new Array(w).fill(null));

		/**
		 * A hash-map of lists of callbacks with MINO_TYPE.toString() as keys.
		 */
		this._cbs = {};

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
	/**
	 * Clears the screen by changing all the values to
	 * [EMPTY]{@link MINO_TYPE.EMPTY}. Use it when starting a new game.
	 */
	clear() {
		for (let r = 0; r < this.h; ++r)
		for (let c = 0; c < this.w; ++c) {
			this.g[r][c] = MINO_TYPE.EMPTY;
			this.sg[r][c].play(MINO_TYPE.EMPTY.toString());
		}
		// callback function calls
		if ('clear' in this._cbs) {
			_.each(this._cbs['clear'], (f) => { f(); });
		}
	}
	/**
	 * Used to check bounds and interpolation with tiles, other than
	 * [EMPTY]{@link MINO_TYPE.EMPTY}.
	 * @example
	 * // coordinates are passed as [x, y]
	 * grid.collide([[0,0], [0,1], [0,2], [1,2]]);
	 * @param {list} li - list of points
	 * @return {list} A list of collisions. Collision is represented as a
	 * tuple [cause, id], where id is the number of `li` member collided,
	 * `cause` is a cause of collision (can be "wall", "ceil", "floor" or a
	 * [type of mino]{@link MINO_TYPE} as a number).
	 */
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
				//console.log(JSON.stringify(t));
				if (t !== MINO_TYPE.EMPTY) {
					res.push([this.g[y][x], i]);
				}
			}
		});
		return res;
	}
	// set all the minos
	/**
	 * Sets a type of all the listed minos to the given one. Coordinates are
	 * passed as [x,y].
	 * @param {list} li - list of points
	 * @param {number} type - [type]{@link MINO_TYPE} to set to
	 */
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
	/**
	 * Add a callback to be called after an event.
	 * @params {number|string} evt - one of srtings: "clear"
	 * @params {function} f - function to be called with parameters sent to
	 * a related function
	 */
	add_callback(evt, f) {
		/* sanity check */
		if (typeof(evt) !== 'string') {
			console.warn('evt is not a string');
			return;
		}
		if (typeof(f) !== 'function') {
			console.warn('f is not a function');
			return;
		}
		if (this._cbs[evt]) {
			this._cbs[evt].push(f);
		} else {
			this._cbs[evt] = [f];
		}
	}

	/**
	 * Remove all the callbacks for a specified event.
	 * @param {number} evt - an event for callbacks to be deleted
	 */
	rm_callbacks(evt) {
		delete this._cbs[evt.toString()];
	}

	animate(_x, _y, anim, mod) {
		if (anim === 'explode') {
			let x =  _x * TILE_SIZE - 15;
			let y =  _y * TILE_SIZE - 10;
			let angle = 0;

			if (mod === 'l') {
				x = _x * TILE_SIZE + 42;
				y = _y * TILE_SIZE - 15;
				angle = 90;
			}
			else if (mod === 'r') {
				x = _x * TILE_SIZE;
				y = _y * TILE_SIZE + 47;
				angle = -90;
			}

			let xpl = game.add.sprite(x, y, 'explosion', 0);
			xpl.angle = angle;
			xpl.animations.add('explode').onComplete.add(() => {
				xpl.destroy();
			});
			xpl.play('explode');
		} else if (['lightning', 'crimson'].includes(anim)) {
			let y = _y * TILE_SIZE;
			let lght = game.add.sprite(0, y, anim, 0);
			lght.animations.add('light', null, 30).onComplete.add(() => {
					lght.destroy();
				});
			lght.play('light');
		}
	}
}
