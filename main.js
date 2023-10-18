const gameStartRef = document.querySelector('.game-start');
const gameAreaRef = document.querySelector('.game-area');
const gameOverRef = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = document.querySelector('.points');

gameStartRef.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let keys = {};

let player = {
    x: 150,
    y: 100,
    width: 0,
    height: 0,
    lastFireBall: 0,

};

let game = {
    speed: 2,
    movingSpeed: 4,
    fireBallSpeed: 6,
    fireBallInterval: 1000,
    cloudInterval: 4000,
    bugInterval: 1000,
};

let scene = {
    score: 0,
    lastCloud: 0,
    lastBug: 0,
    isActive: true,
};

function onGameStart(e) {
    gameStartRef.classList.add('hide');

    const wizard = document.createElement('div');

    wizard.classList.add('wizard');
    wizard.style.top = '200px';
    wizard.style.left = '200px';

    player.height = wizard.offsetHeight;
    player.width = wizard.offsetWidth;

    gameAreaRef.appendChild(wizard);
    window.requestAnimationFrame(gameAction);

    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';
}

function onKeyUp(e) {
    keys[e.code] = false;

}
function onKeyDown(e) {
    keys[e.code] = true;

}
function addFireBall() {
    let fireBall = document.createElement('div');

    fireBall.classList.add('fire-ball');
    fireBall.style.top = (player.y + player.height / 3 - 5) + 'px';
    fireBall.x = player.x + player.width;
    fireBall.style.left = player.x + 'px';
    gameAreaRef.appendChild(fireBall);
}

function gameAction(timestamp) {
    const wizard = document.querySelector('.wizard');
    const fireBalls = document.querySelectorAll('.fire-ball');
    const cloudRef = document.querySelectorAll('.cloud');
    const bugRef = document.querySelectorAll('.bug');

    let gameAreaWidth = gameAreaRef.offsetWidth - 200;
    let gameAreaHeight = gameAreaRef.offsetHeight - 120;
    let wizardWidth = player.width + player.x;
    let wizardHeight = player.height + player.y;
    let inAir = player.y + player.height < gameAreaHeight;

    scene.score++;

    if (timestamp - scene.lastCloud > game.cloudInterval + 20000 * Math.random) {
        scene.lastCloud = timestamp;
        addCloud();
    }
    if (timestamp - scene.lastBug > game.bugInterval + 20000 * Math.random()) {
        scene.lastBug = timestamp;
        addBug();
    }

    fireBalls.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallSpeed;
        fireBall.style.left = fireBall.x + 'px';
        if (fireBall.x + fireBall.offsetWidth > gameAreaWidth) {
            fireBall.remove();
        }
    })

    cloudRef.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';

        if (cloud.x < 0) {
            cloud.remove();
        }
    })

    bugRef.forEach(bug => {
        bug.x -= game.speed * 3;
        bug.style.left = bug.x + 'px';

        if (bug.x + bug.offsetWidth <= 0) {
            bug.remove();
        }

        if(isCollision(wizard, bug)){
            gameOver();
        }
    })

    bugRef.forEach(bug => {
        if(isCollision(wizard, bug)){
            gameOver();
        }

        fireBalls.forEach(fireBall => {
            if (isCollision(fireBall, bug)){
                console.log('bug killed');
            }
        })
    })

    if (inAir) {
        player.y += game.speed;
    }

    if (keys.Space && timestamp - player.lastFireBall > game.fireBallInterval) {
        wizard.classList.add('wizard-fire');
        addFireBall();
        isCollision(wizard, wizard)
        player.lastFireBall = timestamp;
    }
    else {
        wizard.classList.remove('wizard-fire');
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingSpeed;
    }
    if (keys.ArrowDown && (wizardHeight < gameAreaHeight)) {
        player.y += game.speed * game.movingSpeed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingSpeed;
    }
    if (keys.ArrowRight && (wizardWidth < gameAreaWidth)) {
        player.x += game.speed * game.movingSpeed;
    }

    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';
    gameScore.textContent = scene.score;

    if(scene.isActive){
        window.requestAnimationFrame(gameAction);
    }
}

function addCloud() {
    let cloud = document.createElement('div');

    cloud.classList.add('cloud');
    cloud.x = gameAreaRef.offsetWidth;
    cloud.style.left = cloud.x + 'px';
    cloud.style.top = (gameAreaRef.offsetHeight - 300) * Math.random() + 'px';
    gameAreaRef.appendChild(cloud);
}

function addBug() {
    let bug = document.createElement('div');

    bug.classList.add('bug');
    bug.y = (gameAreaRef.offsetHeight - 60) * Math.random();
    bug.x = gameAreaRef.offsetWidth - 60
    bug.style.left = bug.x + 'px';
    bug.style.top = bug.y + 'px';
    gameAreaRef.appendChild(bug);
}

function isCollision(elementA, elementB) {
    let elARect = elementA.getBoundingClientRect();
    let elBRect = elementB.getBoundingClientRect();

    return !(elARect.top > elBRect.bottom ||
        elARect.bottom < elBRect.top ||
        elARect.right < elBRect.left ||
        elARect.right > elBRect.left)
}

function gameOver(){
    scene.isActive = false;
    gameOverRef.classList.remove('hide');
}