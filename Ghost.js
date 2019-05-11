import Entity from "./Entity"

class Ghost extends Entity{
    constructor(x, y, type="ghost", velocity){
        super([x, y, type, velocity])
    }

    nextMove(){}
    //ALGORITHM HERE

}