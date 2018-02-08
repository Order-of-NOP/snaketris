/* states/game.js */

// TODO handle pause
states['game'] = {
	create: () => {
		// wanna do something useful on right click
		document.querySelector('canvas').oncontextmenu
			= function() { return false; };

		sounds.eat = game.add.audio('eat')
		grid = new Grid(SIZE.W, SIZE.H);
		input = new Input();

		// demo mode
		let ts = [0,1,2,6,7,8,9,10];
		for (let r = 0; r < grid.h; ++r) {
			grid.set(_.map(_.range(grid.w), (v) => {
				return [v,r];
			}), ts[r%ts.length]);
		}
	},
	update: () => {
		if (input.p[0]['down'].isDown) {
			console.log('head bend over');
		}
		if (input.p[1]['up'].justReleased) {
			console.log('raise da pasterior');
		}
	}
}
