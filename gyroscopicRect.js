function setup() {
    createCanvas(innerWidth, innerHeight - 4);
}

function draw() {
    background(0);
    fill(255);
    textSize(32);
    text(`X: ${accelerationX}`, width / 2, height / 4);
    text(`Y: ${accelerationY}`, width / 2, height / 2);
    text(`Z: ${accelerationZ}`, width / 2, 3 * height / 4);
}

