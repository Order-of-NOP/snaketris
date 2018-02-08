/* snake.js */
class Snake
{
	constructor(_x, _y) {

		this.dirs = {
			left: [-1, 0],
			right: [1, 0],
			down: [0, 1],
			up: [0, -1]
		};

        this.cur_dir = 'left';
        
		this.seg = [
			[_x, _y],
			[_x + 1, _y + 1],
			[_x + 2, _y + 2]
        ];
    }

	get_head() { return this.seg[0]; }
    
    get_tail() { return this.seg[this.seg.length - 1]}
    
	push_segment(_x, _y) { this.seg.push([_x, _y]); }
	
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
		let n_c = [];
		// copy position
		for(let i = 0; i < this.seg.length; i++)
			n_c.push([ this.seg[i].x, this.seg[i].y ])
		// moving body
		for(let i = n_c.length - 1; i > 0; i--) {
			n_c[i][0] = n_c[i-1][0];
			n_c[i][1] = n_c[i-1][1];
		}
		// moving head
		n_c[0][0] += this.cur.dir[0];
		n_c[0][1] += this.cur_dir[1];
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