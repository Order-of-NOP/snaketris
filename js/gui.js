const BTN_STYLE = {
    font: "bold 32px Arial",
    fill: "#ccc"
};

const LBL_RDY_STL = {
    font: "bold 18px Arial",
    fill: "#ccc"
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
        // creating animation on over and out
        this.btn.events.onInputOver.add(()=>{
            this.lbl.tint = 0xaa55aa;
        }, this);
        this.btn.events.onInputOut.add(()=>{
            this.lbl.tint = 0xffffff;
        }, this);
        this.btn.events.onInputDown.add(()=>{
            this.lbl.tint = 0xafaf77;
        }, this);
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