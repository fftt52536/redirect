CodeToys.addBlock = function(workspace, tree, opcode, text, hidden, hasTree, isReporter, parent){
    if(!tree && !parent) {
        tree = workspace.requestNewTree();
        workspace.setTreePos(tree, Math.random() * 200 + 300, Math.random() * 400);
    }

    if(!hidden) hidden = false;
    var b = document.createElement("div");
    if(parent) parent.append(b);
    else workspace.addToTree(tree, b);
    b.innerHTML = text.replace(/\%(\d+)/g, "<span class='input'><input type='text' class='textInput'/><span class='blockInput'></span></span>");
    b.className = "block";// + (hasTree ? " clearRight" : '');
    b.dataset.opcode = opcode;
    b.dataset.hidden = (hidden ? "true" : "false");
    if(hasTree){
        var tr = workspace.requestNewTree();
        b.append(tr);
        b.append(document.createElement("br"));
        tr.dataset.fixed = "true";

        //addBlock(tr, "motion_glideTo", "在__秒内滑行到 X:__ Y:__");
    }
    if(isReporter) b.classList.add("reporter");
    workspace.makeid(b);
    return b;
}

// opcode text hasTree isReporter
CodeToys.blocks = [
    ["looks_output", "输出%1", false, false],
    ["controls_whileNot", "重复执行直到%1", true, false],
    ["controls_repeat", "重复%1次", true, false],
    ["variables_set", "将变量%1设为%2", false, false],
    ["variables_incr", "将变量%1增加%2", false, false],
    ["operator_add", "%1+%2", false, true],
    ["operator_minus", "%1-%2", false, true],
    ["operator_times", "%1*%2", false, true],
    ["operator_divide", "%1/%2", false, true],
    ["operator_greater", "%1>%2?", false, true],
    ["operator_less", "%1<%2?", false, true],
    ["operator_equal", "%1=%2?", false, true],
    ["variables_custom", "我的变量", false, true],
    ["looks_input", "等待用户输入，提示词%1", false, true]
];