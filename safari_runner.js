const SAFARI_CATCH_CONDITION = {
    NO_CONDITION: 0,
    UNCAUGHT: 1,
    SHINY: 2,
    UNCAUGHT_SHINY: 3,
};

const SAFARI_DESTINATION = {
    GRASS: 0,
    POKEMON: 1,
};

const SAFARI_STATE = {
    FIND_GRASS: 0,
    GO_TO_GRASS: 1,
    RUN_THROUGH_GRASS: 2,
    SAFARI_BATTLE: 3,
    GO_TO_POKEMON: 4,
};

const SAFARI_TILE = {
    GRASS: 10,
};

class SafariRunner {
    constructor(catch_condition) {
        this.find_grass_tiles_adjacent_to_grass();
        this.state = SAFARI_STATE.FIND_GRASS;
        this.route = [];
        this.adjacent_grass_direction = null;
        this.roaming_pokemons = new Set();
        this.destination = null;
        this.catch_condition = catch_condition;
    }

    run() {
        switch (this.state) {
            case SAFARI_STATE.FIND_GRASS: {
                this.plot_route_to_closest_grass_pair();
                this.state = SAFARI_STATE.GO_TO_GRASS;
            }

            case SAFARI_STATE.GO_TO_GRASS: {
                const next_tile = this.route.pop();

                if (next_tile !== undefined) {
                    this.go_to(next_tile);
                    break;
                }

                this.adjacent_grass_direction =
                    SafariRunner.get_adjacent_grass_direction(Safari.playerXY);
                this.state = SAFARI_STATE.RUN_THROUGH_GRASS;
            }

            case SAFARI_STATE.RUN_THROUGH_GRASS: {
                SafariRunner.move(this.adjacent_grass_direction);
                this.adjacent_grass_direction =
                    SpatialHelper.get_opposite_direction(this.adjacent_grass_direction);
                break;
            }

            case SAFARI_STATE.SAFARI_BATTLE: {
                this.handle_pokemon();
                break;
            }

            case SAFARI_STATE.GO_TO_POKEMON: {
                const next_tile = this.route.pop();

                if (next_tile !== undefined) {
                    this.go_to(next_tile);
                    break;
                }

                throw new Error("Roaming pokemon could not found.");
            }
        }
    }

    go_to(tile) {
        const current_tile = Safari.playerXY;
        if (tile.x === current_tile.x + 1) {
            SafariRunner.move("right");
        } else if (tile.x === current_tile.x - 1) {
            SafariRunner.move("left");
        } else if (tile.y === current_tile.y + 1) {
            SafariRunner.move("down");
        } else if (tile.y === current_tile.y - 1) {
            SafariRunner.move("up");
        } else {
            throw new Error("The next tile on the route is not a neighbour of the current tile.");
        }
    }

    handle_pokemon() {
        SafariBattle.lockButtons();
        if (!this.is_interested_in(SafariBattle.enemy)) {
            SafariBattle.run();
        } else {
            SafariBattle.throwBall();
        }
    }

    plot_route_to_closest_grass_pair() {
        this.destination = SAFARI_DESTINATION.GRASS;
        this.route = [];

        for (const point of SpatialHelper.follow_shortest_path_in_grid(
            Safari.playerXY,
            this.grass_tiles_adjacent_to_grass,
            SafariRunner.is_tile_walkable,
        )) {
            this.route.push(point);
        }

        this.route.pop();
    }

    find_grass_tiles_adjacent_to_grass() {
        this.grass_tiles_adjacent_to_grass = Array.from(
            SpatialHelper.map_cells_in_grid(Safari.grid, (tile, x, y) => {
                if (tile === SAFARI_TILE.GRASS) {
                    const point = new Point(x, y);

                    if (SafariRunner.is_adjacent_to_grass(point)) {
                        return JSON.stringify(point);
                    }
                }
            })
        );
    }

    is_interested_in(pokemon) {
        switch (this.catch_condition) {
            case SAFARI_CATCH_CONDITION.NO_CONDITION:
                return true;

            case SAFARI_CATCH_CONDITION.UNCAUGHT:
                return PartyController.getCaughtStatus(pokemon.id) === CaughtStatus.NotCaught;

            case SAFARI_CATCH_CONDITION.SHINY:
                return pokemon.shiny;

            case SAFARI_CATCH_CONDITION.UNCAUGHT_SHINY:
                return pokemon.shiny && PartyController.getCaughtStatus(pokemon.id) !== CaughtStatus.CaughtShiny;
        }
    }

    static move(direction) {
        Safari.move(direction);
        Safari.stop(direction);
    }

    static is_adjacent_to_grass(point) {
        return SpatialHelper.get_adjacent_cells(
            point,
            SafariRunner.is_grass_tile,
        ).length > 0;
    }

    static get_adjacent_grass_direction(point) {
        const {x, y} = point;

        if (SafariRunner.is_grass_tile(new Point(x - 1, y))) {
            return "left";
        }

        if (SafariRunner.is_grass_tile(new Point(x, y - 1))) {
            return "up";
        }

        if (SafariRunner.is_grass_tile(new Point(x + 1, y))) {
            return "right";
        }

        if (SafariRunner.is_grass_tile(new Point(x, y + 1))) {
            return "down";
        }

        throw new Errow(`There are grass tiles adjacent to ${(x, y)}.`);
    }

    static is_grass_tile(point) {
        const width = Safari.grid[0].length;
        const height = Safari.grid.length;
        const { x, y } = point;
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return false;
        }

        return Safari.grid[y][x] === SAFARI_TILE.GRASS;
    }

    static is_tile_walkable(point) {
        const width = Safari.grid[0].length;
        const height = Safari.grid.length;
        const { x, y } = point;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            return false;
        }

        if (!GameConstants.LEGAL_WALK_BLOCKS.includes(Safari.grid[y][x])) {
            return false;
        }

        return true;
    }

    static get_route_to_pokemon(pokemon_tile) {
        const route = [];

        for (const point of SpatialHelper.follow_shortest_path_in_grid(
            Safari.playerXY,
            [ JSON.stringify(pokemon_tile) ],
            SafariRunner.is_tile_walkable,
        )) {
            route.push(point);
        }

        route.pop();

        return route;
    }
}
