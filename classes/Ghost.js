import {Entity, GHOST} from "./Entity"

class Ghost extends Entity{
    constructor(x, y, type=GHOST, velocity){
        super([x, y, type, velocity])
    }

    setPos(pos){
        this.pos = pos
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }


    /* getPred - returns previous elements in order */ 
    getPredInOrder(pred) {
        /* each elt in pred is an object -> extract x and y coordinates from each pred */
        let predOrder = [];
        for (let i = 0; i < pred.length; i++) {
            predOrder.unshift([pred[i].x,pred[i].y])
        }
        return predOrder;
    }

    /**setUpVisitedNodes - returns a boolean matrix of valid nodes a ghost can traverse */
    setUpVisitedNodes(grid) {
        let visited = grid;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].type === 'pellet' || grid[i][j].type === 'big pellet') {
                    visited[i][j] = false;
                } else {
                    visited[i][j] = true;
                }
            }
        }
        return 1;
    }

    /* shortestPathToSnacMan - return shortest path coordinates from ghost to snaccman */
    shortestPathToSnacMan(grid, snaccman) {
        let ghostPos = [this.x, this.y]
        let snacManPos = [snaccman.x, snaccman.y]
        /* set up valid positions that the ghost can travel to */
        visited_grid = setUpVisitedNodes(grid);
        /* pred - holds the previous objects the ghost has traveled to */
        let pred = []
        let queue = [];

         /* modified bfs traversal */
        queue.push(ghostPos)
        while (!queue) {
            let nextGhostPos = queue.shift();
            let x = nextGhostPath[0];
            let y = nextGhostPos[1];
             for (let i = 0; i < grid[x].length; i++) {
                /*  if the position has not been visisted -> visit path, and set predecessor path */
                if ((visited[grid[x][i].x][grid[x][i].y]) === false) {
                    /* update values for shortest path -> by default we dont explore the X's - ie the grids that the ai should not go through*/
                    visited[grid[x][i].x][grid[x][i].y] = true;
                    // pred[grid[x[i].x][grid[x[i].y] = grid[x[x;
                    // pred[grid[x][i].x][grid[x][i].y].push(grid[x][y]);
                    let nextToQueue = [grid[x][i].x, grid[x][i].y]
                    queue.push(nextToQueue);
                    /* push the predecesor node/object */
                    pred.push(grid[x][i])
                    /* if the coordinates match */
                    if ([grid[x][i].x, grid[x][i].y] === snacManPos) {
                        return getPredInOrder(pred);
                    }
                }
            }
        }
    }
}

export default Ghost