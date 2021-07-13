const achievements_modal = $( "#achievementsModal" );
const day_care_modal = $( "#breedingModal" );
const farm_modal = $( "#farmModal" );
const items_modal = $( "#showItemsModal" );
const log_book_modal = $( "#logBookModal" );
const oak_items_modal = $( "#oakItemsModal" );
const pokedex_modal = $( "#pokedexModal" );
const quest_modal = $( "#QuestModal" );
const safari_battle_modal = $( "#safariBattleModal" );
const safari_modal = $( "#safariModal" );
const shard_modal = $( "#shardModal" );
const shop_modal = $( "#shopModal" );
const travel_modal = $( "#ShipModal" );
const underground_modal = $( "#mineModal" );
const vitamin_modal = $( "#pokemonSelectorModal" );

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

function toggle_safari_modal() {
    if (!Safari.canAccess()) {
        return;
    }

    if (!safari_modal.hasClass("show")) {
        Safari.openModal();
    } else {
        Safari.closeModal();
    }
}

bind_key("ctrl-f", toggle_farm_modal);
bind_key("ctrl-h", toggle_day_care_modal);
bind_key("ctrl-o", toggle_oak_items_modal);
bind_key("ctrl-q", toggle_quest_modal);
bind_key("ctrl-r", toggle_shard_modal);
bind_key("ctrl-s", toggle_shop_modal);
bind_key("ctrl-t", toggle_travel_modal);
bind_key("ctrl-u", toggle_underground_modal);
bind_key("ctrl-z", toggle_safari_modal);

bind_key("ctrl-a", () => { toggle_modal(achievements_modal); });
bind_key("ctrl-d", () => { toggle_modal(pokedex_modal); });
bind_key("ctrl-i", () => { toggle_modal(items_modal); });
bind_key("ctrl-l", () => { toggle_modal(log_book_modal); });
bind_key("ctrl-p", () => { toggle_modal(vitamin_modal); });
