let rectPos = [];
let rectSize = [];
let hueValue = 0;
let ball;
function setup() {
    createCanvas(innerWidth, innerHeight - 4);
    resizeRect();
    colorMode(HSB, 360, 255, 255);
    ball = new Ball();
}

function resizeRect() {
    rectSize = [width / 2, height / 2];
    rectPos = [width / 2 - rectSize[0] / 2, height / 2 - rectSize[1] / 2];
}

function draw() {
    background(0);
    noFill();
    stroke([hueValue, 255, 255]);
    rect(...rectPos, ...rectSize);
    ball.update();
    hueValue += 2;
    if (hueValue >= 360) hueValue = 0;
}

function windowResized() {
    resizeCanvas(innerWidth, innerHeight - 4);
    resizeRect();
    ball.restart();
}

function Ball() {
    this.radius = 10;
    this.hitPoses = [];
    this.vel = 10;
    this.restart = () => {
        this.pos = createVector(rectPos[0] + this.radius + 2, rectPos[1] + this.radius + 2);
        this.direction = createVector(1, 1);
        this.hitPoses = [];
    }
    this.restart();
    this.draw = () => {
        let col = [hueValue, 255, 255];
        stroke(255, 0, 0);
        strokeWeight(2);
        fill(col);
        circle(this.pos.x, this.pos.y, this.radius * 2);
        for (let i = 0; i < this.hitPoses.length; i++) {
            let pos = this.hitPoses[i];
            strokeWeight(1);
            stroke(col);
            line(pos.x, pos.y, this.pos.x, this.pos.y)
        }
    }
    this.move = () => {
        this.pos.x += this.vel * this.direction.x;
        this.pos.y += this.vel * this.direction.y;
        let hitPos = createVector(this.pos.x, this.pos.y);
        let hit = false;
        if (this.pos.x + this.radius + this.vel > rectPos[0] + rectSize[0]) this.direction.x = -1, hitPos.x = this.pos.x + this.radius + this.vel, hit = true;
        else if (this.pos.x - this.radius - this.vel < rectPos[0]) this.direction.x = 1, hitPos.x = this.pos.x - this.radius - this.vel, hit = true;
        if (this.pos.y + this.radius + this.vel > rectPos[1] + rectSize[1]) this.direction.y = -1, hitPos.y = this.pos.y + this.radius + this.vel, hit = true;
        else if (this.pos.y - this.radius - this.vel < rectPos[1]) this.direction.y = 1, hitPos.y = this.pos.y - this.radius - this.vel, hit = true;
        if (hit) {
            hitPos.x = constrain(hitPos.x, rectPos[0], rectPos[0] + rectSize[0]);
            hitPos.y = constrain(hitPos.y, rectPos[1], rectPos[1] + rectSize[1]);
            this.hitPoses.push(hitPos);
        }
    }
    this.update = () => {
        this.move();
        this.draw();
    }
}