const canvas = document.getElementById('pacman');
const context = canvas.getContext('2d');

const box = 20;
const rows = 20;
const cols = 20;

const mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 0, 0, 1, 1, 2, 2, 1, 2, 1, 1, 1],
    [0, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 0],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let map;
let pacman;
let ghost;
let score;
let totalPellets;
let game;

function resetGame() {
    map = JSON.parse(JSON.stringify(mapData));
    pacman = { x: 1 * box, y: 1 * box, direction: 'right', requestedDirection: 'right' };
    ghost = { x: 9 * box, y: 8 * box, direction: 'right', color: 'red' };
    score = 0;
    totalPellets = map.flat().filter(cell => cell === 2).length;
}

function drawMap() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (map[y][x] === 1) {
                context.fillStyle = 'blue';
                context.fillRect(x * box, y * box, box, box);
            } else if (map[y][x] === 2) {
                context.fillStyle = 'white';
                context.beginPath();
                context.arc(x * box + box / 2, y * box + box / 2, box / 5, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
}

function isWall(x, y) {
    const gridX = Math.floor(x / box);
    const gridY = Math.floor(y / box);
    if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
        return map[gridY]?.[gridX] !== 0;
    }
    return map[gridY][gridX] === 1;
}

function canMove(entity, direction) {
    let nextX = entity.x, nextY = entity.y;
    if (direction === 'left') nextX -= box;
    if (direction === 'up') nextY -= box;
    if (direction === 'right') nextX += box;
    if (direction === 'down') nextY += box;
    return !isWall(nextX, nextY);
}

function updatePacman() {
    if (canMove(pacman, pacman.requestedDirection)) {
        pacman.direction = pacman.requestedDirection;
    }
    if (canMove(pacman, pacman.direction)) {
        if (pacman.direction === 'left') pacman.x -= box;
        if (pacman.direction === 'up') pacman.y -= box;
        if (pacman.direction === 'right') pacman.x += box;
        if (pacman.direction === 'down') pacman.y += box;

        if (pacman.x < -box) pacman.x = canvas.width;
        else if (pacman.x > canvas.width) pacman.x = -box;
    }

    const gridX = Math.round(pacman.x / box), gridY = Math.round(pacman.y / box);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows && map[gridY][gridX] === 2) {
        map[gridY][gridX] = 0;
        score += 10;
        totalPellets--;
    }
}

function updateGhost() {
    const validMoves = [];
    const oppositeDirection = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
    ['up', 'down', 'left', 'right'].forEach(direction => {
        if (canMove(ghost, direction)) validMoves.push(direction);
    });

    const isStuck = !validMoves.includes(ghost.direction);
    const atIntersection = validMoves.length > 2;

    if (isStuck || atIntersection) {
        let possibleNewDirections = validMoves.filter(dir => dir !== oppositeDirection[ghost.direction]);
        if (possibleNewDirections.length === 0) possibleNewDirections = validMoves;
        ghost.direction = possibleNewDirections[Math.floor(Math.random() * possibleNewDirections.length)];
    }

    if (ghost.direction === 'up') ghost.y -= box;
    if (ghost.direction === 'down') ghost.y += box;
    if (ghost.direction === 'left') ghost.x -= box;
    if (ghost.direction === 'right') ghost.x += box;

    if (ghost.x < -box) ghost.x = canvas.width;
    else if (ghost.x > canvas.width) ghost.x = -box;
}

function checkCollisions() {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    if (Math.sqrt(dx * dx + dy * dy) < box) {
        gameOver(false);
    }
}

function checkWin() {
    if (totalPellets === 0) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    clearInterval(game);
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.fillText(isWin ? 'You Win!' : 'Game Over', canvas.width / 2, canvas.height / 2 - 20);
    context.font = '20px Arial';
    context.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 20);
    canvas.addEventListener('click', startGame, { once: true });
}

function draw() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhost();
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 10);
}

function drawPacman() {
    let rotation = 0;
    if (pacman.direction === 'down') rotation = 0.5 * Math.PI;
    if (pacman.direction === 'left') rotation = Math.PI;
    if (pacman.direction === 'up') rotation = 1.5 * Math.PI;
    context.save();
    context.translate(pacman.x + box / 2, pacman.y + box / 2);
    context.rotate(rotation);
    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(0, 0, box / 2 * 0.9, 0.2 * Math.PI, 1.8 * Math.PI);
    context.lineTo(0, 0);
    context.fill();
    context.restore();
}

function drawGhost() {
    context.fillStyle = ghost.color;
    context.beginPath();
    const radius = box / 2 * 0.9;
    context.arc(ghost.x + box / 2, ghost.y + box / 2, radius, Math.PI, 0);
    context.lineTo(ghost.x + box * 0.95, ghost.y + box);
    context.lineTo(ghost.x + box * 0.05, ghost.y + box);
    context.closePath();
    context.fill();
}

function gameLoop() {
    updatePacman();
    updateGhost();
    checkCollisions();
    checkWin();
    draw();
}

function startGame() {
    resetGame();
    game = setInterval(gameLoop, 150);
}

document.addEventListener('keydown', e => {
    const keyMap = { 'ArrowLeft': 'left', 'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down' };
    if (keyMap[e.key]) {
        pacman.requestedDirection = keyMap[e.key];
    }
});

startGame();
