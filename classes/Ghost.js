import Entity from "./Entity"

class Ghost extends Entity {
    constructor(x, y, type="ghost", velocity=[1, 0]){
        super(x, y, type, velocity)
    }

    shortestPathToSnacMan(grid, snaccman) {
        let ghost = [this.x, this.y]
        let snacMan = [snaccman.x, snaccman.y]

        /* set up valid positions that the ghost can travel to */
        let visited = grid; 
        for (let i = 0; i < grid.length; i++) {
            for (j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === (Entity.type === "ghost" || Entity.type === "snaccman")) {
                    visited[i][j] === false;
                } else {
                    visited[i][j] === true;
                }
            }
        }
    }


    nextMove(){}
    
    setPos(pos){
        this.pos = pos;
    }
}

export default Ghost