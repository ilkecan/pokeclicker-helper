function use_loadout(number) {
    App.game.oakItemLoadouts.activateLoadout(number - 1);
}

keymage('alt-1', () => { use_loadout(1); }, { preventDefault: true });
keymage('alt-2', () => { use_loadout(2); }, { preventDefault: true });
keymage('alt-3', () => { use_loadout(3); }, { preventDefault: true });
