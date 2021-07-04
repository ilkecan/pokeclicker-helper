const achievements_modal = $( "#achievementsModal" );
const pokedex_modal = $( "#pokedexModal" );
const farm_modal = $( "#farmModal" );
const day_care_modal = $( "#breedingModal" );
const items_modal = $( "#showItemsModal" );
const log_book_modal = $( "#logBookModal" );
const vitamin_modal = $( "#pokemonSelectorModal" );
const oak_items_modal = $( "#oakItemsModal" );
const quest_modal = $( "#QuestModal" );
const shop_modal = $( "#shopModal" );
const travel_modal = $( "#ShipModal" );
const underground_modal = $( "#mineModal" );
const shard_modal = $( "#shardModal" );

function toggle_modal(modal) {
    modal.modal("toggle");
}

function close_modal(modal) {
    modal.modal("hide");
}

function toggle_shop_modal() {
    if (!shop_modal.hasClass("show")) {
        const shop = get_shop();

        if (shop !== null) {
            ShopHandler.showShop(shop);
        } else {
            Notifier.notify({
                message: "You are not currently in a town that has a shop and you also do not have access to the Poké Mart shortcut.",
                type: NotificationConstants.NotificationOption.danger,
            });
            return;
        }
    }

    toggle_modal(shop_modal);
}

function toggle_shard_modal() {
    if (!shard_modal.hasClass("show")) {
        App.game.shards.openShardModal();
    } else {
        close_modal(shard_modal);
    }
}

function toggle_travel_modal() {
    if (!travel_modal.hasClass("show")) {
        MapHelper.openShipModal();
    } else {
        close_modal(travel_modal);
    }
}

function toggle_farm_modal() {
    if (!farm_modal.hasClass("show")) {
        FarmController.openFarmModal();
    } else {
        close_modal(farm_modal);
    }
}

function toggle_day_care_modal() {
    if (!day_care_modal.hasClass("show")) {
        BreedingController.openBreedingModal();
    } else {
        close_modal(day_care_modal);
    }
}

function toggle_oak_items_modal() {
    if (App.game.oakItems.canAccess()) {
        toggle_modal(oak_items_modal);
    }
}

function toggle_quest_modal() {
    if (QuestLineHelper.isQuestLineCompleted('Tutorial Quests')) {
        toggle_modal(quest_modal);
    }
}

function toggle_underground_modal() {
    if (App.game.underground.canAccess()) {
        toggle_modal(underground_modal);
    }
}

keymage('ctrl-f', () => { toggle_farm_modal(); }, { preventDefault: true });
keymage('ctrl-h', () => { toggle_day_care_modal(); }, { preventDefault: true });
keymage('ctrl-o', () => { toggle_oak_items_modal(); }, { preventDefault: true });
keymage('ctrl-q', () => { toggle_quest_modal(); }, { preventDefault: true });
keymage('ctrl-s', () => { toggle_shop_modal(); }, { preventDefault: true });
keymage('ctrl-t', () => { toggle_travel_modal(); }, { preventDefault: true });
keymage('ctrl-u', () => { toggle_underground_modal(); }, { preventDefault: true });
keymage('ctrl-z', () => { toggle_shard_modal(); }, { preventDefault: true });

keymage('ctrl-a', () => { toggle_modal(achievements_modal); }, { preventDefault: true });
keymage('ctrl-d', () => { toggle_modal(pokedex_modal); }, { preventDefault: true });
keymage('ctrl-i', () => { toggle_modal(items_modal); }, { preventDefault: true });
keymage('ctrl-l', () => { toggle_modal(log_book_modal); }, { preventDefault: true });
keymage('ctrl-p', () => { toggle_modal(vitamin_modal); }, { preventDefault: true });
