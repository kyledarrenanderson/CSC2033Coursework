
window.addEventListener("DOMContentLoaded", game);

// Load Game Sprites
var sprite = new Image();
sprite.src = "https://i.imgur.com/aNhlML8.png";

function game() {

    // create the canvas
    const canvas = document.getElementById('game'),
        context = canvas.getContext('2d'),
        canvasWidth = context.canvas.width,
        canvasHeight = context.canvas.height;

    var asteroidNumber = 5;
    var activeShot = 0;
    var bullets = [];
    var asteroids = [];
    var questions = [];
    var answers = [];
    var score = 0;
    var gameActive = false;
    var canvasRect = canvas.getBoundingClientRect();
    var whichButton = 0;


    var _player = {
        rotation: 0,
        rotationTrue: 0,
        x: canvasWidth/2,
        y: canvasHeight/2 + 250};

    canvas.addEventListener('click', clickFunctions);
    canvas.addEventListener('mousemove', buttonselect);

    // player
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

    //create new bullet
    function createBullet(id, bulletAngle) {
        var bullet = {
            x : _player.x,
            y : _player.y,
            angle : bulletAngle,
            hit : false,
            answerID : id
        }
        questions.splice(id,1);
        bullets.push(bullet);
    }

    function createAsteroid(id, angle) {
        var asteroid = {
            x : _player.x + 750 * Math.cos(angle),
            y : _player.y + 750 * Math.sin(angle),
            angle : angle,
            hit : false,
            answerID : id,
            answer : answers[id]
        }
        asteroids.push(asteroid);
    }

    // draw the question box
    function drawQuestionBox() {
        context.fillStyle = "black";
        context.fillRect(20, canvasHeight - 190, canvasWidth - 40, 170);

        var remainder = questions.length;
        activeShot = ((activeShot % remainder) + remainder) % remainder;

        context.font = "60px verdana";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(questions[activeShot], canvasWidth/2, canvasHeight - 190 + 170/2);

        //*
        context.font = "60px verdana";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(questions, canvasWidth/2, canvasHeight - 390 + 170/2);
        //*/
    }

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

    // handle clicking
    function clickFunctions(obj) {
        var mousePos = getMousePos(canvas,obj);

        // if mouse is not in the question box then shoot
        if(mousePos.y < canvasHeight - 190) {
            _player.rotation = Math.atan2(mousePos.x - _player.x,
                -(mousePos.y - _player.y));
            createBullet(activeShot, _player.rotation);
        }
        else {
            // if player clicks arrows then change question
            if( Math.sqrt((mousePos.x - 90)**2 +
            (mousePos.y - (canvasHeight - 190 + 170/2))**2) < 48 ) {
                activeShot = activeShot - 1;
            }
            else if( Math.sqrt((mousePos.x - (canvasWidth - 90))**2 +
                (mousePos.y - (canvasHeight - 190 + 170/2))**2) < 48 ) {
                activeShot = activeShot + 1;
            }

        }
    }

    // add glowing animation for if mouse is over button
    function buttonselect(obj) {
        var mousePos = getMousePos(canvas,obj);

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

    // manages global game updating
    function gameUpdate() {
        // movement of the bullets fired
        var tempBullets = bullets;
        for (var i = 0;  i < bullets.length; i++) {
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
        bullets = tempBullets;

        for (var i = 0;  i < asteroids.length; i++) {
            if (!asteroids[i].hit) {
                for (var o = 0;  o < bullets.length; o++) {
                    if (pointInCircle(bullets[o].x, bullets[o].y,
                        asteroids[i].x, asteroids[i].y, 86)) {
                            asteroids[i].hit = true;
                            bullets[o].hit = true;
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
                context.fillText(bullets.length, asteroids[i].x, asteroids[i].y);


                asteroids[i].x = asteroids[i].x - 0.1 * Math.cos(asteroids[i].angle);
                asteroids[i].y = asteroids[i].y - 0.1 * Math.sin(asteroids[i].angle);
            }
        }
        //score+=0.1;
    }
    // TODO: Game needs to end when player misses a shot!
    function preGameSetUp() {
        // randomise the questions and answers at start of game
        var mydata = JSON.parse(data);
        shuffle(mydata);
        for (let i = 0; i <mydata.length && questions.length < asteroidNumber; i++) {
            if (mydata[i].Difficulty === "Normal") {
                questions.push(mydata[i].question);
                answers.push(mydata[i].answer);
            }
        }
        gameActive = true;

        for (let i = 0; i < asteroidNumber; i++) {
            createAsteroid(i, -(Math.PI)/(asteroidNumber-1) * i);
        }
        //alert(asteroids[0].x);
    }
    function startGame() {
        if(!gameActive && questions.length == 0) {
            preGameSetUp();
        }
        if(gameActive) {

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.beginPath();
            gameUpdate();
            player();
            drawQuestionBox();

            questionSelect();
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
        var result = [];
        for(let i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
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

}