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
    const return_value = original_move_to_tile.call(this, point);

    if (dungeon_solver !== null) {
        setTimeout(dungeon_solver.run.bind(dungeon_solver), DUNGEON_SOLVER_ACTION_INTERVAL);
    }

    return return_value;
}

const original_show_chest_tiles = DungeonMap.prototype.showChestTiles;
DungeonMap.prototype.showChestTiles = function() {
    original_show_chest_tiles.call(this);

    if (dungeon_solver !== null) {
        dungeon_solver.dungeon_visibility = DUNGEON_VISIBILITY.CHESTS_VISIBLE;
    }
}

const original_show_all_tiles = DungeonMap.prototype.showAllTiles;
DungeonMap.prototype.showAllTiles = function() {
    original_show_all_tiles.call(this);

    if (dungeon_solver !== null) {
        dungeon_solver.dungeon_visibility = DUNGEON_VISIBILITY.ALL_VISIBLE;
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

const roa_boss_base_health = dungeonList['Ruins of Alph'].bossList[0].baseHealth;
const roa_boss_level = dungeonList['Ruins of Alph'].bossList[0].level;
dungeonList['Ruins of Alph'].bossList.push(...[
    new DungeonBossPokemon('Unown (R)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (U)', roa_boss_base_health, roa_boss_level),
    new DungeonBossPokemon('Unown (I)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (N)', roa_boss_base_health, roa_boss_level),
    new DungeonBossPokemon('Unown (S)', roa_boss_base_health, roa_boss_level),

    new DungeonBossPokemon('Unown (O)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (F)', roa_boss_base_health, roa_boss_level),
    //
    // new DungeonBossPokemon('Unown (A)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (L)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (P)', roa_boss_base_health, roa_boss_level),
    // new DungeonBossPokemon('Unown (H)', roa_boss_base_health, roa_boss_level),
]);

const solaceon_ruins_boss_base_health = dungeonList['Solaceon Ruins'].bossList[0].baseHealth;
const solaceon_ruins_boss_level = dungeonList['Solaceon Ruins'].bossList[0].level;
dungeonList['Solaceon Ruins'].bossList.push(...[
    new DungeonBossPokemon('Unown (S)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    new DungeonBossPokemon('Unown (O)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (L)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (A)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    new DungeonBossPokemon('Unown (C)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (E)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (O)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (N)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),

    new DungeonBossPokemon('Unown (R)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (U)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    new DungeonBossPokemon('Unown (I)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (N)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
    // new DungeonBossPokemon('Unown (S)', solaceon_ruins_boss_base_health, solaceon_ruins_boss_level),
]);

keymage('alt-d', () => { enter_dungeon(); }, { preventDefault: true });
