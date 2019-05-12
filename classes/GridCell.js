class GridCell {
    constructor(grid, position) {
        this.grid = grid,
            this.x = position[0],
            this.y = position[1]
    }

    //These set of functions determine if an entity can move in the given direction.
    //Tests if the movement cannot wrap, the entity is on the border  
    //and if they next move would cause the entity to run into a wall.

    canMoveUp() {
        if (((this.x === 0) || this.grid[this.x - 1][this.y] === "X")) {
            return false;
        } else {
            return true;
        }
    }

    canMoveLeft() {
        if (((this.y === 0) || this.grid[this.x][this.y - 1] === "X") && (this.x != 13 && this.y != 0)) {
            return false;
        } else {
            return true;
        }
    }

    canMoveDown() {
        if ((this.x === this.grid.length - 1) || this.grid[this.x + 1][this.y] === "X" || this.grid[this.x][this.y] === "G" || this.grid[this.x + 1][this.y] === "G") {
            return false;
        } else {
            return true;
        }
    }

    canMoveRight() {
        if ((this.x === this.grid[0].length - 1 || this.grid[this.x][this.y + 1] === "X") && (this.x != 13 && this.y != this.grid.length-1)){
            return false;
        } else {
            return true;
        }
    }
}

export default GridCell