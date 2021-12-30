
window.addEventListener("DOMContentLoaded", game);

// Load Game Sprites
var sprite = new Image();
sprite.src = "https://i.imgur.com/WhFvtSa.png";

function game() {

    // create the canvas
    const canvas = document.getElementById('game'),
        context = canvas.getContext('2d'),
        canvasWidth = context.canvas.width = window.innerWidth,
        canvasHeight = context.canvas.height = window.innerHeight;

    var bullets = [];
    var asteroids = [];
    var score = 0;
    var gameActive = true;

    var _player = {
        rotation: 0,
        rotationTrue: 0};

    canvas.addEventListener('click', aimShoot);

    // player
    function player() {
        context.save();
        // interpolation needs to rotate via shortest angle
        _player.rotationTrue = interlope(_player.rotationTrue,
                                        _player.rotation,
                                        1)
        context.translate(canvasWidth/2, canvasHeight/2);
        context.rotate(_player.rotationTrue);
        context.drawImage(sprite, 0, 0, 64, 128, -32, -64, 64, 128);
        context.restore();
        gameUpdate();
    }

    //create new bullet
    function createBullet(id, bulletAngle) {
        var bullet = {
            x : canvasWidth/2,
            y : canvasHeight/2,
            angle : bulletAngle,
            hit : false,
            answerID : id
        }
        bullets.push(bullet);
    }

    // rotate the player to mouse position and shoot
    function aimShoot(obj) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = obj.clientX - rect.left;
        var mouseY = obj.clientY - rect.top;
        _player.rotation = Math.atan2(mouseX - rect.right/2,
                                        -(mouseY - rect.bottom/2));
        createBullet(0, _player.rotation);
    }

    // manages global game updating
    function gameUpdate() {
        for (var i = 0;  i < bullets.length; i++) {
            if (!bullets[i].hit) {
                context.save();
                context.translate(canvasWidth/2,canvasHeight/2);
                context.rotate(bullets[i].angle);
                context.drawImage(sprite, 65, 0, 96, 32, bullets[i].x-canvasWidth/2-16-8, bullets[i].y-canvasHeight/2-16, 96, 32);
                context.restore();

                bullets[i].x = bullets[i].x + 15 * Math.cos(bullets[i].angle/180- Math.PI/2);
                bullets[i].y = bullets[i].y + 15 * Math.sin(bullets[i].angle/180- Math.PI/2);
            }
        }
    }

    function startGame() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        player();

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
}