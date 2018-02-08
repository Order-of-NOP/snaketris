/* snake.js */
class Snake
{
	constructor(_x, _y) {
        this.cur_dir = 3;
        
		this.seg = [
            {x: _x,     y: _y},
            {x: _x + 1, y: _y},
			{x: _x + 2, y: _y}
        ];

		this.dirs = [
			{ x: 0, y: -1 },
			{ x: 0, y: 1 },
			{ x: -1, y: 0 },
			{ x: 1, y: 0 }
		];
    }

	get_head() { return this.seg[0]; }
    
    get_tail() { return this.seg[this.seg.length - 1]}
    
    push_segment(_x, _y) { this.seg.push({x: _x, y: _y}); }
    
	move() {
		// move mines from second to last blocks
		for(let i = this.seg.length - 1; i > 0; i--) {
			this.seg[i].x = this.seg[i-1].x;
			this.seg[i].y = this.seg[i-1].y;
		}
		// move head
		this.seg[0].x += this.dirs[this.dir].x;
		this.seg[0].y += this.dirs[this.dir].y
    }

    cut(index) {
        let tl = this.seg.slice(0, index);
        let tr = this.seg.slice(index);
        this.seg = tl;
        return tr;
    }
}