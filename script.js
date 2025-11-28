const canvas = document.getElementById('pacman');
const context = canvas.getContext('2d');

const box = 20;
let pacmanX = 10 * box;
let pacmanY = 10 * box;
let pacmanDirection = 'right';

function draw() {
    context.fillStyle = '#000033';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawPacman();

    let newX = pacmanX;
    let newY = pacmanY;

    if (pacmanDirection === 'left') newX -= box;
    if (pacmanDirection === 'up') newY -= box;
    if (pacmanDirection === 'right') newX += box;
    if (pacmanDirection === 'down') newY += box;

    if (newX < 0) {
        newX = canvas.width - box;
    } else if (newX >= canvas.width) {
        newX = 0;
    }
    if (newY < 0) {
        newY = canvas.height - box;
    } else if (newY >= canvas.height) {
        newY = 0;
    }

    pacmanX = newX;
    pacmanY = newY;
}

function drawPacman() {
    let rotation = 0;
    if (pacmanDirection === 'down') rotation = 0.5 * Math.PI;
    if (pacmanDirection === 'left') rotation = Math.PI;
    if (pacmanDirection === 'up') rotation = 1.5 * Math.PI;

    context.save();
    context.translate(pacmanX + box / 2, pacmanY + box / 2);
    context.rotate(rotation);

    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(0, 0, box / 2, 0.2 * Math.PI, 1.8 * Math.PI, false);
    context.lineTo(0, 0);
    context.fill();

    context.restore();
}

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.key === 'ArrowLeft') {
        pacmanDirection = 'left';
    } else if (event.key === 'ArrowUp') {
        pacmanDirection = 'up';
    } else if (event.key === 'ArrowRight') {
        pacmanDirection = 'right';
    } else if (event.key === 'ArrowDown') {
        pacmanDirection = 'down';
    }
}

let game = setInterval(draw, 100);
