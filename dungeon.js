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

let dungeon_solver;
function init_dungeon_solver() {
    dungeon_solver = new DungeonSolver(DungeonRunner.map.playerPosition());
    dungeon_solver.run();
}

const original_dungeon_won = DungeonRunner.dungeonWon;
DungeonRunner.dungeonWon = () => {
    original_dungeon_won.apply(DungeonRunner)
    setTimeout(start_dungeon, ENTER_DUNGEON_INTERVAL, DungeonRunner.dungeon);
}

keymage('alt-d', function() { enter_dungeon(); }, { preventDefault: true });
