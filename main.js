'use strict';
const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameHeader = document.querySelector('.game__header');
const gameHeaderRect = gameHeader.getBoundingClientRect();
const leftBtn = document.querySelector('.game__moveLeft');
const rightBtn = document.querySelector('.game__moveRight');
const gameLife = document.querySelector('.game__life');
let joyCharactor = document.querySelector('.game__field__joy');
let joyRect = document
  .querySelector('.game__field__joy')
  .getBoundingClientRect();
const gameRect = document.querySelector('.game').getBoundingClientRect();
const canvasRect = document.querySelector('#canvas').getBoundingClientRect();
const gameStartButton = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const bgSound = new Audio('./sound/bg.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const carrotSound = new Audio('./sound/carrot_pull.mp3');

let isStarted = false;
let JOY_X = 10;
let GAME_LIFE = 4;
let isJoyMovable = false;
let ANIMATION_TIMER = 0;
let CRATOR_MAKING_SPEED = 100;
let CARROT_MAKING_SPEED = 300;
let BUG_MAKING_SPEED = 250;
let CARROT_VELOCITY = 6;
let CRATOR_VELOCITY = 4;
let BUG_VELOCITY = 1;
let isTrapped = false;
let timer;
let GAME__TIME = 0;
let GAME__LEVEL = 1;

//게임난이도 조정
function level1() {
  CRATOR_MAKING_SPEED = 70;
  BUG_MAKING_SPEED = 200;
  CRATOR_VELOCITY = 6;
  GAME__LEVEL = 2;
}
function level2() {
  CRATOR_MAKING_SPEED = 50;
  CRATOR_VELOCITY = 7;
  GAME__LEVEL = 3;
}
function level3() {
  CRATOR_MAKING_SPEED = 35;
  CRATOR_VELOCITY = 7;
  BUG_MAKING_SPEED = 150;
  GAME__LEVEL = 4;
}
function level4() {
  CRATOR_MAKING_SPEED = 30;
  CRATOR_VELOCITY = 8;
  BUG_MAKING_SPEED = 100;
  BUG_VELOCITY = 2;
  GAME__LEVEL = 5;
}
function level5() {
  CRATOR_MAKING_SPEED = 25;
  CRATOR_VELOCITY = 8;
  BUG_MAKING_SPEED = 80;
  BUG_VELOCITY = 2;
  GAME__LEVEL = 6;
}
function defaultLevelSettings() {
  CRATOR_MAKING_SPEED = 100;
  CARROT_MAKING_SPEED = 300;
  BUG_MAKING_SPEED = 250;
  CARROT_VELOCITY = 6;
  CRATOR_VELOCITY = 4;
  BUG_VELOCITY = 1;
}
// 게임시작
gameStartButton.addEventListener('click', () => {
  joyCharactor.style.visibility = 'visible';
  isJoyMovable = true;
  if (isStarted) {
    stopGame();
  } else if (isStarted == false) {
    startGame();
  }
});
function startGame() {
  isStarted = true;
  isJoyMovable = true;
  GAME__TIME = 0;
  defaultLevelSettings();
  joyCharactor.style.transform = `rotate(0deg)`;
  // joyCharactor.style.visibility = 'visible';
  joyCharactor.style.display = 'block';
  doFrameWork();
  showStopButton();
  startGameTimer();
  updateLevelText(GAME__LEVEL);
  playSound(bgSound);
}
function stopGame() {
  isStarted = false;
  isJoyMovable = false;
  cancelAnimationFrame(animation);
  hidegameButton();
  stopSound(bgSound);
  clearInterval(timer);
}
function showStopButton() {
  const icon = gameStartButton.querySelector('.fa-play');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
}

function hidegameButton() {
  const icon = gameStartButton.querySelector('.fa-pause');
  icon.classList.add('fa-play');
  icon.classList.remove('fa-pause');
}
function startGameTimer() {
  timer = setInterval(() => {
    updateTimerText(GAME__TIME++);
    if (GAME__TIME == 11) {
      updateLevelText(GAME__LEVEL);
    } else if (GAME__TIME == 21) {
      updateLevelText(GAME__LEVEL);
    } else if (GAME__TIME == 31) {
      updateLevelText(GAME__LEVEL);
    } else if (GAME__TIME == 41) {
      updateLevelText(GAME__LEVEL);
    } else if (GAME__TIME == 51) {
      updateLevelText(GAME__LEVEL);
    } else if (GAME__TIME == 200) {
      gameWin();
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopGame();
        defaultLevelSettings();
      }, 500);
    }
  }, 1000);
}
function updateTimerText(time) {
  let minute = Math.floor(time / 60);
  let second = time % 60;
  gameTimer.innerText = `${minute}:${second}`;
}
updateTimerText(GAME__TIME);

