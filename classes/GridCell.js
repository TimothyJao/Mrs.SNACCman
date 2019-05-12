class GridCell {
    constructor(grid, position) {
<<<<<<< HEAD
        this.grid = grid
        this.x = position[0]
        this.y = position[1]
=======
        this.grid = grid,
            this.x = position[0],
            this.y = position[1];
    }
    wrapX(x){
        return ((x%this.grid.length)+this.grid.length)%this.grid.length;
    }
    wrapY(y){
        return ((y%this.grid[0].length)+this.grid[0].length)%this.grid[0].length;
>>>>>>> 40a24a4d16c85ab98748f2ed0b55cdaccfd3029d
    }
    //These set of functions determine if an entity can move in the given direction.
    //Tests if the movement cannot wrap, the entity is on the border  
    //and if they next move would cause the entity to run into a wall.

    canMoveUp() {
        if ((this.y === 0) || this.grid[this.x][this.wrapY(this.y-1)] ==="X") {
            return false;
        } else {
            return true;
        }
    }

    canMoveLeft() {
        if ((this.x === 0) || this.grid[this.wrapX(this.x-1)][this.y] === "X"){
            return false;
        } else {
            return true;
        }
    }

    canMoveDown() {
        if ((this.y === this.grid.length - 1) || this.grid[this.x][this.wrapY(this.y+1)] === "X") {
            return false;
        } else {
            return true;
        }
    }

    canMoveRight() {
        if ((this.x === this.grid[0].length - 1 || this.grid[this.wrapX(this.x+1)][this.y] === "X")){
            return false;
        } else {
            return true;
        }
    }
}

export default GridCell;