function use_loadout(number) {
    App.game.oakItemLoadouts.activateLoadout(number - 1);
}

keymage('alt-1', function() { use_loadout(1); }, { preventDefault: true });
keymage('alt-2', function() { use_loadout(2); }, { preventDefault: true });
keymage('alt-3', function() { use_loadout(3); }, { preventDefault: true });
