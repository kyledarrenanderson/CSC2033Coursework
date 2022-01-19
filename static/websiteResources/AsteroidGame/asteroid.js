
// Load Game Sprites
const sprite = new Image();
sprite.src = "/static/websiteResources/AsteroidGame/asteroid_spritesheet.png";

/**
 * Main logic of the game.
 * Games run at 60 frames per second.
 *
 * @author Erick Grant Daleon
 * @version 0.5
 * @since 30-12-2021
 */


// create the canvas
const canvas = document.getElementById('game'),
    context = canvas.getContext('2d'),
    canvasWidth = context.canvas.width,
    canvasHeight = context.canvas.height;

const STATE_ASTEROIDSELECT = 0;
const STATE_NOTSTARTED = 1;
const STATE_ACTIVE = 2;
const STATE_GAMEWIN = 3;
const STATE_GAMELOSSWRONG = 4;
const STATE_GAMELOSSMISSED = 5;
const STATE_GAMELOSSCOLLIDE = 6;
const STATE_END = 7;

let asteroidNumber = 6;
let activeShot = 0;
let bullets = [];
let asteroids = [];
let questions = [];
let answers = [];
let correctAnswer = "";
let score = 0;
let gameState = STATE_ASTEROIDSELECT;
let canvasRect = canvas.getBoundingClientRect();
let whichButton = 0;
let countdown = 120*60;

let _player = {
    rotation: 0,
    rotationTrue: 0,
    x: canvasWidth/2,
    y: canvasHeight/2 + 250};

canvas.addEventListener('click', clickFunctions);
canvas.addEventListener('mousemove', buttonSelect);

/**
 * Represents the player and handles its rendering.
 */
function player() {
    // interpolation needs to rotate via shortest angle
    _player.rotationTrue = interlope(_player.rotationTrue, _player.rotation,1);
    renderSprite(0, 0, 64, 128, -32, -64, 64,
                 128, _player.x, _player.y, _player.rotationTrue);
}

/**
 * Represents shots the player fired.
 * When the player fires a shot, the question ammo is consumed.
 * @param {int} id - ID of question the bullet represents.
 * @param {float} bulletAngle - Angle of bullet and direction of travel.
 */
function createBullet(id, bulletAngle) {
    let bullet = {
        x : _player.x,
        y : _player.y,
        angle : bulletAngle,
        hit : false,
        questionID : id
    }
    bullets.push(bullet);
    questions[id][0] = -1;
}

/**
 * Renders an individual bullet.
 * @param {int} id - Bullet position in bullet list.
 */
function renderBullet(id) {
    renderSprite(65, 0, 96, 32, -16-8, -16, 96,
                 32, bullets[id].x,bullets[id].y, bullets[id].angle);
}

/**
 * Represents asteroids containing the answers.
 * @param {int} id - ID of answer asteroid contains.
 * @param {number} angle - Defines the angle of the starting position of asteroid.
 */
function createAsteroid(id, angle) {
    let value = 0;
    switch (answers[id][1]) {
        case "Easy": value = 100; break;
        case "Normal": value = 200; break;
        case "Hard": value = 300; break;
    }
    let asteroid = {
        x : _player.x + 750 * Math.cos(angle),
        y : _player.y + 750 * Math.sin(angle),
        angle : angle,
        hit : false,
        answerID : id,
        answer : answers[id][0],
        value : value
    }
    asteroids.push(asteroid);
}

/**
 * Renders an individual asteroid.
 * @param {int} id - Asteroid position in asteroid list.
 */
function renderAsteroid(id) {
    renderSprite(288, 0, 192, 192, -80, -80, 192,
                 192, asteroids[id].x,asteroids[id].y, asteroids[id].angle);
    let reposition = answers[id][0].split(" ").length;
    renderText(asteroids[id].x, asteroids[id].y-15*reposition+15, answers[id][0], "40px sans-serif",
               "black", "center", 40, ' ', true);

}

/**
 * Draws the box that contains the questions and the questions themselves.
 */
function drawQuestionBox() {
    renderBox(20, canvasHeight - 190, canvasWidth - 40, 170, 1, "black");

    if(activeShot != -1) {
        renderText(canvasWidth / 2, canvasHeight - 195 + 170 / 2, questions[activeShot][1],
            "40px sans-serif", "white", "center",40, '|');
    }
    /*
    context.font = "60px verdana";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(String(activeShot), canvasWidth/2, canvasHeight - 290 + 170/2);

    context.font = "60px verdana";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(score, 60,60);
    //*/

}

/**
 * Draws the buttons used to change the selected question.
 */
