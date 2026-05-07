const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const grid = 20

let fox=[{x:10,y:10}]
let meat={x:5,y:5}

let dx=0
let dy=0

let score=0
let bestScore=localStorage.getItem("foxRecord") || 0

document.getElementById("bestScore").innerText="Recorde: "+bestScore

let speed=150
let zen=false
let foxType="forest"

let gameInterval

const eatSound=document.getElementById("eatSound")
const hitSound=document.getElementById("hitSound")

/* IMAGENS */

const meatImg=new Image()
meatImg.src="assets/meat.png"

const foxImages={
forest:new Image(),
arctic:new Image(),
desert:new Image(),
dark:new Image()
}

foxImages.forest.src="assets/raposa.png"
foxImages.arctic.src="assets/coruja.png"
foxImages.desert.src="assets/caranguejo.png"
foxImages.dark.src="assets/morcego.png"

function startGame(){

let mode=document.getElementById("mode").value
foxType=document.getElementById("foxStyle").value

document.body.className=foxType

if(mode==="slow") speed=200
if(mode==="fast") speed=90
if(mode==="zen"){
speed=140
zen=true
}else{
zen=false
}

restartGame()

clearInterval(gameInterval)
gameInterval=setInterval(loop,speed)

}

function restartGame(){

fox=[{x:10,y:10}]
dx=0
dy=0
score=0

document.getElementById("score").innerText="Pontuação: 0"

spawnMeat()

}

function spawnMeat(){

meat.x=Math.floor(Math.random()*20)
meat.y=Math.floor(Math.random()*20)

}

function loop(){

move()
draw()

}

function move(){

let head={x:fox[0].x+dx,y:fox[0].y+dy}

if(zen){

if(head.x<0) head.x=19
if(head.x>19) head.x=0
if(head.y<0) head.y=19
if(head.y>19) head.y=0

}else{

if(head.x<0||head.x>19||head.y<0||head.y>19){
gameOver()
return
}

}

for(let i=1;i<fox.length;i++){
if(head.x===fox[i].x && head.y===fox[i].y && !zen){
gameOver()
return
}
}

fox.unshift(head)

if(head.x===meat.x && head.y===meat.y){

eatSound.currentTime=0
eatSound.play()

score++

document.getElementById("score").innerText="Pontuação: "+score

if(score>bestScore){
bestScore=score
localStorage.setItem("foxRecord",bestScore)
document.getElementById("bestScore").innerText="Recorde: "+bestScore
}

spawnMeat()

}else{
fox.pop()
}

}

function gameOver(){

hitSound.play()

alert("Game Over")

restartGame()

}

function draw(){

ctx.clearRect(0,0,400,400)

drawMeat()

for(let part of fox){
drawFox(part.x,part.y)
}

}

function drawFox(x,y){

ctx.drawImage(
foxImages[foxType],
x*grid,
y*grid,
20,
20
)

}

function drawMeat(){

ctx.drawImage(
meatImg,
meat.x*grid,
meat.y*grid,
20,
20
)

}

document.addEventListener("keydown",e=>{

if(e.key==="ArrowUp" && dy===0){
dx=0
dy=-1
}

if(e.key==="ArrowDown" && dy===0){
dx=0
dy=1
}

if(e.key==="ArrowLeft" && dx===0){
dx=-1
dy=0
}

if(e.key==="ArrowRight" && dx===0){
dx=1
dy=0
}

})