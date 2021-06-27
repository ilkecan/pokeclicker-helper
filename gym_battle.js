const GYM_BATTLE_INTERVAL = 1000;

var continue_gym_battle = false;
var gym_battle_ongoing = false;

function battle_gym() {
    if (continue_gym_battle) {
        continue_gym_battle = false;
    } else {
        continue_gym_battle = true;

        if (!gym_battle_ongoing) {
            start_gym_battle();
        }
    }
}

function start_gym_battle() {
    if (continue_gym_battle) {
        gym_battle_ongoing = true;
        GymRunner.startGym(player.town().gym);
    }
}

const original_gym_won = GymRunner.gymWon;
GymRunner.gymWon = (gym) => {
    original_gym_won.apply(GymRunner, [gym]);
    gym_battle_ongoing = false;
    setTimeout(start_gym_battle, GYM_BATTLE_INTERVAL);
}

keymage('ctrl-g', function() { battle_gym(); }, { preventDefault: true });
