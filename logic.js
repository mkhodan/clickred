let goodBlocksCount = 1;
let badBlocksCount = 1;
let score = 0;
let isGameActive = true;
let timeoutid = 0;
let timeoutSeconds = 3000;
let scores = [];
loadScores();
startGame();

function loadScores(){
  scores = [];
  firebase.database().ref('/scores').once("value", function(data) {
    for(let sc in data.val()){
      scores.push(
        {
          score:data.val()[sc].score,
          name:data.val()[sc].name,
          key:sc,
        }
    );
    }
    scores = scores.sort((a,b)=>{
      return b.score - a.score;
    });
    let scOl = document.getElementById('top_scores');
    scOl.innerHTML = "";
    for(let i = 0; i < scores.length; i++){
      let item = document.createElement('tr');
      let td1 = document.createElement('td');
      let td2 = document.createElement('td');
      let td3 = document.createElement('td');
      td1.innerHTML = i + 1;
      td2.innerHTML = scores[i].name;
      td3.innerHTML = scores[i].score;
      item.appendChild(td1);
      item.appendChild(td2);
      item.appendChild(td3);
      scOl.appendChild(item);
    }
  });
}

function restart(){
  document.getElementById('playfield').style.display = 'block';
  document.getElementById('submitter').style.display = 'none';
  isGameActive = true;
  score = 0;
  document.getElementById('score').innerHTML = 'Score: ' + score;
  goodBlocksCount = 1;
  badBlocksCount = 1;
  timeoutSeconds = 3000;
  startGame();
}


document.getElementById('main').addEventListener('click', (event)=>{
  console.log(timeoutSeconds);
  if(isPrime(score))badBlocksCount++;
  if(!isGameActive) return;
  let target = event.target;
  if(target.className.includes('good')){
    score++;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    startGame();
  } else if (target.className.includes('best')){
    score += 10;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    startGame();
  } else if (target.className.includes('bad')){
    gameOver();
  } else {
    gameOver();
  }
});

function eraseAll(){
  timeoutSeconds -= timeoutSeconds * 0.02;
  document.getElementById('main').innerHTML = '';
}

function gameOver(){
  document.getElementById('sb_score').innerHTML = 'Score: ' + score;
  isGameActive = false;
  clearTimeout(timeoutid);
  document.getElementById('playfield').style.display = 'none';
  document.getElementById('submitter').style.display = 'block';

  if(scores.length === 0){
    document.getElementById('ng_area').style.display = 'none';
    document.getElementById('sb_area').style.display = 'block';
  } else if(score > scores[scores.length - 1].score || scores.length < 10){
    document.getElementById('ng_area').style.display = 'none';
    document.getElementById('sb_area').style.display = 'block';
  } else{
    document.getElementById('ng_area').style.display = 'block';
    document.getElementById('sb_area').style.display = 'none';
  }
}

function submitScore(){
  let name = document.getElementById("sb_name").value;
  if(scores.length === 0){
    firebase.database().ref('/scores').push({name:name||'guest',score: score});
  } else if(scores.length < 10){
    firebase.database().ref('/scores').push({name:name||'guest',score: score});
  }else if(score > scores[scores.length - 1].score){
    firebase.database().ref('/scores').child(scores[scores.length - 1].key).remove();
    firebase.database().ref('/scores').push({name:name||'guest',score: score});
  }
  loadScores();
  restart();
}

function drawAll(){
  initGoodBlocks();
  initBadBlocks();
  initExtraGoodBlocks();
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
  let leMain = document.getElementById('main');
  for(let i = 0; i < goodBlocksCount; i++){
    let block = document.createElement('div');
    block.className = 'item good';
    block.style.top = Math.floor(Math.random() * 615);
    block.style.left = Math.floor(Math.random() * 975);
    document.getElementById('main').appendChild(block);
  }
}

function initBadBlocks(){
  for(let i = 0; i < badBlocksCount; i++){
    let block = document.createElement('div');
    block.className = 'item bad';
    block.style.top = Math.floor(Math.random() * 615);
    block.style.left = Math.floor(Math.random() * 975);
    document.getElementById('main').appendChild(block);
  }
}

function initExtraGoodBlocks(){
  let bestBlockPossibility = Math.floor(Math.random() * 100);
  if(bestBlockPossibility > 55){
    let block = document.createElement('div');
    block.className = 'item best';
    block.style.top = Math.floor(Math.random() * 615);
    block.style.left = Math.floor(Math.random() * 975);
    document.getElementById('main').appendChild(block);
  }
}
