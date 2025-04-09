/**
 * 
 * @param {HTMLElement} bl 
 */
CodeToys.block2JSON = function(bl){
    var j = {};
    j.opcode = bl.dataset.opcode;
    j.inputs = Array.from(bl.children).filter(function(s){return s.classList.contains("input") || s.classList.contains("tree")}).map(function(i){
        if(i.classList.contains("tree")) return CodeToys.tree2JSON(i);
        else if(!i.querySelector(".block")) return i.querySelector(".textInput").value;
        else return CodeToys.block2JSON(i.querySelector(".blockInput").children[0]);
    });
    return j;
}

/**
 * 
 * @param {HTMLElement} tree 
 */
CodeToys.tree2JSON = function(tree){
    var bls = Array.from(tree.querySelector(".wrap").children);
    var rjson = bls.map(CodeToys.block2JSON);
    return rjson;
};

CodeToys.toJSON = function(inner){
    var tree = Array.from(inner.children).filter(function(s){return s.classList.contains("tree")}).sort(function(a, b){
        return a.style.zIndex - b.style.zIndex;
    }).map(function(e){
        var j = {
            inputs: CodeToys.tree2JSON(e)
        };
        var o = Pos.offset(e), oi = Pos.offset(inner);
        j.x = o.x - oi.x;
        j.y = o.y - oi.y;
        return j;
    });
    return tree;
}

CodeToys.save = CodeToys.toJSON;