var BTN_STYLE = {
    font: "bold 32px Arial",
    fill: "#ccc"
};

class ButtonLabel
{
    constructor (on_click, text, style, y)
    {
        this.btn = game.add.button(0, 0, 'sheet', on_click, this );
        this.lbl = game.add.text(0, 0, text, style);
        this.center_x(y);
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