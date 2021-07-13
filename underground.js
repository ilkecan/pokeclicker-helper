function select_tool(name) {
    Mine.toolSelected(Mine.Tool[name]);
}

function use_item(name) {
    ItemList[name].use();
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

DailyDeal.prototype.get_profit = function() {
    let item1_value = this.item1.value;
    let item2_value = this.item2.value;
    let item1_amount = this.amount1;
    let item2_amount = this.amount2;

    if (this.item1.valueType !== "Diamond") {
        item1_value = 0;

        if (this.item1.isStone()) {
            item1_amount = 0;
        }
    }

    if (this.item2.valueType !== "Diamond") {
        item2_value = 0;

        if (this.item2.isStone()) {
            item2_amount = 0;
        }
    }

    if (item1_value === 0 && item2_value === 0) {
        const profit = item2_amount - item1_amount;

        if (profit === 0) {
            return "---";
        } else if (profit > 0) {
            return `+${profit.toString().padEnd(2)}📦`;
        } else {
            return `${profit.toString().padEnd(3)}📦`;
        }
    } else {
        const profit = item2_amount * item2_value - item1_amount * item1_value;

        if (profit === 0) {
            return "---";
        } else if (profit > 0) {
            return `+${profit.toString().padEnd(2)}💎`;
        } else {
            return `${profit.toString().padEnd(3)}💎`;
        }
    }
}

$( document ).ready(() => {
    $( "#dailyDeals th:last-child" ).before($( "<th>" ).text("Profit"));
    $( "#dailyDeals td:last-child" ).before($( "<td>", {
        class: "vertical-middle",
        "data-bind": "text: get_profit()",
    }));
});

keymage('underground', 'shift-1', () => { select_tool("Chisel"); }, { preventDefault: true });
keymage('underground', 'shift-2', () => { select_tool("Hammer"); }, { preventDefault: true });

keymage('underground', 'ctrl-1', () => { use_item("SmallRestore"); }, { preventDefault: true });
keymage('underground', 'ctrl-2', () => { use_item("MediumRestore"); }, { preventDefault: true });
keymage('underground', 'ctrl-3', () => { use_item("LargeRestore"); }, { preventDefault: true });