function questionSelect() {
    renderSprite(0, [128,320,128][whichButton], 192, 192, -96, -96,
                 192, 192, 90, canvasHeight - 190 + 170/2, 0);
    renderSprite(0, [128,128,320][whichButton], 192, 192, -96, -96,
                 192, 192, canvasWidth - 90, canvasHeight - 190 + 170/2, Math.PI);
}

/**
 * Handles actions done by the player clicking.
 *
 * @param {event} obj - Event from listener.
 */
function clickFunctions(obj) {
    let mousePos = getMousePos(canvas,obj);
    if(gameState == STATE_ASTEROIDSELECT) { gameState = STATE_NOTSTARTED; }
    else if(gameState == STATE_ACTIVE) {
        // if mouse is not in the question box then shoot
        if (mousePos.y < canvasHeight - 190) {
            _player.rotation = Math.atan2(mousePos.x - _player.x,
                -(mousePos.y - _player.y));
            createBullet(activeShot, _player.rotation);
            activeShot = skipArrayFlag(questions, activeShot,1);
        } else {
            // if player clicks arrows then change question
            if (Math.sqrt((mousePos.x - 90) ** 2 +
                (mousePos.y - (canvasHeight - 190 + 170 / 2)) ** 2) < 48) {
                activeShot = skipArrayFlag(questions, activeShot,-1);
            } else if (Math.sqrt((mousePos.x - (canvasWidth - 90)) ** 2 +
                (mousePos.y - (canvasHeight - 190 + 170 / 2)) ** 2) < 48) {
                activeShot = skipArrayFlag(questions, activeShot,1);
            }

        }
    }
    else if (gameState != STATE_END){
        gameState = STATE_END;
    }
}
/**
 * Handles the glowing animation for the question selection buttons.
 *
 * @param {event} obj - Event from listener.
 */
function buttonSelect(obj) {
    if (gameState == STATE_ACTIVE) {
        let mousePos = getMousePos(canvas, obj);

        if (pointInCircle(mousePos.x, mousePos.y
            , 90, (canvasHeight - 190 + 170 / 2), 48)) {
            whichButton = 1;
        } else if (pointInCircle(mousePos.x, mousePos.y,
            canvasWidth - 90, (canvasHeight - 190 + 170 / 2), 48)) {
            whichButton = 2;
        } else {
            whichButton = 0;
        }
    }
}

/**
 * Manages bullet movements/actions.
 * This cycles through each bullet and updates their
 * position and status. Bullets are removed from the bullet array
 * when they leave the canvas or hit an asteroid.
 * Note: The asteroids hit the player when they're 250 away from the player.
 */
function bulletsUpdate() {
    // movement of the bullets fired
    let tempBullets = bullets;
    for (let i = 0;  i < bullets.length; i++) {
        if (!bullets[i].hit && pointInBox(bullets[i].x,bullets[i].y, 0,0,
            canvasWidth, canvasHeight)) {

            renderBullet(i);
            bullets[i].x = bullets[i].x + 15 * Math.cos(bullets[i].angle-Math.PI/2);
            bullets[i].y = bullets[i].y + 15 * Math.sin(bullets[i].angle-Math.PI/2);
        }
        else {
            tempBullets.splice(i, 1);
        }
    }
    // bullets that are no longer rendered are deleted from the array
    bullets = tempBullets;
}

/**
 * Manages asteroid movements/actions.
 * This cycles through each asteroid and updates their
 * position and status. Asteroids are destroyed when they
 * are hit by the right bullet. Asteroids also end the game
 * if they reach a distance of 250 from the player. If the
 * player clicks the wrong asteroid, the game also ends.
 */
function asteroidsUpdate() {
    //alert("test");
    // movement of asteroids
    for (let i = 0;  i < asteroids.length; i++) {
        //alert("inside");
        if (!asteroids[i].hit) {
            // check to see if bullets and asteroids collide
            for (let o = 0;  o < bullets.length; o++) {
                if (pointInCircle(bullets[o].x, bullets[o].y, asteroids[i].x, asteroids[i].y, 86)) {
                    bullets[o].hit = true;
                    // check to see if question matches asteroid
                    if(bullets[o].questionID == asteroids[i].answerID) {
                        asteroids[i].hit = true;
                        score += asteroids[i].value;
                    }
                    else {
                        score = Math.max(0, score-=asteroids[i].value * 2);
                        gameState = STATE_GAMELOSSWRONG;
                        correctAnswer = answers[o][0];
                    }
                }
            }
            //alert("unrendered");
            renderAsteroid(i);
            //alert("rendered");
            // check if asteroid reaches player
            if (pointInCircle(asteroids[i].x, asteroids[i].y, _player.x, _player.y, 250)) {
                gameState = STATE_GAMELOSSCOLLIDE;
            }
            else {
                asteroids[i].x = asteroids[i].x - (500 / (120 * 60)) * Math.cos(asteroids[i].angle);
                asteroids[i].y = asteroids[i].y - (500 / (120 * 60)) * Math.sin(asteroids[i].angle);
            }
        }
    }
    //alert("test");
}

