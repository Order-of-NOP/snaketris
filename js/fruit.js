function fruit_find(x, y) {
	return _.find(fruit, (el) => {
		return el.x === x && el.y === y;
	});
}

class Fruit
{
	constructor() {
		this.p = [0, 0];
		this.grav = true;
	}
	get x() { return this.p[0]; }
	get y() { return this.p[1]; }
	set x(v) { this.p[0] = v; }
	set y(v) { this.p[1] = v; }
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
	move(dir, pwr) {
		let blockers = [MINO_TYPE.DEAD, MINO_TYPE.STILL, MINO_TYPE.HEAVY];
		if (dir === 'down') {
			let [x, y] = [this.x, this.y + 1];
			let cs = grid.collide([[x,y]]);
			/* free to go */
			if (cs.length === 0 || cs[0][0] === MINO_TYPE.ACTIVE) {
				grid.set([this.p], MINO_TYPE.EMPTY);
				this.p = [x, y];
				grid.set([this.p], MINO_TYPE.FRUIT);
				return;
			}
			let c = cs[0][0];
			if (blockers.includes(c) || c === 'floor') {
				if (!!pwr) {
					// TODO smash this fruit!
					grid.set([this.p], MINO_TYPE.EMPTY);
					this.destroy();
					return;
				}
				grid.set([this.p], MINO_TYPE.HEAVY);
				this.destroy();
				return;
			}
			if (c === MINO_TYPE.FRUIT) {
				let btm = this.stack;
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
				// TODO smash this fruit!
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
			if (blockers.includes(c.concat(['wall', MINO_TYPE.SNAKE]))) {
				// TODO smash this fruit!
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
	get stack() {
		let abv = grid.collide([[this.p[0], this.p[1] + 1]]);
		if (abv.length === 0) return MINO_TYPE.EMPTY;
		if (abv[0][0] === MINO_TYPE.FRUIT) {
			let f = fruit_find(this.p[0], this.p[1] + 1);
			return f.stack;
		}
		return abv[0][0];
	}
	destroy() {
		let idx = _.findIndex(fruit, (el) => {
			return el.x === this.p[0] && el.y === this.p[1];
		});
		fruit.splice(idx, 1);
	}
}
