let game;
let grid;
let input;
let states = {};

const SIZE = {H: 18, W: 24};
// reltive speed values
const SPEED = {
	SNAKE: 2,
	TETR_BOOST: 1,
	TETR: 8,
	FOOD: 48,
	FRUIT_FALL: 8
}

const FALLING_TYPES = [
	MINO_TYPE.ACTIVE,
	MINO_TYPE.DEAD,
	MINO_TYPE.FRUIT
];

function init() {
	const config = {
		width: 768,
		height: 576,
		renderer: Phaser.AUTO,
		parent: 'game',
		antialias: true,
		multiTexture: true,
		//,transparent: true
	};
	game = new Phaser.Game(config);
	for (let s in states) {
		game.state.add(s, states[s]);
	}
	game.state.start('preload');
	//scores_view = document.getElementById('hudscore');
}

function rndAB(A, B) {
    return Math.floor(Math.random() * (B - A + 1) + A);
}