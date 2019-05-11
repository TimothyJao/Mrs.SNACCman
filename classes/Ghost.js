import Entity from "./Entity"

class Ghost extends Entity{
    constructor(x, y, type="ghost", velocity=[1, 0]){
        super(x, y, type, velocity)
    }

    nextMove(){}
    //ALGORITHM HERE
    setPos(pos){
        this.pos = pos;
    }
}

export default Ghost