function updateLevelText(level) {
  gameScore.innerText = `LV ${GAME__LEVEL}`;
}
updateLevelText(GAME__LEVEL);

// 캔버스 캐릭터생성
let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

canvas.width = gameRect.width;
canvas.height = gameRect.height;

// 장애물 정보
class Cactus {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
  }
  draw(Xdim, Ydim, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height); // x,y,사이즈
    ctx.drawImage(this.img, this.x - Xdim, this.y - Ydim);
  }
}
class Carrot extends Cactus {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
  draw(Xdim, Ydim, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height); // x,y,사이즈
    ctx.drawImage(this.img, this.x - Xdim, this.y - Ydim);
  }
}
class Bug extends Cactus {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
  draw(Xdim, Ydim, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height); // x,y,사이즈
    ctx.drawImage(this.img, this.x - Xdim, this.y - Ydim);
  }
}
function makeImage(imgPath, width, height) {
  let img = new Image();
  img.src = imgPath;
  img.style.width = `${width}rem`;
  img.style.height = `${height}rem`;
  return img;
}

let animation;
let cactusBox = [];
let carrotBox = [];
let bugBox = [];
function doFrameWork() {
  animation = requestAnimationFrame(doFrameWork); // 1초에 60번 작동하는 함수
  ANIMATION_TIMER++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  switch (GAME__TIME) {
    case 10:
      level1();
      break;
    case 20:
      level2();
      break;
    case 30:
      level3();
      break;
    case 40:
      level4();
      break;
    case 50:
      level5();
      break;
  }
  if (ANIMATION_TIMER % CRATOR_MAKING_SPEED === 0) {
    let cactus = new Cactus(
      randomNumber(0, gameRect.width),
      0,
      50,
      50,
      makeImage('./img/crator.png')
    );
    cactusBox.push(cactus);
  }
  if (ANIMATION_TIMER % CARROT_MAKING_SPEED === 0) {
    let carrot = new Carrot(
      randomNumber(0, gameRect.width),
      0,
      50,
      50,
      makeImage('./img/carrot.png')
    );
    carrotBox.push(carrot);
  }
  if (ANIMATION_TIMER % BUG_MAKING_SPEED === 0) {
    let bug = new Bug(
      randomNumber(0, gameRect.width),
      0,
      50,
      50,
      makeImage('./img/bug.png')
    );
    bugBox.push(bug);
  }
  cactusBox.forEach((cactus, index, array) => {
    if (Math.abs(cactus.y - gameRect.height) < 100) {
      array.splice(index, 1);
    }
    console.log(canvasRect);

    cactus.y += CRATOR_VELOCITY;
    checkColision(joyCharactor, cactus);
    cactus.draw(25, 65, 'transparent');
  });

  carrotBox.forEach((carrot, index, array) => {
    if (Math.abs(carrot.y - gameRect.height) < 100) {
      array.splice(index, 1);
    }
    carrot.y += CARROT_VELOCITY;
    checkColision2(joyCharactor, carrot);
    carrot.draw(10, 10, 'transparent');
  });
  bugBox.forEach((bug, index, array) => {
    if (Math.abs(bug.y - gameRect.height) < 100) {
      array.splice(index, 1);
    }
    bug.y += BUG_VELOCITY;
    checkColision3(joyCharactor, bug);
    bug.draw(0, 5, 'transparent');
  });
}

//이조이 캐릭터 방향키 설정
leftBtn.addEventListener('click', (e) => {
  console.log(e);

  if (isJoyMovable === false) {
    return;
  }
  if (JOY_X <= 1) {
    return;
  }
  JOY_X += -1;
  joyCharactor.style.left = `${JOY_X}rem`;
});
rightBtn.addEventListener('click', () => {
  if (isJoyMovable === false) {
    return;
  }
  if (JOY_X >= 20) {
    return;
  }
  JOY_X += 1;
  joyCharactor.style.left = `${JOY_X}rem`;
});
document.addEventListener('keydown', (e) => {
  if (isJoyMovable === false) {
    return;
  }
  if (e.key === 'ArrowLeft') {
    if (JOY_X <= 1) {
      return;
    }
    console.log(fieldRect);
    console.log(joyRect);

    JOY_X += -1;
    joyCharactor.style.left = `${JOY_X}rem`;
  } else if (e.key === 'ArrowRight') {
    if (JOY_X >= 50) {
      return;
    }
    JOY_X += 1;
    joyCharactor.style.left = `${JOY_X}rem`;
  }
});

