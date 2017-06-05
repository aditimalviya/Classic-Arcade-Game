var GameBoard= function (sprite, x, y, speedX, speedY,score){
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
};

GameBoard.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Enemies our player must avoid
var Enemy = function (sprite, x, y, speedX) {
    GameBoard.call(this, sprite, x, y, speedX);
}

Enemy.prototype = Object.create(GameBoard.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function() {
    if (this.x >= 500) {
        this.x = 0;
    }
    this.x += this.speedX;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    for (var i = 0; i < allEnemies.length; i++) {
            allEnemies[i].checkCollission(i);
        }
};

Enemy.prototype.checkCollission = function(i){
    if(this.x < player.x + 84 && this.x + 100 >player.x && this.y < player.y + 83 && 71 + this.y > player.y){
        player.resetPlayer();
        infoBoard.update(" You lost this time");
    }
};

//create enemies
var enemy1 = new Enemy('images/enemy-bug.png', -200, 35,4);
var enemy2 = new Enemy('images/enemy-bug.png', -400, 125,3);
var enemy3 = new Enemy('images/enemy-bug.png', 0, 225,2);
//Draw the enemy on the screen, required method for game
// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1, enemy2, enemy3];
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (sprite, x, y, speedX, speedY, score){
    GameBoard.call(this, sprite, x, y, speedX, speedY);
    this.score = score;
}
Player.prototype = Object.create(GameBoard.prototype);
Player.prototype.constructor = Player;
// Now instantiate your objects.

// Place the player object in a variable called player
var player = new Player('images/char-princess-girl.png', 200, 400, 0, 0, 0);

var score = 0;
var gameInterval = 0;

//Default player position to start a new game, after collission & winning
Player.prototype.resetPlayer = function(){
    this.x = 200;
    this.y = 400;
};

Player.prototype.startNewgame = function(startTime, stopTime){
    this.startTime = startTime;
    this.stopTime = stopTime;
}
    var count = 0;
    gameInterval = setInterval(gameTimer, 500);

    function gameTimer(){

        count += 500;
        if (count >= 1000*60*5) {
            clearInterval(this.gameInterval);
            gameInterval = 0;
            player.speedX = 0;
            player.speedY = 0;
            player.resetPlayer();
            enemy1.speedX = 4; //default startup speed
            enemy2.speedX = 3; //default startup speed
            enemy3.speedX = 2; //default startup speed
            infoBoard.update("Game over");
        }

};

// Player.prototype.award = function(){
//     if (score >= 100) {
//         starMedal.render();
//     }
//      if (score >= 200) {
//         blueGemMedal.render();
//     }
// };

Player.prototype.handleInput = (function(key, x, y){
    //setting speed for allowable keys along x & y axis
    var speedX, speedY;
    if (this.startTime > 0) {
        if (gameInterval ===0) {
            this.speedX = 0;
            this.speedY = 0;
            enemy1.speedX = 4;
            enemy2.speedX = 3;
            enemy3.speedX = 2;
        }
        else{
            switch(key) {
                case 'left':
                speedX = -50;
                speedY = 0;
                break;
                case 'up':
                speedY = -50;
                speedX = 0;
                break;
                case 'right':
                speedY = 0;
                speedX = 50;
                break;
                case 'down':
                speedY = 50;
                speedX = 0;
                break;
                default:
                speedY = 0;
                speedX = 0;
            }

            this.x += speedX;
            this.y += speedY;

            this.traverseLimit();
            this.reward();
        }
    }
});

Player.prototype.traverseLimit = (function(x, y){
    if (this.x < 0){
        this.x = 0;
    }
    if (this.x > 425){
        this.x = 425;
    }
    if (this.y > 400){
        this.y = 400;
    }
});

Player.prototype.reward = (function(x, y){
    if (this.y <=50) {
        score +=10;
        this.resetPlayer();
        infoBoard.update("You are Awesome");
    }

    //Level 1: Increase enemy speed
    if (score >= 100) {
        infoBoard.update("You are a Star");
        starMedal.render();
        enemy1.speedX = 6;
        enemy2.speedX = 4;
        enemy3.speedX = 3;
    }
    if (score >= 200) {
        infoBoard.update("You are a Genius");
        blueGemMedal.render();
        enemy1.speedX = 8;
        enemy2.speedX = 6;
        enemy3.speedX = 4;
    }
});

var Button = function (sprite, x, y){
    GameBoard.call(this, sprite, x, y);
    this.startTime = 0;
    this.stopTime = 0;
}
Button.prototype = Object.create(GameBoard.prototype);
Button.prototype.constructor = Button;

var button = new Button('images/startButton.png', 0,10);

Button.prototype.startGame = (function(){
    var mouseX = event.pageX;
     var mouseY = event.pageY;

     if ((mouseX >420 && mouseY <=515) && (mouseY > 0 && mouseY <=50)) {
        var startTime = new Date().getTime();
        var stopTime = startTime + (1000*60*1);
        infoBoard.update("Good Luck!");
        score = 0;
        scoreBoard.render();
        player.resetPlayer();
        player.startNewgame(startTime, stopTime);
     }
});

document.addEventListener('click', function(){
    button.startGame();
});

var InfoBoard = function(info) {
    this.txt = info;
};

InfoBoard.prototype.update = function(info){
    this.txt = info;
    ctx.clearRect(0, 0, ctx.canvas.width, 50);
};

InfoBoard.prototype.render = function(){
    ctx.font = "20px San Serif";
    ctx.fillStyle = "black";
    ctx.fillText(this.txt, 105, 30);
};

var infoBoard = new InfoBoard("Press Start for a New game");

//set up score board
var ScoreBoard = function(txt){
    this.txt = txt;
};

ScoreBoard.prototype.render = function() {
    ctx.font = "20px San Serif";
    ctx.fillStyle = "red";
    ctx.fillText(this.txt + score, 330, 30);
};

var scoreBoard = new ScoreBoard("Score: ")

//create medals
var Medal = function (sprite, x, y){
    GameBoard.call(this, sprite, x, y);
}

Medal.prototype = Object.create(GameBoard.prototype);
Medal.prototype.constructor = Medal;

var starMedal = new Medal('images/Star.png',455, 0);
var blueGemMedal = new Medal('images/blueGem.png', 455, 0);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
