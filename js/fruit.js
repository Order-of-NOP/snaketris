/**
 * Find a [Fruit]{@link Fruit} with given position in a [fruit]{@link} list.
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @return {Fruit|undefined} a Fruit on [x, y] position. If there's no such
 * fruit, returns undefined
 */
function fruit_find(x, y) {
	return _.find(fruit, (el) => {
		return el.x === x && el.y === y;
	});
}

/**
 * Represents a fruit.
 */
class Fruit
{
	constructor() {
		/**
		 * @member {list}
		 * Position of a fruit in [Grid]{@link Grid}.
		 */
		this.p = [0, 0];
		/**
		 * @member {boolean}
		 * Turn to false when do not need gravitation to be applied this
		 * [tick]{@link tick}. Will be switched back by
		 * [draw_fruit]{@link draw_fruit}.
		 */
		this.grav = true;
	}
	/** @type {number} x coordinate of the Fruit. */
	get x() { return this.p[0]; }
	/** @type {number} y coordinate of the Fruit */
	get y() { return this.p[1]; }
	set x(v) { this.p[0] = v; }
	set y(v) { this.p[1] = v; }
	/**
	 * Spawn a fruit in an apropriate position of a [Grid]{@link Grid}. Adds it
	 * to a [fruit]{@link fruit} list.
	 */
	spawn() {
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
		this.p = pos;
		fruit.push(this);
	}
	/**
	 * Move a fruit to a given direction. This handles all the collisions and
	 * [destroys]{@link Fruit#destroy} it when squashed.
	 * @param {string} dir - 'left', 'right', 'up' of 'down'
	 * @param {boolean} pwr - use an alternative behavour on vertical moves
	 */
	move(dir, pwr) {
		let blockers = [MINO_TYPE.DEAD, MINO_TYPE.STILL, MINO_TYPE.HEAVY];
		pwr = dir === 'up' || pwr;
		if (dir === 'down' || dir === 'up') {
			let [x, y] = [this.x, this.y + (dir === 'up' ? -1 : 1)];
			let cs = grid.collide([[x, y]]);
			/* free to go */
			if (cs.length === 0 || cs[0][0] === MINO_TYPE.ACTIVE) {
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.p = [x, y];
				grid.set([this.p], MINO_TYPE.FRUIT);
				return;
			}
			let c = cs[0][0];
			if (blockers.concat('floor', 'ceil').includes(c)) {
				if (!!pwr) {
					grid.animate(this.x, this.y, 'explode');
					grid.set([this.p], MINO_TYPE.EMPTY);
					this.destroy();
					return;
				}
				grid.set([this.p], MINO_TYPE.HEAVY);
				this.destroy();
				return;
			}
			if (c === MINO_TYPE.FRUIT) {
				let btm = this.stack(dir === 'up');
				if (btm === MINO_TYPE.EMPTY) {
					let f = fruit_find(x, y);
					f.grav = false;
					f.move('down', !!pwr);
					grid.set([this.p], MINO_TYPE.EMPTY);
					this.p = [x, y];
					grid.set([this.p], MINO_TYPE.FRUIT);
					return;
				} else {
					return;
				}
			}
			/* we have only snake left */
			// TODO food the snake
			if (!!pwr) {
				grid.animate(this.x, this.y, 'explode');
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.destroy();
				return;
			}
			return;
		} else {
			let [x, y] = [this.x + (dir === 'left' ? -1 : 1), this.y];
			let cs = grid.collide([[x, y]]);
			if (cs.length === 0) {
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.p = [x, y];
				grid.set([this.p], MINO_TYPE.FRUIT);
				return;
			}
			let c = cs[0][0];
			if (blockers.concat(['wall', MINO_TYPE.SNAKE]).includes(c)) {
				grid.animate(this.x, this.y, 'explode', dir[0]);
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.destroy();
				return;
			}
			// TODO food the snake
			if (c === MINO_TYPE.FRUIT) {
				let f = fruit_find(x, y);
				f.move(dir);
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.p = [x, y];
				grid.set([this.p], MINO_TYPE.FRUIT);
				return;
			}
		}
	}
	/**
	 * For a vertical stack of fruit objects this function tests, what it ends
	 * with. By default it checks below the Fruit.
	 * @param {boolean} up - set to true to check above the fruit
	 */
	stack(up) {
		let p = [this.p[0], this.p[1] + (!!up ? -1 : 1)];
		let abv = grid.collide([p]);
		if (abv.length === 0) return MINO_TYPE.EMPTY;
		if (abv[0][0] === MINO_TYPE.FRUIT) {
			let f = fruit_find(p[0], p[1]);
			return f.stack(up);
		}
		return abv[0][0];
	}
	/** Removes the fruit from a list of fruit. */
	destroy() {
		let idx = _.findIndex(fruit, (el) => {
			return el.x === this.p[0] && el.y === this.p[1];
		});
		fruit.splice(idx, 1);
	}
}
