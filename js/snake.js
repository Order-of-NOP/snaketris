/* snake.js */
class Snake
{
	constructor(_x, _y) {

		this.dirs = {
			left: {x: -1, y: 0},
			right: {x: 1, y: 0},
			down: {x: 0, y: 1},
			up: {x: 0, y: -1}
		};

        this.cur_dir = 'left';
        
		this.seg = [
            {x: _x,     y: _y},
            {x: _x + 1, y: _y},
			{x: _x + 2, y: _y}
        ];
    }

	get_head() { return this.seg[0]; }
    
    get_tail() { return this.seg[this.seg.length - 1]}
    
	push_segment(_x, _y) { this.seg.push({x: _x, y: _y}); }
	
	set_pos(li) { this.seg = li; }
	
	set_dir(dir) {
		if (dir != 'left' || dir != 'right' || dir != 'up' || dir != 'down'){
			return false;
		}
		this.cur_dir = this.dirs[dir];
		return true;
	}

	move() {
		// set last direction
		let _x = this.cur_dir.x;
		let _y = this.cur_dir.y;

		let n_c = [];
		// copy position
		for(let i = 0; i < this.seg.length; i++)
			n_c.push({ x: this.seg[i].x, y: this.seg[i].y })
		// moving body
		for(let i = n_c.length - 1; i > 0; i--) {
			n_c[i].x = n_c[i-1].x;
			n_c[i].y = n_c[i-1].y;
		}
		// moving head
		n_c[0].x += _x;
		n_c[0].y += _y
		// returnign new position
		return n_c;
	}
	
    cut(index) {
        let tl = this.seg.slice(0, index);
        let tr = this.seg.slice(index);
        this.seg = tl;
        return tr;
    }
}