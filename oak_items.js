const NUMBER_OF_OAK_ITEM_LOADOUTS = 5;

const original_oak_items_from_json = OakItemLoadouts.prototype.fromJSON;
OakItemLoadouts.prototype.fromJSON = function(json) {
    for (let i = this.loadouts.length; i < NUMBER_OF_OAK_ITEM_LOADOUTS; i += 1) {
        this.loadouts.push(ko.observableArray());
    }

    original_oak_items_from_json.call(this, json);
}

for (let i = 1; i <= NUMBER_OF_OAK_ITEM_LOADOUTS; i += 1) {
    keymage(`alt-${i}`, () => { App.game.oakItemLoadouts.activateLoadout(i - 1); }, { preventDefault: true });
}
