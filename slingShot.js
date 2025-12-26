let objs = [];
let start = [];
let end = [];
let score = 0;
function setup() {
    createCanvas(windowWidth, windowHeight - 4);
    objs.push(new Obj(width / 2, height / 2, [0, 0]))
}
function mousePressed() {
    start = [mouseX, mouseY];
    end = [...start];
}
function mouseDragged() {
    end = [mouseX, mouseY];
}
function mouseReleased() {
    objs.push(new Obj(end[0], end[1], [map(start[0] - end[0], -100, 100, -10, 10), map(start[1] - end[1], -100, 100, -10, 10)]))
    start = [], end = [];
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 4);
}
function draw() {
    background(51);
    for (let i = objs.length - 1; i >= 0; i--) {
        let obj = objs[i];
        if (obj.update()) {
            objs.splice(i, 1);
        }
        obj.show();
        for (let j = objs.length - 1; j >= 0; j--) {
            if (obj != objs[j]) {
                if (dist(obj.x, obj.y, objs[j].x, objs[j].y) < 10 && !obj.haveScored && !objs[j].haveScored) {
                    score++;
                    obj.haveScored = true;
                    objs[j].haveScored = true;
                }
            }
        }
    }
    fill(255);
    textSize(20);
    text(`Score: ${score}`, 10, 30);
    if (start.length && end.length) {
        stroke(255);
        line(start[0], start[1], end[0], end[1]);
        fill(255, 0, 0);
        stroke(0);
        circle(end[0], end[1], 10);
    }
}
function Obj(x, y, vel) {
    this.x = x;
    this.y = y;
    this.haveScored = false;
    this.vel = createVector(vel[0], vel[1]);
    this.radius = 5;
    this.gravity = .2;
    this.show = () => {
        fill(255, 0, 0);
        stroke(0);
        circle(this.x, this.y, this.radius * 2);
    }
    this.update = () => {
        this.y += this.vel.y;
        this.x += this.vel.x;
        this.vel.y += this.gravity;
        if (this.x + this.radius < 0 || this.x - this.radius > width || this.y - this.radius > height) {
            return true;
        }
    }
}