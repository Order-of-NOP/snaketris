/* states/preload.js */

const MUSIC = {
	EAT: null,
	ROW: null,
	BACK: null,
	DEAD: null
};

states['preload'] = {
	preload: () => {
		game.load.image('background', 'img/bg.png');
		game.load.image('logo', 'img/logo.png');
		game.load.spritesheet('sheet', 'img/sheet.png',
			TILE_SIZE, TILE_SIZE);
		game.load.spritesheet('explosion', 'img/explosion.png', 63, 42);
		game.load.spritesheet('lightning', 'img/lightning.png', 808, 32);
		game.load.spritesheet('crimson', 'img/crimson.png', 808, 32);
		game.load.audio('eat', 'music/eat.wav');
		game.load.audio('row', 'music/row.wav');
		game.load.audio('back', 'music/back.mp3');
		game.load.audio('beep', 'music/beep.wav');
	},
	create: () => {
		// wanna do something useful on right click
		document.querySelector('canvas').oncontextmenu
			= function() { return false; };
		input = new Input();
		PAUSE.SWITCH_KEY = new Key(Phaser.Keyboard.ESC);
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.stage.backgroundColor = '#120b92';
		MUSIC.EAT = game.add.audio('eat', 1., false);
		MUSIC.ROW = game.add.audio('row', 1., false);
		MUSIC.BACK = game.add.audio('back', 1., false);
		MUSIC.DEAD = game.add.audio('beep', 1., false);
		game.state.start('menu');
		//game.state.start('game');
	},
	shutdown: () => {
		LAST_GAME_STATE = 'preload';
	}
};
