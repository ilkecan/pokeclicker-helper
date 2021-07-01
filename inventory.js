function set_vitamin_multiplier(index) {
    VitaminController.multiplierIndex(index);
}

const vitamin_modal = $( '#pokemonSelectorModal' );
vitamin_modal.on('show.bs.modal', () => { add_scope('vitamin'); });
vitamin_modal.on('hide.bs.modal', () => { remove_scope('vitamin'); });

keymage('vitamin', 'shift-1', () => { set_vitamin_multiplier(0); }, { preventDefault: true });
keymage('vitamin', 'shift-2', () => { set_vitamin_multiplier(1); }, { preventDefault: true });
keymage('vitamin', 'shift-3', () => { set_vitamin_multiplier(2); }, { preventDefault: true });
keymage('vitamin', 'shift-4', () => { set_vitamin_multiplier(3); }, { preventDefault: true });
