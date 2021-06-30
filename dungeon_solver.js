class DungeonSolver {
    constructor(current_tile) {
        this.visited_tiles = new Set();
        this.unvisited_tiles = new Set();
        this.boss_tile = null;
        this.current_tile = current_tile;
    }

    run() {
        if (DungeonRunner.fighting()) {
            return;
        }

        this.update_unvisited_tiles();

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
            this.current_tile = next_tile;
            DungeonRunner.map.moveToTile(next_tile);
        } else {
            this.fight_boss();
        }
    }

    update_unvisited_tiles() {
        const neighbouring_tiles = DungeonSolver.get_neighbouring_tiles(this.current_tile);

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
        return JSON.parse(this.unvisited_tiles.values().next().value);
    }

    fight_boss() {
        if (this.boss_tile !== null) {
            DungeonRunner.map.moveToTile(this.boss_tile);
            DungeonRunner.startBossFight();
        } else {
            console.error("Dungeon solver failed to find the boss tile.");
        }
    }
}
