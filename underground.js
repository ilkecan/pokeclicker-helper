function select_tool(name) {
    Mine.toolSelected(Mine.Tool[name]);
}

underground_modal.on('show.bs.modal', () => { add_scope('underground'); });
underground_modal.on('hide.bs.modal', () => { remove_scope('underground'); });

keymage('underground', 'shift-1', () => { select_tool("Hammer"); }, { preventDefault: true });
keymage('underground', 'shift-2', () => { select_tool("Chisel"); }, { preventDefault: true });
