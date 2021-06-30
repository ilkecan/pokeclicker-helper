const DUNGEON_SOLVER_ACTION_INTERVAL = 250;
const ENTER_DUNGEON_INTERVAL = 1000;

var continue_entering_dungeon = false;

function enter_dungeon() {
    if (continue_entering_dungeon) {
        continue_entering_dungeon = false;
    } else {
        continue_entering_dungeon = true;

        if (App.game.gameState != GameConstants.GameState.dungeon) {
            start_dungeon(player.town().dungeon);
        }
    }
}

function start_dungeon(dungeon) {
    if (continue_entering_dungeon) {
        DungeonRunner.initializeDungeon(dungeon);
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

keymage('alt-d', function() { enter_dungeon(); }, { preventDefault: true });
