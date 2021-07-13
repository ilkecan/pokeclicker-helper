function get_shop() {
    if (App.game.gameState === GameConstants.GameState.town) {
        const town_shop = player.town().shop;

        if (town_shop !== undefined) {
            return town_shop;
        }
    }

    if (App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Champion Lance')]() > 0) {
        return pokeMartShop;
    }

    return null;
}

shop_modal.on('show.bs.modal', () => { add_scope('shop'); });
shop_modal.on('hide.bs.modal', () => { remove_scope('shop'); });

ShopHandler.resetAmount = function() {};

bind_key("shift-1", () => { ShopHandler.multiplyAmount(10); }, "shop");
bind_key("shift-2", () => { ShopHandler.multiplyAmount(0.1); }, "shop");
