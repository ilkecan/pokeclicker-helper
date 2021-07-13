const original_farming_shovel = Farming.prototype.shovel;
Farming.prototype.shovel = function(index) {
    original_farming_shovel.call(this, index);
    GameHelper.incrementObservable(this.shovelAmt, 1);
}

bind_key("alt-h", () => { App.game.farming.harvestAll(); });
bind_key("alt-p", () => { App.game.farming.plantAll(FarmController.selectedBerry()); });
