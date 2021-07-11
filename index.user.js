// ==UserScript==
// @name        pokeclicker helper
// @namespace   ilkecan
// @match       https://www.pokeclicker.com/
// @require     https://cdnjs.cloudflare.com/ajax/libs/keymage/1.1.3/keymage.min.js
// @require     modals.js
// @require     spatial_helper.js
// @require     dungeon.js
// @require     dungeon_solver.js
// @require     farm.js
// @require     gym.js
// @require     hatchery.js
// @require     inventory.js
// @require     key_binding_scopes.js
// @require     oak_items.js
// @require     safari.js
// @require     safari_runner.js
// @require     shop.js
// @require     surfing_pikachu.js
// @require     underground.js
// @grant       none
// @icon        https://raw.githubusercontent.com/pokeclicker/pokeclicker/develop/src/assets/images/favicon.ico
// @version     0.5.0
// @author      ilkecan
// @description key bindings for various things
// ==/UserScript==

"use strict";

keymage('alt-s', () => { Save.download(); }, { preventDefault: true });

for (let i = 1; i <= EffectEngineRunner.multipliers.length; i += 1) {
    keymage('main', `shift-${i}`, () => { EffectEngineRunner.multIndex(i - 1); }, { preventDefault: true });
}