/**
 * Handles the very start of the game, including selecting the number of asteroids you
 * want on screen (if we had time to alter difficulties) and displaying the instructions.
 * Due to time constrains, game starts upon clicking screen.
 */
function asteroidNumberSelection() {
    renderBox(0, 0, canvasWidth, canvasHeight, 0.5, "black");
    renderText(canvasWidth / 2, 190, "FDM ASTEROIDS", "150px Franklin Gothic Demi",
               "white");
    renderText(canvasWidth / 2, 300,
            "In this game, you must destroy the asteroids\n" +
                "approaching your ship. To destroy them, click\n" +
                "on the asteroids that provide the right answer\n" +
                "to the question below. Cycle through each question\n" +
                "and don't click the wrong answer!\n\n" +
                "Click anywhere to start!", "60px sans-serif", "white", "center",
                60, '\n');
}

/**
 * Handles tasks that need to be done once before the game truely starts.
 * Includes randomising questions (based on difficulty) and spawning
 * the answer asteroids.
 */
function preGameSetUp() {
    // randomise the questions and answers at start of game based on difficulty selected
    let mydata = JSON.parse(data);
    shuffle(mydata);
    let questionID = 0;
    let easyCount = 0;
    let normalCount = 0;
    let hardCount = 0;
    for (let i = 0; i <mydata.length && questions.length < asteroidNumber; i++) {

        if (mydata[i].Difficulty === "Easy" && easyCount < 2) {
            questions.push([questionID,mydata[i].question]);
            answers.push([mydata[i].answer,mydata[i].Difficulty]);
            questionID++;
            easyCount++;
        }
        if (mydata[i].Difficulty === "Normal" && normalCount < 2) {
            questions.push([questionID,mydata[i].question]);
            answers.push([mydata[i].answer,mydata[i].Difficulty]);
            questionID++;
            normalCount++;
        }
        if (mydata[i].Difficulty === "Hard" && hardCount < 2) {
            questions.push([questionID,mydata[i].question]);
            answers.push([mydata[i].answer,mydata[i].Difficulty]);
            questionID++;
            hardCount++;
        }
    }

    gameState = STATE_ACTIVE;
    // randomise the position of the asteroids
    let angleList = [];
    for (let i = 0; i < asteroidNumber; i++) {
        angleList.push(-(Math.PI)/(asteroidNumber-1) * i);
    }
    shuffle(angleList);
    // create the asteroids.
    for (let i = 0; i < angleList.length; i++) {
        createAsteroid(i, angleList[i]);
    }
}

/**
 * Calls all functions that happen every frame.
 */
function gameUpdate() {

    bulletsUpdate();
    //alert("1");
    asteroidsUpdate();
    //alert("2");
    player();
    //alert("3");
    drawQuestionBox();
    //alert("4");
    questionSelect();
    countdown--;
    //alert("5");
    // end game if all asteroids are destroyed or player misses last asteroid.
    if(activeShot == -1 && bullets.length == 0 && gameState == STATE_ACTIVE) {
        gameState = STATE_GAMEWIN;
        for (let i = 0;  i < asteroids.length; i++) {
            if(asteroids[i].hit==false) {
                gameState = STATE_GAMELOSSMISSED;
            }
        }
        if(gameState == STATE_GAMEWIN) {
            score += Math.round(countdown / 6);
        }
    }


}

/**
 * Handles the game over screen! If the player destroys all asteroids, then
 * they get bonus score depending on how much time they had left.
 */
function endGame() {
    renderBox(0, 0, canvasWidth, canvasHeight, 0.75, "black");
    if(gameState!=STATE_GAMEWIN) {
        renderText(canvasWidth / 2, 190, "GAME OVER!", "150px Franklin Gothic Demi",
                   "white");
    }
    switch (gameState) {
        case STATE_GAMELOSSWRONG :
            renderText(canvasWidth / 2, 300, "The correct answer was:\n" + correctAnswer,
                "60px sans-serif", "white", "center", 60);
            break;
        case STATE_GAMELOSSCOLLIDE :
            renderText(canvasWidth / 2, 300, "An asteroid hit!", "60px sans-serif",
            "white");
            break;
        case STATE_GAMELOSSMISSED :
            renderText(canvasWidth / 2, 300, "You missed shots!", "60px sans-serif",
            "white");
            break;
        case STATE_GAMEWIN:
            renderText(canvasWidth / 2, 190, "YOU WIN!", "150px Franklin Gothic Demi",
            "white");
            break;
    }

    renderText(canvasWidth / 2, 650, "SCORE: " + String(score), "150px Franklin Gothic Demi",
               "white");
    renderText(canvasWidth / 2, 900, "Click anywhere to return to website.", "60px sans-serif",
               "white", "center", 60, '\n');
}
/**
 * Starts the game.
 */
