var canvas = document.getElementById("pong-canv");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var ballsize = 20;
var ballx = width/2;
var bally = 60;
var leftscore = 0;
var rightscore = 0;
var boardWidth = 20;
var boardHeight = 60;
var leftboard = [width/4-boardWidth/2,Math.floor(height/3.75)];
var rightboard = [width*0.75-boardWidth/2,Math.floor(height/10)];
var ballxspeed = 2;
var ballyspeed = Math.floor(Math.random()*3)+1;
var leftWin = "win/left.png";
var rightWin = "win/right.png";
var tie = "win/tie.png";
var whowin = function(){
    if(leftscore>rightscore){
        return leftWin;
    }else if(rightscore>leftscore){
        return rightWin;
    }else{
        return tie;
    }
};
var getWin = function(){
    $("#whowin").html('<img src="'+whowin()+'" class="winner"/>');
    alert("时间到！");
};
var move = function(){
    ballx+=ballxspeed;
    bally+=ballyspeed;
};
var bounce = function(){
    if (ballx<0){
        ballxspeed*=-1;
        rightscore+=1;
    }
    if (ballx+ballsize>width){
        ballxspeed*=-1;
        leftscore+=1;
    }
    if (bally<0||bally+ballsize>height){
        ballyspeed*=-1;
    }
    if (ballx<width/2){
        if ((ballx<leftboard[0]+boardWidth)&&(ballx+ballsize>leftboard[0])){
            if ((bally+ballsize>leftboard[1])&&(bally<leftboard[1]+boardHeight)){
                if (ballxspeed<0){
                    ballxspeed*=-1;
                }
            }
        }
    }else{
        if ((ballx<rightboard[0]+boardWidth)&&(ballx+ballsize>rightboard[0])){
            if ((bally+ballsize>rightboard[1])&&(bally<rightboard[1]+boardHeight)){
                if (ballxspeed>0){
                    ballxspeed*=-1;
                }
            }
        }
    }
};
var draw = function(){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "Black";
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = "White";
    ctx.fillRect(leftboard[0],leftboard[1],boardWidth,boardHeight);
    ctx.fillRect(rightboard[0],rightboard[1],boardWidth,boardHeight);
    var imagePath;
    if(ballxspeed>0){
        imagePath="cat1.png";
    }else{
        imagePath="cat2.png";
    }
    $("#pic").html('<img src="'+imagePath+'" width="'+ballsize.toString()+'" height="'+ballsize.toString()+'" style="position:absolute;left:'+ballx+'px;top:'+bally+'px;"/>');
    ctx.font = "34px SimHei";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(leftscore.toString(),width/4,0);
    ctx.fillText(rightscore.toString(),width*0.75,0);
    ctx.font = "14px SimHei";
    ctx.fillText("Click W and S to control the left board,click ↑ or ↓ to control the right board",width/2,height*0.66)
};
var keys = {
    87:"w",
    83:"s",
    38:"up",
    40:"down"
};
$("html").keydown(function(event){
    var k = keys[event.keyCode];
    if(k === "w" && leftboard[1]>10){
        leftboard[1]-=10;
    }
    if(k === "s" && leftboard[1]<height-10){
        leftboard[1]+=10;
    }
    if(k === "up" && rightboard[1]>10){
        rightboard[1]-=10;
    }
    if(k === "down" && rightboard[1]<height-10){
        rightboard[1]+=10;
    }
});
var gameloop = setInterval(function(){
    move();
    bounce();
    draw();
},30);
var time = 60*5;
$("#time").text("剩余时间："+time.toString());
var timeloop = setInterval(function(){
    time -= 1;
    $("#time").text("剩余时间："+time.toString());
    if(time<1){
        $("#time").text("剩余时间：0");
        getWin();
        clearInterval(gameloop);
        clearInterval(timeloop);
    }
},1000);