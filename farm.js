const original_farming_shovel = Farming.prototype.shovel;
Farming.prototype.shovel = function(index) {
    original_farming_shovel.call(this, index);
    GameHelper.incrementObservable(this.shovelAmt, 1);
}

keymage('alt-h', () => { App.game.farming.harvestAll(); }, { preventDefault: true });
keymage('alt-p', () => { App.game.farming.plantAll(FarmController.selectedBerry()); }, { preventDefault: true });
