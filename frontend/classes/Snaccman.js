import {Entity, BIG_PELLET, PELLET, GHOST, SNACCMAN} from "./Entity"

class Snaccman extends Entity{
    constructor(x, y, type=SNACCMAN, velocity=[1,0]){
        super(x, y, type, velocity);
    }

    setVelocity(direction) {
        if (direction === "left") {
            this.velocity = [-1, 0]
        }
        else if (direction === "right") {
            this.veloicty = [1, 0]
        }

        else if (direction === "up") {
            this.velocity = [0, 1]
        }

        else if (direction === 'down') {
            this.velocity = [0, -1]
        }
    }

    collidesWith(otherEntity) {
        if (this.pos === otherEntity.getPos()) {
            return true;
        }
        return false;
    }

    handleCollide(otherEntity) {
        let type = otherEntity.getType();
        if (type === PELLET){
            //delete pellet
        }
        else if (type === BIG_PELLET){
            //make ghosts killable
        }
        else if (type === GHOST){
            if (otherEntity.killable){
                //kill the ghost
            } else{
                //kill the user
            }  
        }
    }
}

export default Snaccman;