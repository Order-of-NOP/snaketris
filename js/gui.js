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
    BTN: TxtStyle('Arial', '32px', '#ccc'),
    LBL_TTL: TxtStyle('Arial', '48px', '#eee'),
    LBL_SCR: TxtStyle('Arial', '18px', '#ccc')
};

function clear_gui(GUI)
{
    for(let key in GUI) {
        _.each(GUI[key], (e)=>{ e.destroy(); });
        GUI[key] = [];
    }
}

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