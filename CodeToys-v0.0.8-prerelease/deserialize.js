CodeToys.JSON2Block = function(bl, tree, workspace, par){
    var opcode = bl.opcode;
    var pair = CodeToys.blocks.find(function(e){
        return e[0] === opcode;
    });
    var ble = CodeToys.addBlock(workspace, tree, opcode, pair[1], false, pair[2], pair[3], par);
    var inputs = bl.inputs || [];
    Array.from(ble.querySelectorAll(".input, .tree")).forEach(function(ip, i){
        if(typeof inputs[i] === 'string') ip.children[0].value = inputs[i];
        else if(Array.isArray(inputs[i])) CodeToys.JSON2Tree(inputs[i], ip, workspace);
        else CodeToys.JSON2Block(inputs[i], null, workspace, ip.children[1]);
    });
    CodeToys.init(ble);
};

CodeToys.JSON2Tree = function(json, tree, workspace){
    json.forEach(function(b){
        CodeToys.JSON2Block(b, tree, workspace, null);
    });
}

CodeToys.parseTree = function(json, workspace){
    var tree = workspace.requestNewTree();
    workspace.setTreePos(tree, json.x, json.y);
    CodeToys.JSON2Tree(json.inputs, tree, workspace);
}

CodeToys.parseJSON = function(json, workspace){
    json.forEach(function(tr){CodeToys.parseTree(tr, workspace)});
}

CodeToys.load = CodeToys.parseJSON;