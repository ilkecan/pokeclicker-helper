const GYM_BATTLE_INTERVAL = 1000;

var continue_gym_battle = false;

function battle_gym() {
    if (continue_gym_battle) {
        continue_gym_battle = false;
    } else {
        continue_gym_battle = true;

        if (App.game.gameState != GameConstants.GameState.gym) {
            const gym = select_gym();

            if (gym !== null) {
                start_gym_battle(gym);
            }
        }
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
    }
}

const original_gym_won = GymRunner.gymWon;
GymRunner.gymWon = (gym) => {
    original_gym_won.apply(GymRunner, [gym]);
    setTimeout(start_gym_battle, GYM_BATTLE_INTERVAL, gym);
}

keymage('ctrl-g', function() { battle_gym(); }, { preventDefault: true });
