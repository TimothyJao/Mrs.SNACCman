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
                    path[ghostValidPositions[i].toString()] = currentGhostPosition;
                }
            }
        }
    }
}

export default Ghost;