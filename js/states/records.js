/* states/records.js */

class ScoreTable
{
	constructor(len) {
		this.tab = [];
		this.len = len || 10; 
		this.iDB = window.indexedDB;
		this.hil = {name: null, score: null};
		if (!this.iDB) {
			console.warn('No indexDB. Highscore table won\'t be saved.');
		} else {
			let req = this.iDB.open('snaketris', 11);
			req.onerror = (e) => {
				console.error(`No can do. Have got an error.`);
				console.log(e);
			};
			req.onsuccess = (e) => {
				this.db = e.target.result;
				this.db.onerror = (evt) => {
					console.error('Database error: ' + evt.target.errorCode);
				}
			};
			req.onupgradeneeded = (e) => {
				let db = e.target.result;
				let objStore = db.createObjectStore('highscores',
					{ autoIncrement : true });
				objStore.createIndex('name', 'name', { unique: false });
				objStore.createIndex('score', 'score', { unique: false });
			};
		}
	}
	load_best(callback) {
		this.tab = [];
		let idx = this.db
			.transaction(['highscores'])
			.objectStore('highscores')
			.index('score');
		idx.openCursor(null, 'prev').onsuccess = (e) => {
			let cursor = e.target.result;
			if (cursor) {
				this.tab.push(cursor.value);
				if (this.tab.length >= this.len) {
					if (callback) callback();
					return;
				}
				cursor.continue();
			} else {
				if (callback) callback();
				return;
			}
		};
	}
	check(sc, callback) {
		this.load_best(() => {
			callback(this.tab.length < this.len || _.last(this.tab).score < sc);
		});
	}
	add(sc, name) {
		let req = this.db
			.transaction(['highscores'], 'readwrite')
			.objectStore('highscores')
			.add({ name: name, score: sc });
		req.onsuccess = (e) => {
			this.hil.name = name;
			this.hil.score = sc;
		};
	}
}

let score_tab = new ScoreTable();
const RECORDS = new Gui();

states['records'] = {
	init: () => {
		bg_sprite = game.add.tileSprite(0, 0,
			game.cache.getImage('background').width,
			game.cache.getImage('background').height, 'background');
	},
	create: () => {
		let x = 100;
		let y = 25;
		let dy = 35;
		RECORDS.add_text(x, y, 'High scores', TXT_STL.LBL_TTL);
		// I double this
		y += dy;
		score_tab.load_best(() => {
			let tab = score_tab.tab;
			for (let i = 0; i < tab.length; ++i) {
				y += dy;
				RECORDS.add_text(x, y,
					`${i+1}. ${tab[i].name} - ${tab[i].score}`,
					tab[i].name === score_tab.hil.name
					&& tab[i].score === score_tab.hil.score
					? TXT_STL.LBL_HIGHLIGHT
					: TXT_STL.LBL_SCR);
			}
			score_tab.hil = {name: null, score: null};
			RECORDS.add_btn(() => {
				game.state.start('menu');
			}, 'To main menu', TXT_STL.BTN);
			_.last(RECORDS.GUI.BTNS).back();
		});
	},
	shutdown: () => {
		LAST_GAME_STATE = 'records';
	}
}
