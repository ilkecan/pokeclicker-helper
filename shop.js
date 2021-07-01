const shop_modal = $( '#shopModal' );
shop_modal.on('show.bs.modal', () => { add_scope('shop'); });
shop_modal.on('hide.bs.modal', () => { remove_scope('shop'); });

keymage('shop', 'shift-1', () => { ShopHandler.multiplyAmount(10); }, { preventDefault: true });
keymage('shop', 'shift-2', () => { ShopHandler.multiplyAmount(0.1); }, { preventDefault: true });
