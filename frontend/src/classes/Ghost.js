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
}

export default Ghost;