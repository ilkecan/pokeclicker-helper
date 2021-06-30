// ==UserScript==
// @name        pokeclicker helper
// @namespace   ilkecan
// @match       https://www.pokeclicker.com/
// @require     https://cdnjs.cloudflare.com/ajax/libs/keymage/1.1.3/keymage.min.js
// @require     breeding.js
// @require     dungeon.js
// @require     dungeon_solver.js
// @require     gym_battle.js
// @require     mine.js
// @require     oak_items.js
// @grant       none
// @icon        https://raw.githubusercontent.com/pokeclicker/pokeclicker/develop/src/assets/images/favicon.ico
// @version     0.3.0
// @author      ilkecan
// @description key bindings for various things
// ==/UserScript==

function toggle_modal(name) {
    $(`#${name}Modal`).modal("toggle");
}

keymage('ctrl-u', function() { toggle_modal("mine"); }, { preventDefault: true });
keymage('ctrl-f', function() { toggle_modal("farm"); }, { preventDefault: true });
keymage('ctrl-s', function() { toggle_modal("shop"); }, { preventDefault: true });
keymage('ctrl-h', function() { toggle_modal("breeding"); }, { preventDefault: true });
