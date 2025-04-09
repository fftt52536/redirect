class Pos {
    /**
     *
     * @param {number | Pos | number[2]} x
     * @param {number | undefined} y
     */
    constructor(x, y) {
        if (typeof y === "undefined") {
            if (x !== undefined && x !== null) {
                if (x[1]) {
                    y = x[1];
                    x = x[0];
                } else if (x.x) {
                    y = x.y;
                    x = x.x;
                } else {
                    x = 0;
                    y = 0;
                }
            }
        }
        this.x = parseFloat(x) || 0;
        this.y = parseFloat(y) || 0;
    }

    /**
     *
     * @param {Pos} pos
     */
    copy(pos) {
        this.x = pos.x;
        this.y = pos.y;
        return this;
    }

    /**
     *
     * @param {number | Pos | number[2]} x
     * @param {number | undefined} y
     */
    add(x, y) {
        if (typeof y === "undefined") {
            if (x !== undefined && x !== null) {
                if (x[1]) {
                    y = x[1];
                    x = x[0];
                } else if (x.x) {
                    y = x.y;
                    x = x.x;
                } else {
                    x = 0;
                    y = 0;
                }
            }
        }
        this.x += parseFloat(x) || 0;
        this.y += parseFloat(y) || 0;
        return this;
    }

    /**
     *
     * @param {number | Pos | number[2]} x
     * @param {number | undefined} y
     */
    set(x, y) {
        if (typeof y === "undefined") {
            if (x !== undefined && x !== null) {
                if (x[1]) {
                    y = x[1];
                    x = x[0];
                } else if (x.x) {
                    y = x.y;
                    x = x.x;
                } else {
                    x = 0;
                    y = 0;
                }
            }
        }
        this.x = parseFloat(x) || 0;
        this.y = parseFloat(y) || 0;
        return this;
    }

    /**
     *
     * @param {Pos} pos
     * @returns {number}
     */
    distance(pos) {
        var xdiff = pos.x - this.x,
            ydiff = pos.y - this.y;
        var d = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
        return d;
    }
}

/**
 *
 * @param {HTMLElement} elem
 */
Pos.offset = function (elem) {
    var res = new Pos(0, 0);
    for (var i = elem; i; i = i.offsetParent) {
        res.add(i.offsetLeft, i.offsetTop);
        if (i.style.transform.indexOf("translate") >= 0) {
            var tstr = i.style.transform;
            var matches = tstr.match(/translate(3d)?\(.*\)/g);
            if (matches)
                for (var match of Array.from(matches)) {
                    var gets = match.match(/translate(3d)?\((.*\))/);
                    var xy = gets[2];
                    var xylist = xy.split(",");
                    var left = xylist[0],
                        top = xylist[1];
                    res.add(left, top);
                }
        }
    }
    return res;
};

/**
 *
 * @param {HTMLElement} elem
 */
Pos.offsetBottom = function (elem) {
    var res = new Pos(0, 0);
    for (var i = elem; i; i = i.offsetParent) {
        res.add(i.offsetLeft, i.offsetTop);
        if (i.style.transform.indexOf("translate") >= 0) {
            var tstr = i.style.transform;
            var matches = tstr.match(/translate(3d)?\(.*\)/g);
            if (matches)
                for (var match of Array.from(matches)) {
                    var gets = match.match(/translate(3d)?\((.*\))/);
                    var xy = gets[2];
                    var xylist = xy.split(",");
                    var left = xylist[0],
                        top = xylist[1];
                    res.add(left, top);
                }
        }
    }
    res.add(0, elem.offsetHeight);
    return res;
};

/**
 *
 * @param {HTMLElement} inner
 */
