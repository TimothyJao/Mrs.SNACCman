import Entity from "./Entity"

class Snaccman extends Entity{
    constructor(x, y, type="snaccman", velocity){
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
}

export default Snaccman