class DungeonSolver {
    constructor(current_tile) {
        this.visited_tiles = new Set();
        this.unvisited_tiles = new Set();
        this.boss_tile = null;
        this.current_tile = current_tile;
        this.chest_tiles = new Set();
        this.enemy_tiles = new Set();
    }

    run() {
        if (DungeonRunner.fighting()) {
            return;
        }

        this.update_unvisited_tiles(this.current_tile);

        switch (DungeonRunner.map.currentTile().type()) {
            case GameConstants.DungeonTile.chest:
                DungeonRunner.openChest();
                break;

            case GameConstants.DungeonTile.boss:
                this.boss_tile = this.current_tile;
                break;
        }

        if (this.unvisited_tiles.size > 0) {
            const next_tile = this.get_next_tile();

            if (next_tile === null) {
                this.fight_boss();
            } else {
                this.current_tile = next_tile;
                DungeonRunner.map.moveToTile(next_tile);
            }
        } else {
            this.fight_boss();
        }
    }

    update_unvisited_tiles(current_tile) {
        const neighbouring_tiles = DungeonSolver.get_neighbouring_tiles(current_tile);

        for (const tile of neighbouring_tiles) {
            const stringified_tile = JSON.stringify(tile);
            if (!this.visited_tiles.has(stringified_tile)) {
                this.unvisited_tiles.add(stringified_tile);
            }
        }

        const stringified_current_tile = JSON.stringify(this.current_tile);
        this.unvisited_tiles.delete(stringified_current_tile);
        this.visited_tiles.add(stringified_current_tile);
    }

    static get_neighbouring_tiles(tile) {
        const {x, y} = tile;
        const neighbouring_tiles = [
            new Point(x - 1, y),
            new Point(x, y - 1),
            new Point(x + 1, y),
            new Point(x, y + 1),
        ];

        return neighbouring_tiles.filter(DungeonSolver.is_valid_tile);
    }

    static is_valid_tile(tile) {
        const size = DungeonRunner.map.size;

        if (tile.x < 0 || tile.x >= size || tile.y < 0 || tile.y >= size) {
            return false;
        }

        return true;
    }

    get_next_tile() {
        for (const tile of this.chest_tiles) {
            if (DungeonRunner.map.hasAccesToTile(tile)) {
                this.chest_tiles.delete(tile);
                return tile;
            }
        }

        for (const tile of this.enemy_tiles) {
            if (DungeonRunner.map.hasAccesToTile(tile)) {
                this.enemy_tiles.delete(tile);
                return tile;
            }
        }

        for (const tile of this.unvisited_tiles) {
            const parsed_tile = JSON.parse(tile);

            if (!DungeonRunner.map.board()[parsed_tile.y][parsed_tile.x].isVisible) {
                return parsed_tile;
            }

            this.update_unvisited_tiles(parsed_tile);
        }

        return null;
    }

    fight_boss() {
        if (this.boss_tile !== null) {
            DungeonRunner.map.moveToTile(this.boss_tile);
            DungeonRunner.startBossFight();
        } else {
            console.error("Dungeon solver failed to find the boss tile.");
        }
    }

    locate_chest_tiles() {
        const board = DungeonRunner.map.board();

        for (let y = 0; y < board.length; y += 1) {
            for (let x = 0; x < board[y].length; x += 1) {
                if (board[y][x].type() == GameConstants.DungeonTile.chest) {
                    this.chest_tiles.add(new Point(x, y));
                }
            }
        }
    }

    locate_enemy_tiles() {
        const board = DungeonRunner.map.board();

        for (let y = 0; y < board.length; y += 1) {
            for (let x = 0; x < board[y].length; x += 1) {
                switch (board[y][x].type()) {
                    case GameConstants.DungeonTile.enemy: {
                        this.enemy_tiles.add(new Point(x, y));
                        break;
                    }

                    case GameConstants.DungeonTile.boss: {
                        this.boss_tile = new Point(x, y);
                        break;
                    }
                }
            }
        }
    }
}
