/* input.js */

const DEFAULT_BINDS = [{
	up: Phaser.KeyCode.UP,
	down: Phaser.KeyCode.DOWN,
	left: Phaser.KeyCode.LEFT,
	right: Phaser.KeyCode.RIGHT
}, {
	up: Phaser.KeyCode.W,
	down: Phaser.KeyCode.S,
	left: Phaser.KeyCode.A,
	right: Phaser.KeyCode.D
}];

/**
 * Input manager that doesn't mind to be used with pads. Translates controller
 * actions (e.g. KeyCode.W) into terms of gameplay actions (e.g. player1.jump).
 */
class Input {
	/** To be called on game create. Uses Phaser's game.input objects. */
	constructor() {
		let cursor = game.input.keyboard.createCursorKeys();
		if (this.pads_supported) {
			game.input.gamepad.start();
		}
		/**
		 * Action container for players. p[0] is for player one, p[1] - for
		 * player 2, etc. Members contain hash-map with action names as keys
		 * and [Key]{@link Key} objects as values.
		 * @member {list}
		 */
		this.p = [{}, {}];
		/*_.each(cursor, (key, idx) => {
			this.p[0][idx] = new Key(game.input.keyboard, key.keyCode);
		});
		this.p[1] = {
			'up': new Key(game.input.keyboard, Phaser.KeyCode.W),
			'down': new Key(game.input.keyboard, Phaser.KeyCode.S),
			'left': new Key(game.input.keyboard, Phaser.KeyCode.A),
			'right': new Key(game.input.keyboard, Phaser.KeyCode.D)
		};*/
		// TODO do this when pad is connected
		this.restore();
	}
	/**
	 * Returns true when the browser supports gamepad input.
	 * @member {boolean}
	 * @readonly
	 */
	get pads_supported() {
		return game.input.gamepad.supported;
	}
	/**
	 * A procedure for key binding. Press a key on any controller after this
	 * function is called to bind it to the specified action.
	 * @param {number} player - an id of a player (an index from
	 * [p]{@link Input#p})
	 * @param {string} key_name - an action name (a key from p[player])
	 */
	setup(player, key_name) {
		let ready = false;
		let reset = () => {
			game.input.keyboard.removeCallbacks();
			// TODO create removeCallbacks in phaser.js and push
			game.input.gamepad.addCallbacks(this, {
				onAxis: () => {},
				onDown: () => {}
			});
			console.log('done');
		}
		game.input.keyboard.addCallbacks(this, null, () => {
			if (!ready) return;
			// set a key
			this.p[player][key_name] = new Key(
				game.input.keyboard,
				game.input.keyboard.lastKey.keyCode
			);
			reset();
		});
		if (this.pads_supported) {
			game.input.gamepad.addCallbacks(this, {
				onAxis: (pad, axis, val) => {
					if (!ready) return;
					this.p[player][key_name] = new Key(
						pad,
						val < 0 ? -1 : 1,
						axis
					);
					reset();
				},
				onDown: (button, val, pad_idx) => {
					if (!ready) return;
					this.p[player][key_name] = new Key(
						// СВЯТАЯ ДЕВА МАРИЯ, КАКОЙ ИЗВЕРГ ЭТО ПРИДУМАЛ?
						game.input.gamepad[`pad${pad_idx+1}`],
						button
					);
					reset();
				}
			});
		}
		if (!this.pads_supported) {
			console.warn('No gamepads for you, folk.');
		}
		ready = true;
		console.log('Press a key.');
	}
	// TODO handle a memory shortage problem by removing bindings for devices
	//      with lowest timestamp (update it every time someone uses given dev)
	/** Saves current bindings into a localStorage. */
	save() {
		if (typeof(Storage) === 'undefined') {
			console.warn("There is no Storage, so I can't save key bindings.");
			return;
		}
		let ds = JSON.parse(localStorage.ds || '[]');
		let ks = [];
		// reset before changing
		localStorage.removeItem('ks');
		for (let p = 0; p < this.p.length; ++p)
		for (let a in this.p[p]) {
			let key = this.p[p][a];
			// defaults are not stored
			if (
				key.dev === game.input.keyboard
				&& key.key.keyCode === DEFAULT_BINDS[p][a]
			) continue;

			// add an unknown device to devices list
			if (
				key.dev !== game.input.keyboard
				//&& key.dev._rawPad
				&& _.find(ds, (x) => {return x.id === key.dev._rawPad.id})
					=== undefined
			) {
				// timestamp in minutes is needed to remove unused
				// configurations when out of memory
				ds.push({
					'id': key.dev._rawPad.id,
					't': Math.floor(Date.now() / 60000)
				});
			}

			ks.push({
				'p': p,
				'a': a,
				'd': key.dev === game.input.keyboard ?
					-1 : _.findIndex(ds, (x) => {
						return x.id === key.dev._rawPad.id;
					}),
				'k': key.keycode || key.key.keyCode,
				'ax': key.axis
			});
		}
		localStorage['ds'] = JSON.stringify(ds);
		localStorage['ks'] = JSON.stringify(ks);
	}
	/** @todo load the layout from localStorage */
	restore() {
		let ds = null;
		let ks = null;
		if (typeof(Storage) !== 'undefined') {
			ds = JSON.parse(localStorage.ds || '[]');
			ks = JSON.parse(localStorage.ks || '[]');
			let pads = game.input.gamepad._gamepads;
			// is needed to change timestamps on gamepads
			let ls_ds = JSON.parse(localStorage.ds || '[]');
			for (let i = 0; i < ds.length; ++i) {
				let pad = _.find(pads, (p) => {
					return p._rawPad && ds[i].id === p._rawPad.id;
				});
				if (pad === undefined) continue;
				ds[i]['d'] = pad;
				ls_ds[i]['t'] = Math.floor(Date.now() / 60000);
			}
			localStorage.ds = JSON.stringify(ls_ds);
		} else {
			console.warn("There is no Storage. Dafaults will be loaded.");
		}

		for (let p = 0; p < DEFAULT_BINDS.length; ++p)
		for (let a in DEFAULT_BINDS[p]) {
			// set a custom binding
			// if not available, set default
			let key = _.find(ks, (k) => {
				return k.p === p && k.a === a;
			})
			if (key !== undefined && (key.d === -1 || ds[key.d].d)) {
				this.p[p][a] = new Key(
					key.d === -1 ? game.input.keyboard : ds[key.d].d,
					key.k,
					key.ax !== null ? key.ax : undefined
				);
			} else {
				this.p[p][a] = new Key(game.input.keyboard,
					DEFAULT_BINDS[p][a]);
			}
		}
	}
	/** @todo remove the layout info from localStorage and restore defaults */
	reset() {
		localStorage.removeItem('ks');
		localStorage.removeItem('ds');
		this.restore();
	}
}

