class GridCell {
    constructor(grid, position) {
        this.grid = grid,
            this.x = position[0],
            this.y = position[1];
    }
    wrapX(x){
        return ((x%this.grid.length)%this.grid.length);
    }
    wrapY(y){
        return ((y%this.grid[0].length)+this.grid[0].length)%this.grid[0].length;
    }
    //These set of functions determine if an entity can move in the given direction.
    //Tests if the movement cannot wrap, the entity is on the border  
    //and if they next move would cause the entity to run into a wall.

    canMoveUp() {
        if(this.up !== undefined) return this.up;
        if ((this.y === 0) || this.grid[this.x][this.wrapY(this.y-1)] ==="X") {
            this.up = false;
        } else {
            this.up = true;
        }
        return this.up;
    }

    canMoveLeft() {
        if (this.left !== undefined) return this.left;
        if (((this.x === 0) || this.grid[this.wrapX(this.x - 1)][this.y] === "X") && (this.y != 13 || this.x != 0)){
            this.left = false;
        } else {
            this.left = true;
        }
        return this.left;
    }

    canMoveDown() {
        if (this.down !== undefined) return this.down;
        if ((this.y === this.grid[0].length - 1) || this.grid[this.x][this.wrapY(this.y + 1)] === "X" || this.grid[this.x][this.wrapY(this.y + 1)] === "G") {
            this.down = false;
        } else {
            this.down = true;
        }
        return this.down;
    }

    canMoveRight() {
        if (this.right !== undefined) return this.right;
        if ((this.x === this.grid.length - 1 || this.grid[this.wrapX(this.x + 1)][this.y] === "X") && (this.y != 13 || this.x != this.grid.length-1)){
            this.right = false;
        } else {
            this.right = true;
        }
        return this.right;
    }
}

export default GridCell;