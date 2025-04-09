var cv = document.createElement("canvas");
var p = cv.getContext("2d");
var widthPerChar = 8;
function iw(e){
    var src = e.closest(".textInput");
    if(!src) return;
    var v = src.value;
    var style = window.getComputedStyle(src);
    p.font = style.font;
    var w = p.measureText(v).width + 5;
    src.parentElement.style.width = w + 'px';
}
CodeToys.init = function(block){
    Array.from(block.querySelectorAll(".input")).map(function(n){
        var t = n.querySelector(".textInput");
        if(n.querySelector(".block")) n.style.width = "auto";
        else iw(t);
    });
}
document.documentElement.addEventListener("input", function(e){
    iw(e.target);
});