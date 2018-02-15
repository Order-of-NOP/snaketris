class SnakeSpawner {
    constructor (_g) {
        this.animation = {
            delay: 10,
            alpha: 0.0,
            flash_dx: 0.1
        };
        this.choices = ['left', 'right'];
        this._spawn = {
            delay: 3000,
            player_choice: 'right',
            position_y: 2,
            time: 0,
            max_pushs_confirms: 2,
            player_confirms: 0
        };
        this.timer = null;
        this.sprite = null;
        this.grid_g = _g;
        this.coords = {
            left: [
                [5, this._spawn.position_y],
                [4, this._spawn.position_y],
                [3, this._spawn.position_y]
            ],
            right: [
                [SIZE.W - 5, this._spawn.position_y],
                [SIZE.W - 5 + 1, this._spawn.position_y],
                [SIZE.W - 5 + 2, this._spawn.position_y]
            ]
        }
    }

    set_player_choice(dir) {
        if (typeof(dir) !== 'string' ) {
            console.warn('typeof(dir) not string');
            return false;
        }

        if (!this.choices.includes(dir)) {
            console.warn('dir not in [right, left]');
            return false;
        }

        if (this._spawn.player_choice === dir) {
            this._spawn.player_confirms++;
        } else {
            this._spawn.player_confirms = 0;
        }
        this._spawn.player_choice = dir;
        return true;
    }

    check(dir) {
        let coords = this.coords[dir];
        let flg = true;
        _.each(coords, ([x, y])=> {
            let g = this.grid_g[y][x];
            if (g === MINO_TYPE.DEAD ||
                    g === MINO_TYPE.STILL || g == MINO_TYPE.HEAVY) {
                        flg = false;
                    }
        });
        return flg;
    }

    stop() {
        if (this.timer !== null) {
            this.timer.stop(true);
            this.timer.destroy();
            this.timer = null;
        }
        if (this.sprite !== null) {
            this.sprite.destroy();
            this.sprite = null; 
        }
        this._spawn.player_confirms = 0;
        this.__spawn();
    }

    __spawn() {
        snake.alive = true;
        let pos = this.coords[this._spawn.player_choice];
        snake.reset(0,0);
        snake.set_pos(pos);
        if (this._spawn.player_choice == 'right') {
            snake.cur_dir = 'left';
        } else {
            snake.cur_dir = 'right';
        }
    }

    start() {
        snake.alive = false;
        if (this.timer !== null) this.stop();
        this.timer = game.time.create(false);
        this.timer.loop(this.animation.delay, this.timer_loop, this);
        
        if (this.sprite !== null) this.stop();
        let pos = this.coords[this._spawn.player_choice][1];
        this.sprite = game.add.sprite(pos[0]*TILE_SIZE, 
            pos[1]*TILE_SIZE, 'sheet');
        this.sprite.animations.add('simple', [3], 100, true);
        this.sprite.animations.play('simple');
        this.sprite.width = TILE_SIZE*3;
        this._spawn.time = game.time.now + this._spawn.delay;
        this.timer.start(0.0);
    }

    spawn(dir) {
        if (this.check(dir)) {
            this.start();
            return true;
        } 
        return false;
    }

    timer_loop() {
        this.animation.alpha = (this.animation.alpha + this.animation.flash_dx) % 1;
        this.sprite.alpha = this.animation.alpha;
        let pos = this.coords[this._spawn.player_choice][1];
        this.sprite.x = pos[0]*TILE_SIZE;
        this.sprite.y = pos[1]*TILE_SIZE;
        if (this._spawn.player_confirms === this._spawn.max_pushs_confirms) {
            this.stop();
        }
        if (this._spawn.time < game.time.now) {
            this.stop();
        }
    }

}
