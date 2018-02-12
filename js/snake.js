/* snake.js */
class Snake
{
	constructor(_x, _y) {
		this.reset(_x, _y);
	}
	
	reset(_x, _y) {
		this.dirs = {
			left: [-1, 0],
			right: [1, 0],
			down: [0, 1],
			up: [0, -1]
		};

        this.cur_dir = 'right';
        
		this.seg = [
			[_x, _y],
			[_x - 1, _y],
			[_x - 1, _y]
        ];
	}

	get_head() { return this.seg[0]; }
    
    get_tail() { return this.seg[this.seg.length - 1]}
    
	push_seg() { 
		let n = this.seg.length - 1;
		let _x = this.seg[n][0];
		let _y = this.seg[n][1];
		this.seg.push([_x, _y]); 
	}
	
	set_pos(li) { this.seg = li; }
	
	set_dir(dir) {
		if (dir != 'left' && dir != 'right' && dir != 'up' && dir != 'down'){
			console.warn('Incorrect dir for snake');
			return false;
		}
		switch(dir) {
			case 'left': {
				if (this.cur_dir == 'right') return false;
			} break;
			case 'right': {
				if (this.cur_dir == 'left') return false;
			} break;
			case 'up': {
				if (this.cur_dir == 'down') return false;
			} break;
			case 'down': {
				if (this.cur_dir == 'up') return false;
			} break;
		}
		this.cur_dir = dir; //this.dirs[dir];
		console.log('dir set ', this.cur_dir);
		return true;
	}
	
	move() {
		// set last direction
		let n_c = [];
		// copy position
		for(let i = 0; i < this.seg.length; i++)
			n_c.push([ this.seg[i][0], this.seg[i][1] ])
		// moving body
		for(let i = n_c.length - 1; i > 0; i--) {
			n_c[i][0] = n_c[i-1][0];
			n_c[i][1] = n_c[i-1][1];
		}
		// moving head
		n_c[0][0] += this.dirs[this.cur_dir][0];
		n_c[0][1] += this.dirs[this.cur_dir][1];
		// returnign new position
		return n_c;
	}
	
    cut(index) {
		if (index < 0 || index > this.seg.length - 1)
			return [];
        let tl = this.seg.slice(0, index);
        let tr = this.seg.slice(index);
        this.seg = tl;
        return tr;
    }
}