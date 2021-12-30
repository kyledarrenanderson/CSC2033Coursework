
// Load Game Sprites
var sprite = new Image();
sprite.src = "spritesheet.png";

function game() {

    const canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        canvasHeight = context.canvas.height = window.innerHeight,
        canvasWidth = context.canvas.width = window.innerWidth;

    canvas.addEventListener('click', shoot);
    canvas.addEventListener('mousemove', aim);

    function shoot(obj) {

    }

    function aim(obj) {

    }
}