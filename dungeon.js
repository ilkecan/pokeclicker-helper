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
    const original_move_to_tile = DungeonRunner.map.moveToTile;
    DungeonRunner.map.moveToTile = (point) => {
        original_move_to_tile.call(DungeonRunner.map, point);

        if (dungeon_solver !== null) {
            setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
        }
    }

    const original_show_chest_tiles = DungeonRunner.map.showChestTiles;
    DungeonRunner.map.showChestTiles = () => {
        original_show_chest_tiles.call(DungeonRunner.map);

        if (dungeon_solver !== null) {
            dungeon_solver.locate_chest_tiles();
        }
    }

    const original_show_all_tiles = DungeonRunner.map.showAllTiles;
    DungeonRunner.map.showAllTiles = () => {
        original_show_all_tiles.call(DungeonRunner.map);

        if (dungeon_solver !== null) {
            dungeon_solver.locate_enemy_tiles();
        }
    }

    dungeon_solver = new DungeonSolver(DungeonRunner.map.playerPosition());
    dungeon_solver.run();
}

const original_dungeon_won = DungeonRunner.dungeonWon;
DungeonRunner.dungeonWon = () => {
    original_dungeon_won.call(DungeonRunner)
    dungeon_solver = null;
    setTimeout(start_dungeon, ENTER_DUNGEON_INTERVAL, DungeonRunner.dungeon);
}

const original_defeat_pokemon = DungeonBattle.defeatPokemon;
DungeonBattle.defeatPokemon = () => {
    original_defeat_pokemon.call(DungeonBattle);

    if (dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

const original_defeat_trainer_pokemon = DungeonBattle.defeatTrainerPokemon;
DungeonBattle.defeatTrainerPokemon = () => {
    original_defeat_trainer_pokemon.call(DungeonBattle);

    if (!DungeonRunner.fighting() && dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }
}

keymage('alt-d', () => { enter_dungeon(); }, { preventDefault: true });
