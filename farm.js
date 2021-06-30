keymage('alt-h', function() { App.game.farming.harvestAll(); }, { preventDefault: true });
keymage('alt-p', function() { App.game.farming.plantAll(FarmController.selectedBerry()); }, { preventDefault: true });
