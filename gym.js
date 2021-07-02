const GYM_BATTLE_INTERVAL = 1000;

var continue_gym_battle = false;

function battle_gym() {
    if (continue_gym_battle) {
        continue_gym_battle = false;
        return;
    }

    switch (App.game.gameState) {
        case GameConstants.GameState.town:
            const gym = select_gym();

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

function select_gym() {
    const town = player.town();

    if (!(town instanceof PokemonLeague)) {
        return town.gym;
    }

    const gyms = town.gymList;
    const gym_leaders = gyms.map((gym) => gym.leaderName);
    const GYM_LEADER_PROMPT_MESSAGE =
        "Type the name of the gym leader you want to battle with:\n" +
        `- ${gym_leaders.join("\n- ")}\n`;
    const gym_mapping = new Map(gyms.map((gym) => [gym.leaderName.toLowerCase(), gym]));

    let gym = undefined;
    while (gym === undefined) {
        const gym_leader = window.prompt(GYM_LEADER_PROMPT_MESSAGE);

        if (gym_leader === null) {
            return null;
        }

        gym = gym_mapping.get(gym_leader.toLowerCase());
    }

    return gym;
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
GymRunner.gymWon = (gym) => {
    original_gym_won.call(GymRunner, gym);
    setTimeout(start_gym_battle, GYM_BATTLE_INTERVAL, gym);
}

keymage('alt-g', () => { battle_gym(); }, { preventDefault: true });
