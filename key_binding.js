const scopes = [ "main" ];

keymage.setScope(get_top_scope());

function get_top_scope() {
    if (scopes.length === 0) {
        return null;
    }

    return scopes[scopes.length - 1];
}

function add_scope(name) {
    scopes.push(name);
    keymage.setScope(name);
}

function remove_scope(name) {
    for (let i = scopes.length - 1; i >= 0; i -= 1) {
        if (scopes[i] === name) {
            scopes.splice(i, 1);
            keymage.setScope(get_top_scope());
            return;
        }
    }

    console.error(`Scope named "${name}" not found.`);
}

function bind_key(key_combo, callback, scope = "") {
    keymage(scope, key_combo, event => {
        if (GameController.focusedOnEditableElement(true)) {
            return;
        }

        callback();

        event.preventDefault();
    });
}
