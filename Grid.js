import GridCell from "./GridCell"

class Grid {
    constructor() {
        this.grid = [
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
            [X, X, X, X, X, P, X, X, E, X, E, E, E, E, E, E, X, E, E, E, P, X, X, X, X, X,],
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
        ];

        this.moveGrid = [];
        for (let i = 0; i < 26; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 29; j++) {
                this.grid[i].push(GridCell.new(this.grid, [i, j]))
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

export default Grid