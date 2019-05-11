import Entity from "./Entity"

class Ghost extends Entity{
    constructor(x, y, type="ghost", velocity){
        super([x, y, type, velocity])
        this.killable = false;
    }

    nextMove() {//ALGORITHM HERE}
    }

    getKillable(){
        return this.killable;
    }

    setKillabe(bool){
        this.killable = bool;
    }


}