function startGame() {
    if(gameState == STATE_ASTEROIDSELECT) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        asteroidNumberSelection();
    }
    else if(gameState == STATE_NOTSTARTED && questions.length === 0) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        preGameSetUp();
    }
    else if(gameState != STATE_END){
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        gameUpdate();
        if (gameState != STATE_ACTIVE) {
            endGame();
        }
    }
    else {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }
}

function init() {
    startGame();

    if(gameState == STATE_END) {
        //return score;
        // Kyle please do your website magic here.
        window.location.href = "leaderboard";
    }
    else {
        requestAnimationFrame(init);
    }

}

//init();

// utility functions
function interlope(a, b, x) {
  return a * (1-x) + b * x;
}

function getMousePos(canvas, event) {
    return {
      x: event.pageX - canvasRect.left,
      y: event.pageY - canvasRect.top
    };
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function pointInBox(x, y, bx1, by1, bx2, by2) {
    return (x > bx1 && x < bx2 && y > by1 && y < by2);
}

function pointInCircle(x, y, cX, cY, cRad) {
    return (Math.sqrt((x - cX)**2 + (y - cY)**2) < cRad);
}

/**
 * Function used to skip questions that have already been fired off when changing questions.
 *
 * @param {2D Array} array2D - Array containing arrays of [flag, value].
 * @param {int} startPosition - Starting index.
 * @param {int} direction - Direction of checking flags.
 * @returns {int} Next available position. -1 If all flags are -1.
 */
function skipArrayFlag(array2D, startPosition, direction) {
    let arraySize = array2D.length;
    for (let i = 0; i < arraySize; i++) {
        startPosition += direction;
        startPosition = ((startPosition % arraySize) + arraySize) % arraySize;
        if (array2D[startPosition][0] != -1) {
            return startPosition;
        }
    }
    return -1;
}

/**
 * Renders a box on the canvas.
 *
 * @param {number} x - X position of centre.
 * @param {number} y - Y position of centre.
 * @param {number} width - Box Width.
 * @param {number} height - Box Height.
 * @param {number} alpha - Box transparency.
 * @param {string} color - Box colour.
 */
function renderBox(x, y, width, height, alpha, color) {
    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
}

/**
 * Renders text on the canvas.
 *
 * @param {number} x - X position.
 * @param {number} y - Y position.
 * @param {string} text - Text to display.
 * @param {string} font - Font face and size.
 * @param {string} color - Colour of text.
 * @param {string} alignment - Alignment of text.
 * @param {number} linespace - Space between each line when line-broken.
 * @param {string} splitter - Line break identifier.
 * @param {boolean} outline - Text has outline. Only used for asteroids.
 */
function renderText(x, y, text, font, color, alignment = "center",
                    linespace = "0", splitter= '\n', outline = false) {
    context.save();
    context.font = font;
    context.fillStyle = color;
    context.textAlign = alignment;
    let lines = text.split(splitter);
    if(outline == true) {
        context.lineWidth = 7;
        context.strokeStyle = "white";
        for (let i = 0; i < lines.length; i++) {
            context.strokeText(lines[i], x, y + linespace * i);
        }
    }
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, y + linespace * i);
    }

    context.restore();
}

/**
 * Renders a sprite from a sprite sheet.
 *
 * @param {int} sourceX - X position of top left rendering co-ordinates.
 * @param {int} sourceY - Y position of top left rendering co-ordinates.
 * @param {int} sourceWidth - How wide is the source rectangle.
 * @param {int} sourceHeight - How tall is the source rectangle.
 * @param {number} renderX - X position of the centre of sprite.
 * @param {number} renderY - Y position of the centre of sprite.
 * @param {number} renderWidth - How wide the sprite renders.
 * @param {number} renderHeight - How tall the sprite renders.
 * @param {float} x - Sprite x position.
 * @param {float} y - Sprite y position.
 * @param {float} rotation - Sprite rotation.
 */
function renderSprite(sourceX, sourceY, sourceWidth, sourceHeight, renderX,
                      renderY, renderWidth, renderHeight, x, y, rotation) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.drawImage(sprite, sourceX, sourceY, sourceWidth, sourceHeight, renderX, renderY,
                      renderWidth, renderHeight);
    context.restore();
}