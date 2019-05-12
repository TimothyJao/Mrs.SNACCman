import Entity from "./Entity"

class Snaccman extends Entity{
<<<<<<< HEAD
    constructor(x, y, type="Snaccman", velocity){
=======
    constructor(x, y, type="snaccman", velocity){
>>>>>>> acb7e950c5d1617d6448f7e337be18836ab2da97
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
        if (type === "pellet"){
            //delete pellet
        }
        else if (type === "big pellet"){
            //make ghosts killable
        }
        else if (type === "ghost"){
            if (otherEntity.killable){
                //kill the ghost
            } else{
                //kill the user
            }  
        }
    }
}

export default Snaccman