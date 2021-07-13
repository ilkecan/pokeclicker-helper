const ENTER_SAFARI_INTERVAL = 1000;
const SAFARI_RUNNER_INTERVAL = 250;

var continue_entering_safari = false;
var safari_catch_condition = null;

async function toggle_safari() {
    if (continue_entering_safari) {
        continue_entering_safari = false;
        return;
    }

    if (App.game.gameState === GameConstants.GameState.safari) {
        continue_entering_safari = true;
        return;
    }

    if (player.region !== GameConstants.Region.kanto) {
        Notifier.notify({
            message: "You must be in the Kanto region to enter the safari zone.",
            type: NotificationConstants.NotificationOption.danger,
        });
        return;
    }

    safari_catch_condition = await get_catch_condition();

    if (safari_catch_condition === null) {
        return;
    }

    continue_entering_safari = true;
    open_safari();
}

function open_safari() {
    if (!continue_entering_safari) {
        return;
    }

    Safari.openModal();

    if (App.game.gameState !== GameConstants.GameState.safari) {
        continue_entering_safari = false;
    }
}

safari_modal.on("shown.bs.modal", enter_safari);

function enter_safari() {
    if (!continue_entering_safari) {
        return;
    }

    if (Safari.inProgress()) {
        return;
    }

    Safari.payEntranceFee();

    if (!Safari.inProgress()) {
        continue_entering_safari = false;

        Notifier.notify({
            message: "You do not have enough quest points to enter the safari zone.",
            type: NotificationConstants.NotificationOption.danger,
        });

        return;
    };

    setTimeout(init_safari_runner, SAFARI_RUNNER_INTERVAL);
}

async function get_catch_condition() {
    const condition = await Notifier.prompt({
        title: "Select the catch condition",
        message: "Type the number of the catch condition.\n" +
            "0. Try to catch every pokemon.\n" +
            "1. Try to catch every uncaught pokemon.\n" +
            "2. Try to catch every shiny pokemon.\n" +
            "3. Try to catch every uncaught shiny pokemon.",
    });

    const condition_number = parseInt(condition);

    if (Number.isNaN(condition_number)) {
        Notifier.notify({
            message: "You must type the number of the catch condition.",
            type: NotificationConstants.NotificationOption.danger,
        });

        return null;
    }

    switch (condition_number) {
        case SAFARI_CATCH_CONDITION.NO_CONDITION:
        case SAFARI_CATCH_CONDITION.UNCAUGHT:
        case SAFARI_CATCH_CONDITION.SHINY:
        case SAFARI_CATCH_CONDITION.UNCAUGHT_SHINY:
            return condition_number;

        default:
            Notifier.notify({
                message: "A catch condition with the given number does not exit.",
                type: NotificationConstants.NotificationOption.danger,
            });
            return null;
    }
}

let safari_runner = null;
function init_safari_runner() {
    safari_runner = new SafariRunner(safari_catch_condition);
    safari_runner.run();
}

const original_safari_battle_load = SafariBattle.load;
SafariBattle.load = function(enemy) {
    original_safari_battle_load.call(this, enemy);

    if (safari_runner !== null) {
        safari_runner.state = SAFARI_STATE.SAFARI_BATTLE;
    }
}

const original_safari_check_battle = Safari.checkBattle;
Safari.checkBattle = function() {
    original_safari_check_battle.call(this);

    if (safari_runner === null) {
        return;
    }

    if (![SAFARI_STATE.GO_TO_POKEMON, SAFARI_STATE.SAFARI_BATTLE].includes(safari_runner.state)) {
        for (const pokemon of safari_runner.roaming_pokemons) {
            safari_runner.roaming_pokemons.delete(pokemon);

            if (pokemon.steps > 0 && safari_runner.is_interested_in(pokemon)) {
                const pokemon_tile = new Point(pokemon.x, pokemon.y);
                const route = SafariRunner.get_route_to_pokemon(pokemon_tile);

                if (pokemon.steps >= route.length) {
                    safari_runner.adjacent_grass_direction = null;
                    safari_runner.route = route;
                    safari_runner.destination = SAFARI_DESTINATION.POKEMON;
                    safari_runner.state = SAFARI_STATE.GO_TO_POKEMON;
                    break;
                }
            }
        }
    }

    setTimeout(safari_runner.run.bind(safari_runner), SAFARI_RUNNER_INTERVAL);
};

const original_pokemon_grid_push = Safari.pokemonGrid.push;
Safari.pokemonGrid.push = function(pokemon) {
    original_pokemon_grid_push.call(this, pokemon);

    if (safari_runner !== null) {
        safari_runner.roaming_pokemons.add(pokemon);
    }
};

const original_safari_battle_unlock_buttons = SafariBattle.unlockButtons;
SafariBattle.unlockButtons = function() {
    original_safari_battle_unlock_buttons.call(this);

    if (safari_runner !== null && Safari.inBattle()) {
        setTimeout(safari_runner.run.bind(safari_runner), SAFARI_RUNNER_INTERVAL);
    }
}

const original_safari_battle_game_over = SafariBattle.gameOver;
SafariBattle.gameOver = function() {
    original_safari_battle_game_over.call(this);
    safari_runner = null;
};

safari_modal.on('hidden.bs.modal', () => {
    if (safari_runner === null && continue_entering_safari) {
        setTimeout(open_safari, ENTER_SAFARI_INTERVAL);
    }
})

safari_battle_modal.on('hidden.bs.modal', () => {
    if (safari_runner === null) {
        return;
    }

    if (safari_runner.route.length > 0) {
        switch (safari_runner.destination) {
            case SAFARI_DESTINATION.GRASS:
                safari_runner.state = SAFARI_STATE.GO_TO_GRASS;
                break;

            case SAFARI_DESTINATION.POKEMON:
                safari_runner.state = SAFARI_STATE.GO_TO_POKEMON;
                break;
        }
    } else if (safari_runner.adjacent_grass_direction !== null) {
        safari_runner.state = SAFARI_STATE.RUN_THROUGH_GRASS;
    } else {
        safari_runner.state = SAFARI_STATE.FIND_GRASS;
    }

    setTimeout(safari_runner.run.bind(safari_runner), SAFARI_RUNNER_INTERVAL);
})

bind_key("alt-z", toggle_safari);
