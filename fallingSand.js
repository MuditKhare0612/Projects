let grid;
let scl = 20;
let cols, rows;
let hueVal = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight - 4);
    colorMode(HSB, 360, 255, 255);
    cols = floor(width / scl);
    rows = floor(height / scl);
    grid = make2DArray(cols, rows);
}

function draw() {
    background(0);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            if (state === 0) continue;
            let color = [state, 255, 255];
            fill(color);
            stroke(color);
            rect(i * scl, j * scl, scl);
        }
    }

    let nextGrid = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            let dir = 1;
            if (random(1) < .5) {
                dir *= -1;
            }
            let below, belowA, belowB;
            if (j + 1 < rows) {
                below = grid[i][j + 1];
            }
            if (i + dir >= 0 && i + dir <= cols - 1) {
                belowA = grid[i + dir][j + 1];
            }
            if (i - dir >= 0 && i - dir <= cols - 1) {
                belowB = grid[i - dir][j + 1];
            }
            if (state) {
                if (below === 0) {
                    nextGrid[i][j + 1] = state;
                } else if (belowA === 0) {
                    nextGrid[i + dir][j + 1] = state;
                } else if (belowB === 0) {
                    nextGrid[i - dir][j + 1] = state;
                } else {
                    nextGrid[i][j] = state;
                }
            }
        }
    }

    grid = nextGrid;
}

function mouseDragged() {
    if (constrain(mouseX, 0, width - 1) !== mouseX) return
    let mouseCol = floor(mouseX / scl);
    let mouseRow = floor(mouseY / scl);
    let matrix = 20;
    let extent = floor(matrix / 2);
    for (let i = -extent; i <= extent; i++) {
        for (let j = -extent; j <= extent; j++) {
            if (!(random(1) < .1)) continue;
            let col = mouseCol + i;
            let row = mouseRow + j;
            if (col >= 0 && col <= cols - 1 && row >= 0 && row <= rows - 1 && !grid[col][row]) {
                grid[col][row] = hueVal;
            }
        }
    }
    hueVal += 1;
    if (hueVal >= 360) hueVal = 0;
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}


