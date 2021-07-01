keymage('alt-h', () => { App.game.farming.harvestAll(); }, { preventDefault: true });
keymage('alt-p', () => { App.game.farming.plantAll(FarmController.selectedBerry()); }, { preventDefault: true });
