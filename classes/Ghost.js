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


    /* shortestPathToSnacMan - return shortest path coordinates from ghost to snaccman */
    shortestPathToSnacMan(snaccman, ghost) {
        // let ghostPos = [ghost.x, ghost.y]
        // let snacManPos = [snaccman.x, snaccman.y]
        /* set up valid positions that the ghost can travel to */
        // let visited_grid = this.setUpVisitedNodes(grid);
        /* pred - holds the previous objects the ghost has traveled to */
        let queue = [];
        let visited = [];
        let path = {};
        queue.push(ghost);
        while (queue.length > 0) {
            let currentGhostPosition =  queue.shift();
            visited.push(currentGhostPosition);
            if (currentGhostPosition == snaccman) {
               return path; 
            }
            let ghostValidPositions =  currentGhostPosition.neighbors;
            for (let i = 0; i < ghostValidPositions.length; i++) {
                if (visited.includes(ghostValidPositions[i]) === false) {
                    queue.push(ghostValidPositions[i]);
                    path[ghostValidPositions[i]] = currentGhostPosition;
                }
            }
        }
    }
}

export default Ghost;