import GridCell from "./GridCell";
import {transposeGrid} from "../frontend/util/game_util";
import Entity from "./Entity";

const P = "P";
const X = "X";
const E = "E";
const B = "B";
const G = "G";

class Grid {
    constructor() {
        this.grid = transposeGrid([
            [P, P, P, P, P, P, P, P, P, P, P, P, X, X, P, P, P, P, P, P, P, P, P, P, P, P,],
            [P, X, X, X, X, P, X, X, X, X, X, P, X, X, P, X, X, X, X, X, P, X, X, X, X, P,],
            [B, X, X, X, X, P, X, X, X, X, X, P, X, X, P, X, X, X, X, X, P, X, X, X, X, B,],
            [P, X, X, X, X, P, X, X, X, X, X, P, X, X, P, X, X, X, X, X, P, X, X, X, X, P,],
            [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P,],
            [P, X, X, X, X, P, X, X, P, X, X, X, X, X, X, X, X, P, X, X, P, X, X, X, X, P,],
            [P, X, X, X, X, P, X, X, P, X, X, X, X, X, X, X, X, P, X, X, P, X, X, X, X, P,],
            [P, P, P, P, P, P, X, X, P, P, P, P, X, X, P, P, P, P, X, X, P, P, P, P, P, P,],
            [X, X, X, X, X, P, X, X, X, X, X, E, X, X, E, X, X, X, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, X, X, X, E, X, X, E, X, X, X, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, E, E, E, E, E, E, E, E, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, X, X, X, G, G, X, X, X, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, X, E, E, E, E, E, E, X, E, X, X, P, X, X, X, X, X,],
            [E, E, E, E, E, P, E, E, E, X, E, E, E, E, E, E, X, E, E, E, P, E, E, E, E, E,],
            [X, X, X, X, X, P, X, X, E, X, E, E, E, E, E, E, X, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, X, X, X, X, X, X, X, X, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, E, E, E, E, E, E, E, E, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, X, X, X, X, X, X, X, X, E, X, X, P, X, X, X, X, X,],
            [X, X, X, X, X, P, X, X, E, X, X, X, X, X, X, X, X, E, X, X, P, X, X, X, X, X,],
            [P, P, P, P, P, P, P, P, P, P, P, P, X, X, P, P, P, P, P, P, P, P, P, P, P, P,],
            [P, X, X, X, X, P, X, X, X, X, X, P, X, X, P, X, X, X, X, X, P, X, X, X, X, P,],
            [P, X, X, X, X, P, X, X, X, X, X, P, X, X, P, X, X, X, X, X, P, X, X, X, X, P,],
            [B, P, P, X, X, P, P, P, P, P, P, P, E, E, P, P, P, P, P, P, P, X, X, P, P, B,],
            [X, X, P, X, X, P, X, X, P, X, X, X, X, X, X, X, X, P, X, X, P, X, X, P, X, X,],
            [X, X, P, X, X, P, X, X, P, X, X, X, X, X, X, X, X, P, X, X, P, X, X, P, X, X,],
            [P, P, P, P, P, P, X, X, P, P, P, P, X, X, P, P, P, P, X, X, P, P, P, P, P, P,],
            [P, X, X, X, X, X, X, X, X, X, X, P, X, X, P, X, X, X, X, X, X, X, X, X, X, P,],
            [P, X, X, X, X, X, X, X, X, X, X, P, X, X, P, X, X, X, X, X, X, X, X, X, X, P,],
            [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P,],
        ]);

        /* replaces all "P" and "B" with Entity objects */ 
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid.length; j++){
                if (grid[i][j] === "P"){
                    grid[i][j] = new Entity(i, j, "pellet");
                }
                else if (grid[i][j] === "B"){
                    grid[i][j] = new Entity(i, j, "big pellet");
                }
            }
        }

        this.moveGrid = [];
        for (let x = 0; x < this.grid.length; x++) {
            this.moveGrid[x] = [];
            for (let y = 0; y < this.grid[x].length; y++) {
                this.moveGrid[x][y] = new GridCell(this.grid, [x, y]);
            }
        }
    }

    getGrid() {
        return this.grid;
    }

    getMoveGrid() {
        return this.moveGrid;
    }
}

export default Grid;