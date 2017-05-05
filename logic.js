let goodBlocksCount = 1;
let badBlocksCount = 1;
let score = 0;
let isGameActive = true;
let timeoutid = 0;
let timeoutSeconds = 3000;
startGame();

document.getElementById('newgame').addEventListener('click', (event)=>{
  isGameActive = true;
  score = 0;
  document.getElementById('score').innerHTML = 'Score: ' + score;
  goodBlocksCount = 1;
  badBlocksCount = 1;
  timeoutSeconds = 3000;
  startGame();
});

document.getElementById('main').addEventListener('click', (event)=>{
  if(isPrime(score))badBlocksCount++;
  if(!isGameActive) return;
  let target = event.target;
  if(target.className.includes('good')){
    score++;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    startGame();
  } else if(target.className.includes('bad')){
    document.getElementById('score').innerHTML = 'Score: ' + score + ', GAME OVER!';
    isGameActive = false;
    clearTimeout(timeoutid);
  } else {
    document.getElementById('score').innerHTML = 'Score: ' + score + ', GAME OVER!';
    isGameActive = false;
    clearTimeout(timeoutid);
  }
});

function eraseAll(){
  timeoutSeconds -= 10;
  document.getElementById('main').innerHTML = '';
}

function drawAll(){
  initGoodBlocks();
  initBadBlocks();
}

function startGame(){
  clearTimeout(timeoutid);
  eraseAll();
  drawAll();
  timeoutid = setTimeout(function () {
    document.getElementById('score').innerHTML = 'Score: ' + score + ', GAME OVER!';
    isGameActive = false;
  }, timeoutSeconds);
}

function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}

function initGoodBlocks(){
  for(let i = 0; i < goodBlocksCount; i++){
    let block = document.createElement('div');
    block.className = 'item good';
    block.style.top = Math.floor(Math.random() * 775);
    block.style.left = Math.floor(Math.random() * 1175);
    document.getElementById('main').appendChild(block);
  }
}

function initBadBlocks(){
  for(let i = 0; i < badBlocksCount; i++){
    let block = document.createElement('div');
    block.className = 'item bad';
    block.style.top = Math.floor(Math.random() * 775);
    block.style.left = Math.floor(Math.random() * 1175);
    document.getElementById('main').appendChild(block);
  }
}
