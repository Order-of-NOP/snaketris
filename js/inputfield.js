class InputField {
	constructor(x, y) {
		this._active = false;
		this._over;

		this.x = x;
		this.y = y;
		this.w = 220;
		this.h = 24;

		this.color = '#ccc';
		this.color_ph = '#aaa';
		this.color_line = 0xcccccc;
		this.color_active = 0xff00ff;

		this.line = game.add.graphics(x, y + this.h);
		this.line.lineStyle(2, this.color_line, 1);
		this.line.moveTo(0, 0);
		this.line.lineTo(this.w, 0);

		this.btn = game.add.button(this.x, this.y, 'sheet', () => {
			this.active = true;
		}, this);
		this.btn.width = this.w;
		this.btn.height = this.h;
		this.btn.alpha = 0;
		this.btn.onInputOver.add(() => {
			this._over = true;
		}, this);
		this.btn.onInputOut.add(() => {
			this._over = false;
		}, this);
		game.input.onDown.add((ptr, evt) => {
			if (ptr.clientX < this.x || ptr.clientX > this.x + this.w
				|| ptr.clientY < this.y || ptr.clientY > this.y + this.h) {
				this.active = false;
			}
		}, this);

		this.ph_text = 'Put your names here'
		this.limit = this.ph_text.length - 3;
		this.ph = game.add.text(this.x, this.y, this.ph_text, {
			font: 'Rinder',
			fontSize: '24px',
			fill: this.color_ph
		});

		this.value = '';
		this.text = game.add.text(this.x, this.y, this.value, {
			font: 'Rinder',
			fontSize: '24px',
			fill: this.color
		});

		this.caret = game.add.graphics(x, y);
		this.caret.beginFill(this.color_line);
		this.caret.drawRect(0, 0, 12, this.h);
		this.caret.endFill();
		this.caret.visible = false;
		//this.ph.setTextBounds(this.x, this.y + this.h, this.w, this.h);
	}
	get active() {
		return this._active;
	}
	set active(v) {
		let val = !!v;
		if (val) {
			this.ph.visible = false;
			this.caret.visible = true;
			//game.input.keyboard.clearCaptures();
			// TODO remove this hardcode when input is bindable
			game.input.keyboard.removeKeyCapture(Phaser.KeyCode.W);
			game.input.keyboard.removeKeyCapture(Phaser.KeyCode.A);
			game.input.keyboard.removeKeyCapture(Phaser.KeyCode.S);
			game.input.keyboard.removeKeyCapture(Phaser.KeyCode.D);
			game.input.keyboard.addCallbacks(this, (e) => {
				if (e.keyCode === 8) {
					this.value = _.initial(this.value).join('');
					this.text.text = this.value;
					this.caret.x = this.x + this.text.width;
				} else if (e.keyCode === 13) {
					this.active = false;
				}
			}, null, (ch) => {
				if (this.value.length === this.limit) return;
				this.value = this.value.concat(ch);
				this.text.text = this.value;
				this.caret.x = this.x + this.text.width;
			});
		} else {
			if (this.value.length === 0) {
				this.ph.visible = true;
			}
			this.caret.visible = false;
			game.input.keyboard.removeCallbacks();
		}
		this._active = val;
	}
	set val(name) {
		this.active = true;
		this.value = name;
		this.text.text = name;
		this.caret.x = this.x + this.text.width;
		this.active = false;
	}
}
