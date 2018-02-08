/* tetris.js */

class Tetrimino {
	// Note: init_mino is the center mino of the shape,
	// so it sould be placed in the center of the grid.
	constructor(shape, init_mino) {
		// Figure shape status from set {i, o, z, t, l, s, j}.
		this.shape = shape; 
		this.boost = false;
		// Consider 0th mino as the center one.
		if (shape === 'i') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] - 2, init_mino[1]],
				[init_mino[0] - 1, init_mino[1]],
				[init_mino[0] + 1, init_mino[1]]
			];
		} else if (shape === 'o') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] + 1, init_mino[1]],
				[init_mino[0], init_mino[1] + 1],
				[init_mino[0] + 1, init_mino[1] + 1]
			];
		} else if (shape === 'z') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] - 1, init_mino[1]],
				[init_mino[0], init_mino[1] + 1],
				[init_mino[0] + 1, init_mino[1] + 1]
			];
		} else if (shape === 't') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] - 1, init_mino[1]],
				[init_mino[0], init_mino[1] + 1],
				[init_mino[0] + 1, init_mino[1]]
			];
		} else if (shape === 'l') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0], init_mino[1] + 1],
				[init_mino[0] + 1, init_mino[1]],
				[init_mino[0] + 2, init_mino[1]]
			];
		} else if (shape === 's') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] - 1, init_mino[1] + 1],
				[init_mino[0], init_mino[1] + 1],
				[init_mino[0] + 1, init_mino[1]]
			];
		} else if (shape === 'j') {
			this.minos = [
				[init_mino[0], init_mino[1]],
				[init_mino[0] - 2, init_mino[1]],
				[init_mino[0] - 1, init_mino[1]],
				[init_mino[0], init_mino[1] + 1]
			];
		} else {
			console.warn("id10t: invalid shape token");
		}
	}

	set_pos(new_minos) {
		for (let i = 0; i < this.minos.length; i++) {
			this.minos[i] = new_minos[i];
		}
	}

	move(direction) {
		let new_minos = [];
		if (direction === "left") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push([this.minos[i][0] - 1, this.minos[i][1]]);
			}
		} else if (direction === "right") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push([this.minos[i][0] + 1, this.minos[i][1]]);
			}
		} else if (direction === "down") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push([this.minos[i][0], this.minos[i][1] + 1]);
			}
		} else {
			console.warn("id10t: invalid direction token");
		}
		return new_minos;
	}

	rotate() {
		if (this.shape === 'o') {
			return this.minos;
		}
		// Calculate minos coordinates relative to the center.
		// 0th mino is the center one, thus we start loop from 1th.
		let new_minos = [];
		new_minos.push([this.minos[0][0], this.minos[0][1]]);
		for (let i = 1; i < this.minos.length; i++) {
			new_minos.push([
				this.minos[i][0] - this.minos[0][0],
				this.minos[i][1] - this.minos[0][1]
			]);
		}
		// Generate new coordinates for non-center minos.
		for (let i = 1; i < this.minos.length; i++) {
			let old_x = new_minos[i][0];
			new_minos[i][0] = -(new_minos[i][1]);
			new_minos[i][1] = old_x;
		}
		// Transform coordinates from local values back to global ones.
		for (let i = 1; i < this.minos.length; i++) {
			new_minos[i][0] = new_minos[i][0] + this.minos[0][0];
			new_minos[i][1] = new_minos[i][1] + this.minos[0][1];
		}
		return new_minos;
	}
};
