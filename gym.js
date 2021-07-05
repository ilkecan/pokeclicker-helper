const GYM_BATTLE_INTERVAL = 1000;

var continue_gym_battle = false;

async function toggle_gym_battle() {
    if (continue_gym_battle) {
        continue_gym_battle = false;
        return;
    }

    switch (App.game.gameState) {
        case GameConstants.GameState.town:
            const gym = await select_gym();

            switch (gym) {
                case undefined:
                    Notifier.notify({
                        message: "The town you are in does not have a gym.",
                        type: NotificationConstants.NotificationOption.danger,
                    });
                    break;

                case null:
                    break;

                default:
                    continue_gym_battle = true;
                    start_gym_battle(gym);
                    break;
            }
            break;

        case GameConstants.GameState.gym:
            continue_gym_battle = true;
            break;

        default:
            Notifier.notify({
                message: "You must be in a gym battle or a town that has a gym.",
                type: NotificationConstants.NotificationOption.danger,
            });
            break;
    }
}

async function select_gym() {
    const town = player.town();

    if (!(town instanceof PokemonLeague)) {
        return town.gym;
    }

    const gyms = town.gymList;
    const gym_leaders = gyms.map((gym) => gym.leaderName);
    const GYM_LEADER_PROMPT_MESSAGE =
        "Type the name or the number of the gym leader you want to battle with:\n" +
        `${gym_leaders.map((e, i) => `${i + 1}. ${e}`).join("\n")}`;
        // `- ${gym_leaders.join("\n- ")}`;
    const gym_mapping = new Map(gyms.map((gym) => [gym.leaderName.toLowerCase(), gym]));

    const input = await Notifier.prompt({
        title: "Start a gym battle",
        message: GYM_LEADER_PROMPT_MESSAGE
    });
    const gym_leader_number = parseInt(input);

    if (Number.isNaN(gym_leader_number)) {
        const gym_leader_name = input;

        if (gym_leader_name === "") {
            return null;
        }

        const gym = gym_mapping.get(gym_leader_name.toLowerCase());

        if (gym === undefined) {
            Notifier.notify({
                message: "A gym with a gym leader with the given name does not exist.",
                type: NotificationConstants.NotificationOption.danger,
            });

            return null;
        }

        return gym;
    } else {
        const gym = gyms[gym_leader_number - 1];

        if (gym === undefined) {
            Notifier.notify({
                message: "A gym with a gym leader with the given number does not exist.",
                type: NotificationConstants.NotificationOption.danger,
            });

            return null;
        }

        return gym;
    }
}

function start_gym_battle(gym) {
    if (continue_gym_battle) {
        GymRunner.startGym(gym);

        if (App.game.gameState !== GameConstants.GameState.gym) {
            continue_gym_battle = false;
        }
    }
}

const original_gym_won = GymRunner.gymWon;
GymRunner.gymWon = function(gym) {
    original_gym_won.call(this, gym);
    setTimeout(start_gym_battle, GYM_BATTLE_INTERVAL, gym);
}

const original_gym_lost = GymRunner.gymLost;
GymRunner.gymLost = function(gym) {
    original_gym_lost.call(this, gym);
    continue_gym_battle = false;
}

keymage('alt-g', () => { toggle_gym_battle(); }, { preventDefault: true });
