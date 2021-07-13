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

function empty_hatchery_queue() {
    for (const pokemon_name of App.game.breeding.queueList.splice(0)) {
        pokemon_name_map.get(pokemon_name).breeding = false;
    }
}

const pokemon_name_map = new Map();
function create_pokemon_name_map() {
    for (const pokemon of App.game.party.caughtPokemon) {
        pokemon_name_map.set(pokemon.name, pokemon);
    }

    App.game.party._caughtPokemon.subscribe((changes) => {
        for (const { status, value: pokemon } of changes) {
            if (status === "added" && !pokemon_name_map.has(pokemon.name)) {
                pokemon_name_map.set(pokemon.name, pokemon);
            }
        }
    }, null, "arrayChange");
}

const breeding_pokemons = new Set();
function create_breeding_pokemons_set() {
    for (const egg of App.game.breeding.eggList) {
        breeding_pokemons.add(egg().pokemon);
    }
}

const original_party_calculate_one_pokemon_attack = Party.prototype.calculateOnePokemonAttack;
Party.prototype.calculateOnePokemonAttack = function(pokemon, type1, type2, region, ignoreRegionMultiplier, includeBreeding, useBaseAttack, includeWeather) {
    if (!breeding_pokemons.has(pokemon.name)) {
        includeBreeding = true;
    }

    return original_party_calculate_one_pokemon_attack.call(this, pokemon, type1, type2, region, ignoreRegionMultiplier, includeBreeding, useBaseAttack, includeWeather);
}

const original_breeding_gain_egg = Breeding.prototype.gainEgg;
Breeding.prototype.gainEgg = function(egg) {
    const is_gained = original_breeding_gain_egg.call(this, ...arguments);

    if (is_gained) {
        breeding_pokemons.add(egg.pokemon);
    }

    return is_gained;
}

const original_egg_hatch = Egg.prototype.hatch;
Egg.prototype.hatch = function() {
    const is_hatched = original_egg_hatch.call(this, ...arguments);

    if (is_hatched) {
        breeding_pokemons.delete(this.pokemon);
    }

    return is_hatched;
}

bind_key("alt-b", () => { empty_hatchery_queue(); hatch_eggs(); breed(); });
