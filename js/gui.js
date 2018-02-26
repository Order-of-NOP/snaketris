function TxtStyle(_ff = 'Arial', _fsz = '32px', _fc = '#fff', _fw = '', _fst = '')
{
    return { font: _ff, // Arial
        fontStyle: _fst, // Italic etc
        fontWeight: _fw, // Bold etc
        fontSize: _fsz, // Size in pixels 
        fill: _fc // fill color
    };
}
// there is all styles for text
const TXT_STL = {
    BTN: TxtStyle('Rinder', '32px', '#ccc'),
    LBL_TTL: TxtStyle('Rinder', '48px', '#eee'),
    LBL_SCR: TxtStyle('Rinder', '18px', '#ccc')
};


class ButtonLabel
{
    constructor (on_click, text, style, y)
    {
        this.btn = game.add.button(0, 0, 'sheet', on_click, this);
        this.lbl = game.add.text(0, 0, text, style);
        this.btn.width = this.lbl.width;
        this.btn.height = this.lbl.height < 50 ? 50 : this.lbl.height;
        this.btn.alpha = 0.0;
        this.center_x(y);
        this.colors = [0xaa55aa, 0xffffff, 0xafaf77];
        // creating animation on over and out
        this.btn.events.onInputOver.add(()=>{
            this.lbl.tint = this.colors[0];
        }, this);
        this.btn.events.onInputOut.add(()=>{
            this.lbl.tint = this.colors[1];
        }, this);
        this.btn.events.onInputDown.add(()=>{
            this.lbl.tint = this.colors[2];
        }, this);
    }

    choose(ind) {
        if (typeof(ind) != 'number'){
            console.warn('ERR, ind not number');
            return;
        }
        if (ind != 0 && ind != 1 && ind != 2) {
            console.warn('ERR, ind not in [0,1,2]');
            return;
        }
        this.lbl.tint = this.colors[ind];
    }

    back()
    {
        this.btn.x = 10;
        this.btn.y = game.world.height - this.btn.height;
        this.__center();
    }

    __center()
    {
        this.lbl.centerX = this.btn.centerX;
        this.lbl.centerY = this.btn.centerY;
    }

    set_x(_x)
    {
        this.btn.position.x = _x;
        this.__center();
    }

    center_x(_y)
    {
        if (typeof(_y) !== 'number') {
            console.warn('y not a number');
        }
        this.btn.centerX = game.world.centerX;
        this.btn.y = _y;
        this.__center();
    }

    destroy()
    {
        this.btn.destroy();
        this.lbl.destroy();
    }
}

class Gui
{
    constructor() {
        this.GUI = {
            BTNS: [],
            LBLS: [],
        }
        this.CLLBCKS = [];
        this.select_ind = 0;
        this.__Y0 = 120;
        this.__stepY = 60;
    }

    set_x(_x) {
        _.each(this.GUI.BTNS, (e)=>{ e.set_x(_x); });
        _.each(this.GUI.LBLS, (e)=>{ e.position.x = _x; });
    }

    __choose(dir) {
        this.GUI.BTNS[this.select_ind].choose(1);
        this.select_ind = MOD(this.select_ind, dir, this.GUI.BTNS.length);
        this.GUI.BTNS[this.select_ind].choose(0);
    }

    next() { this.__choose(1); }
    prev() { this.__choose(-1); }
    call() { this.CLLBCKS[this.select_ind](); }

    add_btn(callback, text, style) {
        this.CLLBCKS.push(callback);
        let y = this.__Y0 + this.GUI.BTNS.length *this.__stepY;
        this.GUI.BTNS.push( new ButtonLabel(callback, text, style, y));
    }

    add_text(x, y, text, style) {
        this.GUI.LBLS.push(game.add.text(x, y, text, style));
    }

    init_ind() {
        this.select_ind = 0;
        this.GUI.BTNS[this.select_ind].choose(0);
    }

    clear() {
        for(let key in this.GUI) {
            _.each(this.GUI[key], (e)=>{ e.destroy(); });
            this.GUI[key] = [];
        }
        this.CLLBCKS = [];
        this.select_ind = 0;
    }

    btn_choose() {
        for(let i = 0; i < input.p.length; i++) {
			let ip = input.p[i];
			if (ip['down'].justReleased){
				this.next();
			} else 
			if (ip['up'].justReleased){
				this.prev();
			} else
			if (ip['right'].justReleased) {
				this.call();
			}
		}
    }
}