// 충돌확인
function checkColision(joyCharactor, cactus) {
  let joyRect = joyCharactor.getBoundingClientRect();
  let x축차이;
  let y축차이 = Math.abs(joyRect.y - cactus.y);
  if (joyRect.x < cactus.x) {
    x축차이 = Math.abs(joyRect.x + 23 - cactus.x);
  } else {
    x축차이 = Math.abs(joyRect.x - cactus.x);
  }

  if (x축차이 < 35 && y축차이 < 55) {
    console.log('충돌');
    playSound(bugSound);
    cancelAnimationFrame(animation);
    isJoyMovable = false;
    if (isJoyMovable === false) {
      removeGameLife();
      setTimeout(() => {
        if (GAME_LIFE === 0) {
          gameOver();
          makeGameLife(GAME_LIFE);
          return;
        }

        restartGame();
      }, 100);
    }
  }
}
// 당근과 충돌확인
function checkColision2(joyCharactor, carrot) {
  let joyRect = joyCharactor.getBoundingClientRect();
  let x축차이;
  let y축차이 = Math.abs(joyRect.y - carrot.y);
  if (joyRect.x < carrot.x) {
    x축차이 = Math.abs(joyRect.x + 23 - carrot.x);
  } else {
    x축차이 = Math.abs(joyRect.x - carrot.x);
  }
  if (x축차이 < 35 && y축차이 < 55) {
    playSound(carrotSound);
    console.log('당근충돌');
    carrotBox.pop(carrot);
    addGameLife();
  }
}
// 버그와 충돌확인
function checkColision3(joyCharactor, bug) {
  let joyRect = joyCharactor.getBoundingClientRect();
  let x축차이;
  let y축차이 = Math.abs(joyRect.y - bug.y);
  if (joyRect.x < bug.x) {
    x축차이 = Math.abs(joyRect.x + 23 - bug.x);
  } else {
    x축차이 = Math.abs(joyRect.x - bug.x);
  }
  if (x축차이 < 35 && y축차이 < 55) {
    console.log('버그충돌');
    bugBox.pop(bug);
    isJoyMovable = false;
    isTrapped = true;
    joyCharactor.style.transform = `rotate(40deg)`;
    joyCharactor.classList.add('trapped');
    setTimeout(() => {
      joyCharactor.style.transform = `rotate(0deg)`;
    }, 500);
    setTimeout(() => {
      isJoyMovable = true;
      isTrapped = false;
      joyCharactor.classList.remove('trapped');
    }, 3000);
  }
}
function makeGameLife(GAME_LIFE) {
  for (let i = 0; i < GAME_LIFE; i++) {
    const life = document.createElement('i');
    life.setAttribute('class', 'fa-solid fa-heart');
    gameLife.appendChild(life);
  }
}
makeGameLife(GAME_LIFE);

function removeGameLife() {
  GAME_LIFE -= 1;
  gameLife.removeChild(gameLife.lastElementChild);
}

function addGameLife() {
  GAME_LIFE += 1;
  const life = document.createElement('i');
  life.setAttribute('class', 'fa-solid fa-heart');
  gameLife.appendChild(life);
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
function restartGame() {
  ANIMATION_TIMER = 0;
  cactusBox = [];
  carrotBox = [];
  animation;
  if (isTrapped === false) {
    isJoyMovable = true;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  doFrameWork();
}

function gameOver() {
  ANIMATION_TIMER = 0;
  cactusBox = [];
  carrotBox = [];
  bugBox = [];
  animation;
  isStarted = false;
  isJoyMovable = false;
  joyCharactor.style.visibility = 'hidden';
  joyCharactor.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  GAME_LIFE = 4;
  GAME__LEVEL = 1;
  hidegameButton();
  GAME__TIME = 0;
  clearInterval(timer);
  stopSound(bgSound);
  alert('게임종료');
}
function gameWin() {
  playSound(winSound);
  alert('축하합니다. 당신은 조이를 탈출시켰습니다.');
}

// 처음 안내문 닫기
const popup = document.querySelector('.pop-up');
const popup_btn = document.querySelector('.pop-up__refresh');
popup_btn.addEventListener('click', () => {
  popup.classList.add('pop-up--hide');
  gameStartButton.classList.remove('game__button--hide');
});
// 사운드
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}
