var p_new = document.getElementById("pro_new");
var p_free = document.getElementById("pro_free");
var p_team = document.getElementById("pro_team");

var ps = { p_new, p_free, p_team };

function renderItem(nm, obj){
    var el = ps[nm];
    var n = document.createElement("div");
    n.className = "card mx-2";
    n.innerHTML = `

        ${obj.img ? `<img class="card-img-top" src=${JSON.stringify(obj.img)} />` : ""}

        <div class="card-body" style="cursor:pointer; ${obj.hot ? "outline:5px solid #ffaa6699;" : ""}">

            <h5 class="card-title">${obj.name}</h5>
            <div class="card-text">${obj.info}</div>
            <span class="btn ${obj.hot ? "btn-danger btn-lg" : "btn-primary"} mt-3">${obj.more || "查看更多"}</span>

        </div>

    `;
    n.onclick = function(){
        window.open(obj.src || "#");
    }
    el.append(n);
}

fetch("/API/products").then(s=>s.json()).then(j=>{
    j?.["new"]?.forEach(function(s){
        renderItem("p_new", s);
    });
    j?.["free"]?.forEach(function(s){
        renderItem("p_free", s);
    });
    j?.["team"]?.forEach(function(s){
        renderItem("p_team", s);
    });
});