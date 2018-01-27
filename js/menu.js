/* menu.js */
// ST for states
const ST = {
	MENU: 0,
	TUTOR1: 1,
	TUTOR2: 2,
	GAME: 3,
	OVER: 4
};

let game_state = ST.GAME;

function change_slide() {
	switch (game_state) {
		case ST.MENU:
			document.getElementById('menu').classList.add('hidden');
			document.getElementById('tutor1').classList.remove('hidden');
			game_state = ST.TUTOR1;
		break;
		case ST.TUTOR1:
			document.getElementById('tutor1').classList.add('hidden');
			document.getElementById('tutor2').classList.remove('hidden');
			game_state = ST.TUTOR2;
		break;
		case ST.TUTOR2:
			document.getElementById('tutor2').classList.add('hidden');
			document.getElementById('hud').classList.remove('hidden');
			game_state = ST.GAME;
			newGame();
		break;
		case ST.GAME:
			let span = document.querySelector('#score span');
			span.innerHTML = scores.toString();
			document.getElementById('hud').classList.add('hidden');
			document.getElementById('gameover').classList.remove('hidden');
			game_state = ST.OVER;
		break;
		case ST.OVER:
			document.getElementById('gameover').classList.add('hidden');
			document.getElementById('menu').classList.remove('hidden');
			game_state = ST.MENU;
		break;
	}
}
