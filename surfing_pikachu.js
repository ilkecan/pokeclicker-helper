const original_generate_roaming_encounter = PokemonFactory.generateRoamingEncounter;
PokemonFactory.generateRoamingEncounter = function(route, region) {
    if (generate_surfing_pikachu(route, region)) {
        return "Surfing Pikachu";
    }

    return original_generate_roaming_encounter.call(this, ...arguments);
}

function generate_surfing_pikachu(route, region) {
    if (Weather.currentWeather() !== WeatherType.Sunny) {
        return false;
    }

    if (!get_water_routes(region).includes(route)) {
        return false;
    }

    if (Math.random() >= 1 / (get_number_of_roaming_pokemons(region) + 1)) {
        return false;
    }

    return true;
}

function get_water_routes(region) {
    return Array.from(GameConstants.Environments.Water[region]).filter(Number);
}

function get_number_of_roaming_pokemons(region) {
    return RoamingPokemonList.getRegionalRoamers(region).length;
}
