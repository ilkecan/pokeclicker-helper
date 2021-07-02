// ==UserScript==
// @name        pokeclicker helper
// @namespace   ilkecan
// @match       https://www.pokeclicker.com/
// @require     https://cdnjs.cloudflare.com/ajax/libs/keymage/1.1.3/keymage.min.js
// @require     breeding.js
// @require     dungeon.js
// @require     dungeon_solver.js
// @require     farm.js
// @require     gym_battle.js
// @require     inventory.js
// @require     key_binding_scopes.js
// @require     mine.js
// @require     oak_items.js
// @require     shop.js
// @grant       none
// @icon        https://raw.githubusercontent.com/pokeclicker/pokeclicker/develop/src/assets/images/favicon.ico
// @version     0.4.0
// @author      ilkecan
// @description key bindings for various things
// ==/UserScript==

keymage('alt-s', () => { Save.download(); }, { preventDefault: true });

function toggle_modal(name) {
    $(`#${name}Modal`).modal("toggle");
}

keymage('ctrl-a', () => { toggle_modal("achievements"); }, { preventDefault: true });
keymage('ctrl-d', () => { toggle_modal("pokedex"); }, { preventDefault: true });
keymage('ctrl-f', () => { toggle_modal("farm"); }, { preventDefault: true });
keymage('ctrl-h', () => { toggle_modal("breeding"); }, { preventDefault: true });
keymage('ctrl-i', () => { toggle_modal("showItems"); }, { preventDefault: true });
keymage('ctrl-l', () => { toggle_modal("logBook"); }, { preventDefault: true });
keymage('ctrl-p', () => { toggle_modal("pokemonSelector"); }, { preventDefault: true });
keymage('ctrl-o', () => { toggle_modal("oakItems"); }, { preventDefault: true });
keymage('ctrl-q', () => { toggle_modal("Quest"); }, { preventDefault: true });
keymage('ctrl-s', () => { toggle_modal("shop"); }, { preventDefault: true });
keymage('ctrl-t', () => { toggle_modal("Ship"); }, { preventDefault: true });
keymage('ctrl-u', () => { toggle_modal("mine"); }, { preventDefault: true });
keymage('ctrl-z', () => { toggle_modal("shard"); }, { preventDefault: true });

function set_battle_item_multiplier(index) {
    EffectEngineRunner.multIndex(index);
}

keymage('main', 'shift-1', () => { set_battle_item_multiplier(0); }, { preventDefault: true });
keymage('main', 'shift-2', () => { set_battle_item_multiplier(1); }, { preventDefault: true });
keymage('main', 'shift-3', () => { set_battle_item_multiplier(2); }, { preventDefault: true });
keymage('main', 'shift-4', () => { set_battle_item_multiplier(3); }, { preventDefault: true });
keymage('main', 'shift-5', () => { set_battle_item_multiplier(4); }, { preventDefault: true });
