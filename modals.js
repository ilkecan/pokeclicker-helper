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

function toggle_shop_modal() {
    if (!shop_modal.hasClass("show")) {
        ShopHandler.showShop(get_shop());
    }

    toggle_modal(shop_modal);
}

keymage('ctrl-a', () => { toggle_modal(achievements_modal); }, { preventDefault: true });
keymage('ctrl-d', () => { toggle_modal(pokedex_modal); }, { preventDefault: true });
keymage('ctrl-f', () => { toggle_modal(farm_modal); }, { preventDefault: true });
keymage('ctrl-h', () => { toggle_modal(day_care_modal); }, { preventDefault: true });
keymage('ctrl-i', () => { toggle_modal(items_modal); }, { preventDefault: true });
keymage('ctrl-l', () => { toggle_modal(log_book_modal); }, { preventDefault: true });
keymage('ctrl-o', () => { toggle_modal(oak_item_modal); }, { preventDefault: true });
keymage('ctrl-p', () => { toggle_modal(vitamin_modal); }, { preventDefault: true });
keymage('ctrl-q', () => { toggle_modal(quest_modal); }, { preventDefault: true });
keymage('ctrl-s', () => { toggle_shop_modal(); }, { preventDefault: true });
keymage('ctrl-t', () => { toggle_modal(travel_modal); }, { preventDefault: true });
keymage('ctrl-u', () => { toggle_modal(underground_modal); }, { preventDefault: true });
keymage('ctrl-z', () => { toggle_modal(shard_modal); }, { preventDefault: true });
