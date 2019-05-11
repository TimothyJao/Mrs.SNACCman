class Entity {
    constructor(x, y, type, velocity = [0, 0]) {
        this.pos = [x, y];
        this.type = type;
        this.velocity = velocity;
    }

    getPos() {
        return this.pos;
    }

    getType() {
        return this.type;
    }

    getVelocity() {
        return this.velocity;
    }
}

export default Entity