vitamin_modal.on('show.bs.modal', () => { add_scope('vitamin'); });
vitamin_modal.on('hide.bs.modal', () => { remove_scope('vitamin'); });

for (let i = 1; i <= VitaminController.multiplier.length; i += 1) {
    keymage('vitamin', `shift-${i}`, () => { VitaminController.multiplierIndex(i - 1); }, { preventDefault: true });
}