/**
 * Provides an universal interface for both keyboard and gamepad event
 * handling. Possibly lacks some events available in Phaser (see
 * [docs]{@link https://photonstorm.github.io/phaser-ce/Phaser.Key.html#toc-4}),
 * feel free to add your properties.
 */
class Key {
	/**
	 * Create a key.
	 * @param {Phaser.Keyboard|Phaser.SinglePad} dev - device to listen to
	 * @param {number} keycode - code of the key or a value of an axis (when
	 * the key represents axis, should be -1 or 1 in this case)
	 * @param {number} axis - (optional) axis number when a key is an axis
	 */
	constructor(dev, keycode, axis) {
		/**
		 * Device of this key.
		 * @member {Phaser.Keyboard|Phaser.SinglePad}
		 */
		this.dev = dev;
		/**
		 * Axis number when a key is an axis.
		 * @member {boolean}
		 */
		this.axis = null;
		if (dev === game.input.keyboard) {
			/**
			 * When [Key.dev]{@link Key#dev} is a Phaser.Keyboard this is the
			 * Phaser.Key object corresponding to this key.
			 * @member {Phaser.Key|null}
			 */
			this.key = dev.addKey(keycode);
			/**
			 * When [Key.dev]{@link Key#dev} is a Phaser.SinglePad this is the
			 * keycode corresponding to this key.
			 * @member {number|null}
			 */
			this.keycode = null;
		} else {
			this.keycode = keycode;
			this.key = null;
			this.axis = axis === undefined ? null : axis;
		}

		// seems like SinglePad's default justReleased is a piece of crap
		// so this is an alterantive representation that works as expected
		if (this.dev !== game.input.keyboard && this.axis === null) {
			this._butJR = false;
			dev.addCallbacks(this, {
				onUp: (btn, val) => {
					if (btn !== this.keycode) return;
					this._butJR = true;
					let timer = game.time.create();
					timer.add(250, () => {
						this._butJR = false;
					}, this);
					timer.start();
				}
			});
		}

		// our brand new justReleased hack for axes
		if (this.axis !== null) {
			// a value for justReleased to be returned
			this._axisJR = false;
			// previous value is needed to compute a direction of
			// an axis' movement
			this._last_axis = 0;
			dev.addCallbacks(this, {
				onAxis: (pad, axis, value) => {
					// can this really happen? 0_o
					if (pad !== dev) return;
					if (axis !== this.axis) return;
					if (value !== 0) {
						this._last_axis = value;
						return;
					}
					// computing a direction
					if (this._last_axis * this.keycode < 0) return;
					this._last_axis = value;
					if (!this.isDown && !this._axisJR) {
						this._axisJR = true;
						let timer = game.time.create();
						timer.add(250, () => {
							this._axisJR = false;
						}, this);
						timer.start()
					}
				}
			});
		}
	}
	/**
	 * Interface for Phaser's isDown event.
	 * @member {boolean}
	 * @readonly
	 */
	get isDown() {
		if (this.key) {
			return this.key.isDown;
		} else if (this.axis !== null) {
			let axis_val = this.dev.axis(this.axis); 
			// dev.axis() returns false when in dead zone
			if (axis_val === false) return false;
			// fire only when the sign is the same
			if (axis_val * this.keycode < 0) return false;
			return true;
		} else {
			return this.dev.isDown(this.keycode);
		}
	}
	/**
	 * Interface for Phaser's justPressed event.
	 * @member {boolean}
	 * @readonly
	 */
	get justReleased() {
		if (this.key) {
			return this.key.justReleased();
		} else if (this.axis !== null) {
			let jr = this._axisJR;
			this._axisJR = false;
			return jr;
		} else {
			//return this.dev.justReleased(this.keycode);
			let jr = this._butJR;
			this._butJR = false;
			return jr;
		}
	}
	/** @todo return a string representation of a key */
	show() {}
}
