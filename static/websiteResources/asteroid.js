
window.addEventListener("DOMContentLoaded", game);

// Load Game Sprites
const sprite = new Image();
sprite.src = "https://i.imgur.com/aNhlML8.png";

/**
 * Main logic of the game.
 * Games run at 60 frames per second.
 *
 * @author Erick Grant Daleon
 * @version 0.5
 * @since 30-12-2021
 */
function game() {

    // create the canvas
    const canvas = document.getElementById('game'),
        context = canvas.getContext('2d'),
        canvasWidth = context.canvas.width,
        canvasHeight = context.canvas.height;

    let asteroidNumber = 5;
    let activeShot = 0;
    let bullets = [];
    let asteroids = [];
    let questions = [];
    let answers = [];
    let score = 0;
    let gameActive = false;
    let canvasRect = canvas.getBoundingClientRect();
    let whichButton = 0;


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
        context.save();
        // interpolation needs to rotate via shortest angle
        _player.rotationTrue = interlope(_player.rotationTrue,
                                        _player.rotation,
                                        1)
        context.translate(_player.x, _player.y);
        context.rotate(_player.rotationTrue);
        context.drawImage(sprite, 0, 0, 64, 128, -32, -64, 64, 128);
        context.restore();

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
     * Represents asteroids containing the answers.
     * @param {int} id - ID of answer asteroid contains.
     * @param {number} angle - Defines the angle of the starting position of asteroid.
     */
    function createAsteroid(id, angle) {
        let asteroid = {
            x : _player.x + 750 * Math.cos(angle),
            y : _player.y + 750 * Math.sin(angle),
            angle : angle,
            hit : false,
            answerID : id,
            answer : answers[id]
        }
        asteroids.push(asteroid);
    }

    /**
     * Draws the box that contains the questions and the questions themselves.
     */
    function drawQuestionBox() {
        context.fillStyle = "black";
        context.fillRect(20, canvasHeight - 190, canvasWidth - 40, 170);

        let remainder = questions.length;
        //activeShot = ((activeShot % remainder) + remainder) % remainder;

        context.font = "60px verdana";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(questions[activeShot][1], canvasWidth/2, canvasHeight - 190 + 170/2);

        /*
        context.font = "60px verdana";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(String(activeShot), canvasWidth/2, canvasHeight - 290 + 170/2);

        context.font = "60px verdana";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(questions, canvasWidth/2, canvasHeight - 390 + 170/2);
        //*/
    }

    /**
     * Draws the buttons used to change the selected question.
     */
    function questionSelect() {
        context.save();
        context.translate(90, canvasHeight - 190 + 170/2);
        context.rotate(0);
        context.drawImage(sprite, 0, [128,320,128][whichButton], 192, 192, -96, -96, 192, 192);
        context.restore();

        context.save();
        context.translate(canvasWidth - 90, canvasHeight - 190 + 170/2);
        context.rotate(Math.PI);
        context.drawImage(sprite, 0, [128,128,320][whichButton], 192, 192, -96, -96, 192, 192);
        context.restore();
    }

    /**
     * Handles actions done by the player clicking.
     */
    function clickFunctions(obj) {
        let mousePos = getMousePos(canvas,obj);

        if(gameActive) {
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
    }
    /**
     * Handles the glowing animation for the question selection buttons.
     */
    function buttonSelect(obj) {
        let mousePos = getMousePos(canvas,obj);

        if(pointInCircle(mousePos.x, mousePos.y
            , 90, (canvasHeight - 190 + 170/2), 48)) {
            whichButton = 1;
        }
        else if(pointInCircle(mousePos.x, mousePos.y,
            canvasWidth - 90, (canvasHeight - 190 + 170/2), 48)) {
            whichButton = 2;
        }
        else {
            whichButton = 0;
        }
    }

    /**
     * Calls all functions that happen every frame.
     */
    function gameUpdate() {
        bulletsUpdate();
        asteroidsUpdate();
        player();
        drawQuestionBox();
        questionSelect();
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
                context.save();
                context.translate(bullets[i].x,bullets[i].y);
                context.rotate(bullets[i].angle);
                context.drawImage(sprite, 65, 0, 96, 32, -16-8, -16, 96, 32);
                context.restore();

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
     * if they reach a distance of 250 from the player.
     */
    function asteroidsUpdate() {
        // movement of asteroids
        for (let i = 0;  i < asteroids.length; i++) {
            if (!asteroids[i].hit) {
                for (let o = 0;  o < bullets.length; o++) {
                    if (pointInCircle(bullets[o].x, bullets[o].y,
                        asteroids[i].x, asteroids[i].y, 86)) {
                            bullets[o].hit = true;
                            if(bullets[o].questionID == asteroids[i].answerID) {
                                asteroids[i].hit = true;
                            }
                    }
                }

                context.save();
                context.translate(asteroids[i].x,asteroids[i].y);
                context.rotate(asteroids[i].angle);
                context.drawImage(sprite, 288, 0, 192, 192,
                                  -80, -80, 192, 192);
                context.restore();

                context.font = "60px verdana";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText(answers[i], asteroids[i].x, asteroids[i].y);
                //context.fillText(String(Math.floor(score)), asteroids[i].x, asteroids[i].y);

                if (pointInCircle(asteroids[i].x, asteroids[i].y, _player.x, _player.y, 250)) {
                    gameActive = false;
                }
                // Asteroids should reach distance of 250 with player in 90 seconds
                asteroids[i].x = asteroids[i].x - (500/(120*60)) * Math.cos(asteroids[i].angle);
                asteroids[i].y = asteroids[i].y - (500/(120*60)) * Math.sin(asteroids[i].angle);
            }
        }
    }
    // TODO: Game needs to end when player misses a shot!
    // TODO: Need to generate questions+answers based on selected difficulty!
    /**
     * Handles tasks that need to be done once before the game starts.
     * Includes randomising questions (based on difficulty) and spawning
     * the answer asteroids.
     */
    function preGameSetUp() {
        // randomise the questions and answers at start of game
        let mydata = JSON.parse(data);
        shuffle(mydata);
        let questionID = 0;
        for (let i = 0; i <mydata.length && questions.length < asteroidNumber; i++) {
            if (mydata[i].Difficulty === "Normal") {
                questions.push([questionID,mydata[i].question]);
                answers.push(mydata[i].answer);
                questionID++;
            }
        }
        gameActive = true;
        // randomise the position of the asteroids
        let angleList = [];
        for (let i = 0; i < asteroidNumber; i++) {
            angleList.push(-(Math.PI)/(asteroidNumber-1) * i);
        }
        //alert(angleList);
        shuffle(angleList);
        //alert(angleList);
        // create the asteroids.
        for (let i = 0; i < angleList.length; i++) {
            createAsteroid(i, angleList[i]);
        }
        //alert(asteroids[0].x);
    }
    /**
     * Starts the game.
     */
    function startGame() {
        if(!gameActive && questions.length === 0) {
            preGameSetUp();
        }
        if(gameActive) {
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.beginPath();
            gameUpdate();
        }
    }

    function init() {
        window.requestAnimationFrame(init);
        startGame();
    }

    init();

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
     *
     * @param {2D Array} array2D - Array containing arrays of [flag, value].
     * @param {int} startPosition - Starting index.
     * @param {int} direction - Direction of checking flags.
     * @returns {number} Next available position. -1 If all flags are -1.
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
}