window.CodeToys = function (inner, callback) {
    var _uid = 1;
    function uid() {
        return _uid++;
    }

    inner.className = "ct";

    var template =
        '<input type="checkbox" class="folder" checked/><div class="wrap"></div>';

    var treePadding = 6;

    var moving = null,
        moveTime = 0,
        moveCoords = [];

    function setPadding(pding) {
        treePadding = pding;
    }

    /**
     * Move the block tree.
     * @param {HTMLElement} tree
     * @param {Number} x
     * @param {Number} y
     */
    function setTreePos(tree, x, y) {
        var left = x - treePadding,
            top = y - treePadding;
        tree.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        //tree.style.left = left + 'px';
        //tree.style.top = top + 'px';
    }

    /**
     * Add a block into the block tree.
     * @param {HTMLElement} tree
     * @param {HTMLElement} elem
     */
    function addToTree(tree, elem) {
        var x = tree.querySelector(".wrap");
        if (!x) throw new Error("积木树不完整");
        x.append(elem);
    }

    /**
     * Create A Block Tree.
     * @returns {HTMLElement}
     */
    function requestNewTree() {
        var t = document.createElement("div");
        t.className = "tree";
        t.innerHTML = template;
        inner.append(t);
        return t;
    }

    /**
     * Clear all lights.
     */
    function clearLights() {
        inner.classList.remove("shadow");
        var lights = inner.querySelectorAll(".light, .light-in, .light-input");
        Array.from(lights).forEach(function (s) {
            s.classList.remove("light");
            s.classList.remove("light-top");
            s.classList.remove("light-in");
            s.classList.remove("light-input");
        });
        var hovers = inner.querySelectorAll(".hover");
        Array.from(hovers).forEach(function (s) {
            s.classList.remove("hover");
        });
    }

    /**
     * Gives the block an id.
     * @param {HTMLElement} block
     */
    function makeid(block) {
        block.setAttribute("data-id", uid() + "");
    }

    /**
     * Highlight the connection if it can connect.
     * @param {HTMLElement} block
     */
    function lightIfCanConnect(block) {
        var xy = Pos.offset(block);
        var canConnectTree = document.elementsFromPoint(xy.x, xy.y);

        var cti = canConnectTree.filter(function (r) {
            if (r.className === "input" && block.classList.contains("reporter") && !r.querySelector(".block")) {
                return true;
            }
        })[0];
        if (cti) {
            cti.classList.add("light-input");
            return;
        }

        var ctr = canConnectTree.filter(function (r) {
            if (
                r.className === "tree" &&
                !r.querySelector(".block") &&
                !block.classList.contains("reporter")
            ) {
                return true;
            }
        })[0];
        if (ctr) {
            ctr.classList.add("light-in");
            return;
        }
        var blocks = inner.querySelectorAll(".block");
        var lists = Array.from(blocks)
            .map(function (s) {
                var dt = Pos.offset(s).distance(xy),
                    db = Pos.offsetBottom(s).distance(xy);
                if (dt > db) {
                    return [db, s, false];
                }
                return [dt, s, true];
            })
            .filter(function (s) {
                if (
                    s[1].dataset.hidden === "true" ||
                    s[1].classList.contains("reporter") ||
                    block.classList.contains("reporter")
                )
                    return false;
                if (s[1].dataset.id === block.dataset.id) return false;
                if (
                    s[1].closest(".tree").contains(block) ||
                    block.closest(".tree").contains(s[1])
                )
                    return false;
                return s[0] < 60;
            });
        var best = lists.sort(function (a, b) {
            return a[0] - b[0];
        })[0];
        if (best) {
            var tgt = best[1];
            var shouldConnectTop = false;
            if (
                best[2] &&
                !tgt.previousElementSibling &&
                tgt.dataset.connector !== "true" &&
                xy.y < Pos.offset(tgt).y
            ) {
                shouldConnectTop = true;
            }
            tgt.classList.add("light");
            shouldConnectTop && tgt.classList.add("light-top");
        }
    }

    /**
     * Move a tree to the top!
     * @param {HTMLElement} tree
     */
    function giveFront(tree) {
        var curZIndex = parseInt(tree.style.zIndex);
        var mx = 0;
        var bs = inner.querySelectorAll(".tree");
        if (curZIndex) {
            Array.from(bs).forEach(function (bl) {
                var zi = parseInt(bl.style.zIndex);
                if (zi === curZIndex) return;
                if (zi && zi > curZIndex) zi--;
                bl.style.zIndex = zi + "";
                if (zi > mx) mx = zi;
            });
        } else {
            Array.from(bs).forEach(function (bl) {
                var zi = parseInt(bl.style.zIndex);
                if (zi > mx) mx = zi;
            });
        }
        tree.style.zIndex = ++mx;
    }

    /**
     * Handling Mouse Moving
     * @param {MouseEvent} e
     */
    function mousemove(e) {
        clearLights();
        if (!moving) return;
        if (Date.now() - moveTime < 300) return;
        var innerPos = Pos.offset(inner);
        var x = e.pageX - innerPos.x - moveCoords[0];
        var y = e.pageY - innerPos.y - moveCoords[1];
        var tree = moving.closest(".tree");
        if (moving.classList.contains("reporter") && moving.parentElement.closest(".block")) {
            tree = requestNewTree();
            addToTree(tree, moving);
            giveFront(tree);
        } else {
            if (moving.previousElementSibling || tree.dataset.fixed === "true") {
                tree = requestNewTree();
                var elems = [];
                for (var el = moving; el; el = el.nextElementSibling) {
                    elems.push(el);
                }
                elems.forEach(function (e) {
                    addToTree(tree, e);
                });

                giveFront(tree);
            }
        }
        setTreePos(tree, x, y);
        if(Pos.offset(moving).x - Pos.offset(inner).x < 250) inner.classList.add("shadow");
        tree.classList.add("hover");
        lightIfCanConnect(moving);
    }

    /**
     * Handling Mouseup
     */
    function mouseup() {
        clearLights();
        if (moving) {
            if(Pos.offset(moving).x - Pos.offset(inner).x < 250) 
                moving.closest(".tree").remove();
            lightIfCanConnect(moving);
            var tri = inner.querySelector(".light-input");
            if (tri) {
                if (moving.classList.contains("reporter")) {
                    tri.querySelector(".textInput").value = "";
                    moving.closest(".tree").remove();
                    tri.querySelector(".blockInput").append(moving);
                    tri.style.width = 'auto';
                }
            } else {
                var tre = inner.querySelector(".light-in");
                if (tre) {
                    var elems = [];
                    for (var el = moving; el; el = el.nextElementSibling) {
                        elems.push(el);
                    }
                    moving.closest(".tree").remove();
                    tre.querySelector(".wrap").append(moving);
                    for (var i = 1; i < elems.length; i++) {
                        tre.querySelector(".wrap").append(elems[i]);
                    }
                } else {
                    var tgt = inner.querySelector(".light");
                    if (tgt) {
                        var top = tgt.classList.contains("light-top");
                        if (tgt.dataset.hidden === "true") top = false;

                        var elems = [];
                        for (var el = moving; el; el = el.nextElementSibling) {
                            elems.push(el);
                        }
                        moving.closest(".tree").remove();
                        tgt.insertAdjacentElement(top ? "beforebegin" : "afterend", moving);
                        for (var i = 1; i < elems.length; i++) {
                            elems[i - 1].insertAdjacentElement("afterend", elems[i]);
                        }
                        giveFront(tgt.closest(".tree"));
                    }
                }
            }
        }
        clearLights();
        if (moving) moving.closest(".tree").classList.remove("hover");
        moving = null;
        moveTime = 0;
        moveCoords = [];
        callback();
    }

    function getBlock(e) {
        var x = e.pageX,
            y = e.pageY;
        var elems = document.elementsFromPoint(x, y);
        var first = Array.from(elems).find(function (el) {
            return inner.contains(el) && el.classList.contains("block");
        });
        return first;
    }

    /**
     * Handling Mousedown ON A BLOCK
     * @param {MouseEvent} e
     */
    function mousedown(e) {
        var ip = e.target.closest(".textInput");
        if (ip) return; //Disables text inputs
        var el = getBlock(e);
        if (!el) return;
        if (el.dataset.hidden === "true") return;
        moving = el;
        moveTime = Date.now();
        var offset = Pos.offset(el);
        moveCoords = [e.pageX - offset.x, e.pageY - offset.y];
    }

    /**
     * Handling Mousedown ON A TREE
     * @param {MouseEvent} e
     */
    function treeclick(e) {
        var t = getBlock(e);
        if (!t) return;
        t = t.closest(".tree");
        if (!t) return;
        giveFront(t);
    }

    /**
     * Handling Right Mouse Button ON A BLOCK(To disable the block)
     * @param {MouseEvent} e
     */
    function contextmenu(e) {
        e.preventDefault();
        /*var el = e.target.closest(".ct>.tree"),
            tp = e.target.closest(".block");
        if (!el) return;
        var hid = tp.dataset.hidden === "true" ? false : true;

        Array.from(el.querySelectorAll(".textInput")).forEach(function (e) {
            if (hid) e.setAttribute("disabled", "disabled");
            else e.removeAttribute("disabled");
        });
        var b = Array.from(el.querySelectorAll(".block"));
        b.forEach(function (bl) {
            bl.dataset.hidden = hid ? "true" : "false";
        });*/
        
        var tree = requestNewTree(),
            tp = e.target.closest(".block");
        var elems = [];
        for (var el = tp; el; el = el.nextElementSibling) {
            elems.push(el);
        }
        elems.forEach(function (e) {
            addToTree(tree, e.cloneNode(true));
        });
        var xy = Pos.offset(tp), oxy = Pos.offset(inner);
        setTreePos(tree, xy.x - oxy.x + 30, xy.y - oxy.y + 30);
        giveFront(tree);
        callback();
    }

    /**
     * Listening Events.
     * @param {string} e
     * @param {function} f
     */
    function listen(e, f) {
        inner.addEventListener(e, f);
    }

    listen("mousedown", mousedown);
    listen("mouseup", mouseup);
    listen("mousemove", mousemove);
    listen("mousedown", treeclick);
    listen("contextmenu", contextmenu);

    return { requestNewTree, addToTree, makeid, giveFront, setPadding, setTreePos }; //For test
};
