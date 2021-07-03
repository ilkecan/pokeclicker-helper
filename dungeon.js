const DUNGEON_SOLVER_ACTION_INTERVAL = 250;
const ENTER_DUNGEON_INTERVAL = 1000;

var continue_entering_dungeon = false;

function enter_dungeon() {
    if (continue_entering_dungeon) {
        continue_entering_dungeon = false;
        return;
    }

    switch (App.game.gameState) {
        case GameConstants.GameState.town:
            const dungeon = player.town().dungeon;

            if (dungeon === undefined) {
                Notifier.notify({
                    message: "The town you are in does not have a dungeon.",
                    type: NotificationConstants.NotificationOption.danger,
                });
                return;
            }

            continue_entering_dungeon = true;
            start_dungeon(dungeon);
            break;

        case GameConstants.GameState.dungeon:
            continue_entering_dungeon = true;
            break;

        default:
            Notifier.notify({
                message: "You must be in a dungeon or a town that has a dungeon.",
                type: NotificationConstants.NotificationOption.danger,
            });
            break;
    }
}

function start_dungeon(dungeon) {
    if (continue_entering_dungeon) {
        if (DungeonRunner.initializeDungeon(dungeon) === false) {
            continue_entering_dungeon = false;
            return;
        }

        setTimeout(init_dungeon_solver, DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

let dungeon_solver = null;
function init_dungeon_solver() {
    dungeon_solver = new DungeonSolver(DungeonRunner.map.playerPosition());
    dungeon_solver.run();
}

const original_defeat_pokemon = DungeonBattle.defeatPokemon;
DungeonBattle.defeatPokemon = function() {
    original_defeat_pokemon.call(this);

    if (dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

const original_defeat_trainer_pokemon = DungeonBattle.defeatTrainerPokemon;
DungeonBattle.defeatTrainerPokemon = function() {
    original_defeat_trainer_pokemon.call(this);

    if (!DungeonRunner.fighting() && dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

const original_move_to_tile = DungeonMap.prototype.moveToTile;
DungeonMap.prototype.moveToTile = function(point) {
    original_move_to_tile.call(this, point);

    if (dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

const original_show_chest_tiles = DungeonMap.prototype.showChestTiles;
DungeonMap.prototype.showChestTiles = function() {
    original_show_chest_tiles.call(this);

    if (dungeon_solver !== null) {
        dungeon_solver.locate_chest_tiles();
    }
}

const original_show_all_tiles = DungeonMap.prototype.showAllTiles;
DungeonMap.prototype.showAllTiles = function() {
    original_show_all_tiles.call(this);

    if (dungeon_solver !== null) {
        dungeon_solver.locate_enemy_tiles();
    }
}

const original_dungeon_won = DungeonRunner.dungeonWon;
DungeonRunner.dungeonWon = function() {
    original_dungeon_won.call(this)
    dungeon_solver = null;
    setTimeout(start_dungeon, ENTER_DUNGEON_INTERVAL, DungeonRunner.dungeon);
}

const original_dungeon_lost = DungeonRunner.dungeonLost;
DungeonRunner.dungeonLost = function() {
    original_dungeon_lost.call(this)
    dungeon_solver = null;
    continue_entering_dungeon = false;
}

keymage('alt-d', () => { enter_dungeon(); }, { preventDefault: true });
