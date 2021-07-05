function select_tool(name) {
    Mine.toolSelected(Mine.Tool[name]);
}

underground_modal.on('show.bs.modal', () => { add_scope('underground'); });
underground_modal.on('hide.bs.modal', () => { remove_scope('underground'); });

const original_focused_on_editable_element = GameController.focusedOnEditableElement;
// dirty hack to prevent game's own key bindings for mining energy restores
GameController.focusedOnEditableElement = function() {
    if (underground_modal.hasClass("show")) {
        return true;
    }

    return original_focused_on_editable_element.call(this);
}

keymage('underground', 'shift-1', () => { select_tool("Hammer"); }, { preventDefault: true });
keymage('underground', 'shift-2', () => { select_tool("Chisel"); }, { preventDefault: true });
