function hatch_eggs() {
    const eggs = App.game.breeding.eggList;
    for (let i = eggs.length - 1; i >= 0; i -= 1) {
        if (eggs[i]().stepsRemaining() <= 0) {
            App.game.breeding.hatchPokemonEgg(i);
        }
    }
}

function breed() {
    const pokemons = PartyController.getSortedList()();

    while (App.game.breeding.hasFreeEggSlot()) {
        add_to_hatchery(pokemons);
    }

    while (App.game.breeding.hasFreeQueueSlot()) {
        add_to_hatchery(pokemons);
    }
}

function add_to_hatchery(pokemons) {
    for (const p of pokemons) {
        if (BreedingController.visible(p)()) {
            App.game.breeding.addPokemonToHatchery(p);
            break;
        }
    }
}

keymage('alt-b', () => { hatch_eggs(); breed(); }, { preventDefault: true });
