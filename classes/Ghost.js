import Entity from "./Entity"

class Ghost extends Entity {
    constructor(x, y, type="ghost", velocity=[1, 0]){
        super(x, y, type, velocity)
    }

    setUpVisitedNodes(grid) {
        let visited = grid;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 'P' || grid[i][j] === 'B' || grid[i][j] === 'G') {
                    visited[i][j] = false;
                } else {
                    visited[i][j] = true;
                }
            }
        }
        return 1;
    }

    shortestPathToSnacMan(grid, snaccman) {
        let ghost = [this.x, this.y]
        let snacMan = [snaccman.x, snaccman.y]
        /* set up valid positions that the ghost can travel to */
        visited_grid = setUpVisitedNodes(grid);
        /* pred - holds the previous objects the ghost has traveled to */
        let pred = [];


        /* bfs traversal */

    }


    nextMove(){}
    
    setPos(pos){
        this.pos = pos;
    }
}

export default Ghost