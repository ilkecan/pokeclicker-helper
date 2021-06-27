function select_tool(name) {
    Mine.toolSelected(Mine.Tool[name]);
}

keymage('shift-1', function() { select_tool("Hammer"); }, { preventDefault: true });
keymage('shift-2', function() { select_tool("Chisel"); }, { preventDefault: true });
