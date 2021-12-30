
window.addEventListener("DOMContentLoaded", game);

// Load Game Sprites
var sprite = new Image();
sprite.src = "https://i.imgur.com/ieMCMXc.png";

function game() {

    // create the canvas
    const canvas = document.getElementById('game'),
        context = canvas.getContext('2d'),
        canvasWidth = context.canvas.width = window.innerWidth,
        canvasHeight = context.canvas.height = window.innerHeight;

    var _player = {rotation: 0};

    canvas.addEventListener('click', shoot);
    canvas.addEventListener('mousemove', aim);

    function shoot(obj) {

    }

    // rotate the player to mouse position
    function aim(obj) {
        _player.rotation = Math.atan2(obj.offsetX - canvasWidth/2, -(obj.offsetY - canvasHeight/2));
    }

    function player() {
        context.save();


        context.translate(canvasWidth/2, canvasHeight/2);
        context.rotate(_player.rotation );
        context.drawImage(sprite, 0, 0, 64, 128, -32, -64, 64, 128);
        context.restore();
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
}