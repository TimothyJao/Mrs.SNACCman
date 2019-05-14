export const SNACCMAN = 0;
export const GHOST = 1;
export const PELLET = 2;
export const BIG_PELLET = 3;

export class Entity {
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