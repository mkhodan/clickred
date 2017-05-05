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
  console.log(timeoutSeconds);
  if(isPrime(score))badBlocksCount++;
  if(!isGameActive) return;
  let target = event.target;
  if(target.className.includes('good')){
    score++;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    startGame();
  } else if(target.className.includes('bad')){
    gameOver();
  } else {
    gameOver();
  }
});

function eraseAll(){
  timeoutSeconds -= timeoutSeconds*0.02;
  document.getElementById('main').innerHTML = '';
}

function gameOver(){
  document.getElementById('sb_score').innerHTML = 'Score: ' + score;
  isGameActive = false;
  clearTimeout(timeoutid);
  document.getElementById('playfield').style.display = 'none';
  document.getElementById('submitter').style.display = 'block';
  let scores =[];
  firebase.database().ref('/scores').once("value", function(data) {
    for(let sc in data.val()){
      scores.push(data.val()[sc]);
    }
    console.log(scores);
  });
  // firebase.database().ref('/scores').push({name:name||'guest',score: score});
}

function submitScore(){
  let name = document.getElementById("sb_name").value;
  firebase.database().ref('/scores').push({name:name||'guest',score: score});
  document.getElementById('playfield').style.display = 'block';
  document.getElementById('submitter').style.display = 'none';
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
    gameOver();
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
