import {Entity, GHOST} from "./Entity";
// import {SNACCMAN, PELLET, BIG_PELLET} from "./Entity";
import { debug } from "util";

class Ghost extends Entity{
    constructor(x, y, type=GHOST, velocity){
        super(x, y, type, velocity)
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
        //debugger 
        let visited = grid;
        // for (let i = 0; i < grid.length; i++) {
        //     for (let j = 0; j < grid[i].length; j++) {
        //         if (grid[i][j] ===  || grid[i][j] === ) {
        //             visited[i][j] = false;
        //         } else {
        //             visited[i][j] = true;
        //         }
        //     }
        // }
        return visited;
    }

    /* shortestPathToSnacMan - return shortest path coordinates from ghost to snaccman */
    shortestPathToSnacMan(snaccman, ghost) {
        // let ghostPos = [ghost.x, ghost.y]
        // let snacManPos = [snaccman.x, snaccman.y]
        /* set up valid positions that the ghost can travel to */
        // let visited_grid = this.setUpVisitedNodes(grid);
        /* pred - holds the previous objects the ghost has traveled to */
        // let pred = []
        let queue = [];
        let visited = [];
        let path = {};
        queue.push(ghost)
        while (!queue) {
            let currentGhostPosition =  queue.shift();
            visited.push(ghost)
            if (currentGhostPosition == snaccman) {
               return path; 
            }
            let ghostValidPositions =  currentGhostPosition.neighbors;
            for (let i = 0; i < ghostValidPositions.length; i++) {
                queue.push(ghostValidPositions[i]);
                path[ghostValidPositions[i]] = currentGhostPosition;
            }
        }
    }
}

export default Ghost;