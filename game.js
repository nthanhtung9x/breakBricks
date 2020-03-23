var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var diem = document.getElementById('score');
var noti = document.getElementsByClassName('noti')[0];
var level = document.getElementsByClassName('list__item');

if(!localStorage.getItem('info')) {
    localStorage.setItem('info', [5,100]);
}
var total = localStorage.getItem('info');
var a = total.split(', ');

var ball = {
    x: 20,
    y: 20,
    dx:parseInt(a[0]),
    dy:2,
    r:10
}

var paddle = {
    width:parseInt(a[1]),
    height:10,
    x:0,
    y: canvas.height - 10,
    speed: 20,
    isMovingLeft:false,
    isMovingRight:false
}

var isGameOver = false;
var gameWin = false;

var bricksConfig = {
    offsetX: 25,
    offsetY: 25,
    margin:25,
    width:70,
    height:15,
    totalRow: 3,
    totalCol: 5
};

var score = 0;
var maxScore= bricksConfig.totalRow * bricksConfig.totalCol;

var bricksList = [];

for(var i = 0; i < bricksConfig.totalRow; i++){
    for(var j = 0; j < bricksConfig.totalCol; j++){
        bricksList.push({
            x: bricksConfig.offsetX + j * (bricksConfig.width + bricksConfig.margin),
            y: bricksConfig.offsetY + i * (bricksConfig.height + bricksConfig.margin),
            isBroken:false
        });
    }
}

function choseLevel(arr){
    localStorage.setItem('info', arr);
    var total = localStorage.getItem('info');
    var a = total.split(', ');
    ball.dx = parseInt(a[0]);
    paddle.width = parseInt(a[1]);
    location.reload();
}

function activeLevel(){
    var list = document.getElementById('list');
    var local = localStorage.getItem('info');
    var convertLocal = local.split(',');
    console.log(convertLocal[2]);
    for(var i = 0; i < level.length; i++){
        var a = level[i].value.split(',');
        if(convertLocal[2] === a[2]){
            list.selectedIndex = `${i}`;
        }  
    }
}

activeLevel();


function drawBall() {
    context.beginPath();
    context.arc(ball.x,ball.y,ball.r,0,Math.PI *2);
    context.fillStyle = 'red';
    context.fill();
    context.strokeStyle = '#fff';
    context.stroke();
    context.closePath();
}

function drawPaddle(){
    context.beginPath();
    context.rect(paddle.x,paddle.y,paddle.width,paddle.height);
    context.fill();
    context.closePath();
}

function drawBricks() {
   bricksList.forEach(function(b){
        if(!b.isBroken){
            context.beginPath();
            context.rect(b.x,b.y,bricksConfig.width,bricksConfig.height);
            context.fill();
            context.closePath();
        }
   });
}

document.addEventListener('keyup',function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = false;
    } 
    else if(event.keyCode == 39){
        paddle.isMovingRight = false;
    }
});

document.addEventListener('keydown',function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = true;
    } 
    else if(event.keyCode == 39){
        paddle.isMovingRight = true;
    }
});

//control mobile

var btnLeft = document.getElementsByClassName('btn__control')[0];
var btnRight = document.getElementsByClassName('btn__control')[1];

btnLeft.addEventListener('touchstart',function(event){
    if(event.target.id == parseInt(1)){
        paddle.isMovingLeft = true;
    }
    else if(event.target.id == parseInt(2)){
        paddle.isMovingRight = true;
    }
});

btnLeft.addEventListener('touchend',function(event){
    event.preventDefault();
    if(event.target.id == parseInt(1)){
        paddle.isMovingLeft = false;
    }
    else if(event.target.id == parseInt(2)){
        paddle.isMovingRight = false;
    }
});

btnRight.addEventListener('touchstart',function(event){
    if(event.target.id == parseInt(1)){
        paddle.isMovingLeft = true;
    }
    else if(event.target.id == parseInt(2)){
        paddle.isMovingRight = true;
    }
});

btnRight.addEventListener('touchend',function(event){
    event.preventDefault();
    if(event.target.id == parseInt(1)){
        paddle.isMovingLeft = false;
    }
    else if(event.target.id == parseInt(2)){
        paddle.isMovingRight = false;
    }
});

function triggerMoveBall() {
    if(ball.x < ball.r || ball.x > canvas.width - ball.r){
        ball.dx = -ball.dx;
    }

    if(ball.y < ball.r){
        ball.dy = -ball.dy;
    }
}

function triggerPaddle() {
    if(ball.x + ball.r >= paddle.x && ball.x + ball.r <= paddle.x + paddle.width && ball.y + ball.r >= canvas.height - paddle.height)
        ball.dy= -ball.dy;
}

function triggerBallBricks(){
    bricksList.forEach(function(b){
        if(!b.isBroken){
            if(ball.x >= b.x && ball.x <= b.x + bricksConfig.width && ball.y + ball.r >= b.y && ball.y - ball.r <= b.y + bricksConfig.height){
                ball.dy = -ball.dy;
                b.isBroken = true;
                score++;       
                diem.innerHTML = `${score}`;
                if(score == maxScore){
                    isGameOver = true;
                    gameWin = true;
                }
            }
        }
    });
}


function updateBallPosition(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition() {
    if(paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    }else if(paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }

    if(paddle.x < 0){
        paddle.x = 0;
    }else if(paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function checkGameOver() {
    if(ball.y > canvas.height - ball.r) {
        isGameOver = true;
    }
}

function GameOver() {
    if(gameWin){
        noti.className += ' active';
    }
    else {
        console.log('lose');
    }
}

function draw() {
    if(!isGameOver) {
        context.clearRect(0,0,canvas.width,canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
      
        triggerMoveBall();
        triggerPaddle();
        triggerBallBricks();

        updateBallPosition();
        updatePaddlePosition();
        
        checkGameOver();

        requestAnimationFrame(draw);
    }
    else {
        GameOver();
    }
}

draw();